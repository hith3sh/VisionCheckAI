from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from PIL import Image
import io
import pickle
import shap
import matplotlib.pyplot as plt
import cv2
import json
import shap
from get_shap import generate_shap
from get_gradcam import generate_gradcam
from get_shap import fusion_model
import jwt 
import firebase_admin
from firebase_admin import credentials, auth
import time
import os
from dotenv import load_dotenv

load_dotenv()  # Load from .env file

BACKEND_BASE_URL = os.getenv("VITE_PYTHON_BACKEND_URL", "http://localhost:5000")

# Load Firebase service account credentials
cred = credentials.Certificate("glaucoma-c9752-firebase-adminsdk-fbsvc-26b167ec2f.json")
firebase_admin.initialize_app(cred)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

crop_box = (600, 300, 1600, 1200) # crop box for image sizes :height: 1934, width: 2576
# 'OS' (left eye): 0,
#  'OD' (right eye): 1
# Diagnosis	
# 0	-> normal control
# 1	-> early glaucoma
# 2	-> advanced glaucoma

app = Flask(__name__)
CORS(app)


def get_original_image(image_bytes):
    image_array = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convert to RGB
    return image

def preprocess_image(image_bytes):
    image_array = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convert to RGB
    ## crop the image
    height , width = image.shape[:2]
    if height == 1934 and width == 2576:
        print('cropping the image')
        x, y, w, h = crop_box
        cropped_image = image[y:y+h, x:x+w]

        # Normalize intensity to range [0, 255]
        normalized_image = cv2.normalize(cropped_image, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX)
        # Convert to LAB color space
        lab_image = cv2.cvtColor(normalized_image, cv2.COLOR_BGR2LAB)
        # Apply CLAHE to the L channel
        l, a, b = cv2.split(lab_image)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        l = clahe.apply(l)
        # Merge the channels back
        enhanced_image = cv2.merge((l, a, b))
        # Convert back to BGR color space
        enhanced_image = cv2.cvtColor(enhanced_image, cv2.COLOR_LAB2BGR)
        image = enhanced_image
    
    # Resize the image to match model input size
    image = cv2.resize(image, (224, 224))
    # Normalize to [0, 1] for model input
    image_array = image / 255.0
    image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
    return image_array

def get_uid_from_token(id_token):
    """Verifies Firebase ID token and extracts user UID"""
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token.get("uid")
    except Exception as e:
        print("Token verification failed:", e)
        return None
    
def glaucoma_state(prediction):
    predicted_class = int(np.argmax(prediction[0]))
    if predicted_class == 0:
        glaucoma_stage = 'normal control'
    elif predicted_class == 1:
        glaucoma_stage = 'early glaucoma'
    else:
        glaucoma_stage = 'advanced glaucoma'
    return glaucoma_stage


@app.route('/assets/gradcam_assets/<path:subpath>')
def serve_gradcam(subpath):
    gradcam_dir = os.path.join(BASE_DIR, 'shared_volume', 'gradcam_assets')
    return send_from_directory(gradcam_dir, subpath)

@app.route('/assets/shap_assets/<path:subpath>')
def serve_shap(subpath):
    shap_dir = os.path.join(BASE_DIR, 'shared_volume', 'shap_assets')
    return send_from_directory(shap_dir, subpath)


def safe_send(directory, filename):
    """Helper to prevent directory traversal attacks."""
    full_path = os.path.join(directory, filename)
    if not os.path.isfile(full_path):
        abort(404)
    return send_from_directory(directory, filename)



@app.route('/predict', methods=['POST'])
def predict():
    try:
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Unauthorized"}), 401

        id_token = auth_header.split("Bearer ")[1]

        uid = get_uid_from_token(id_token)
        if not uid:
            return jsonify({"error": "User ID not found in token"}), 400

        left_image = request.files.get("leftImage")
        right_image = request.files.get("rightImage")

        if not left_image or not right_image:
            return jsonify({"error": "Both leftImage and rightImage are required"}), 400
        
        image_bytes_left_eye = left_image.read()
        image_bytes_right_eye = right_image.read()

        # Get tabular data
        # extract and parse json data
        data = request.form.get('data')
        if not data:
            return jsonify({"error":"Missing data field"}),400
        try:
            data_dict = json.loads(data)
        except json.JSONDecodeError as e:
            return jsonify({"error": f"Invalid JSON data: {str(e)}"}), 400

         # Extract fields from the parsed JSON data
        # Helper function to handle empty strings and assign default values
        def handle_empty(value, default):
            return default if value == "" else value

        # Extract fields from the parsed JSON data
        # Basic patient information
        gender = data_dict.get("gender")
        age = handle_empty(data_dict.get("age"), None)

        # Left eye measurements
        leftDioptre1 = handle_empty(data_dict.get("leftDioptre1"), -0.071738)
        leftDioptre2 = handle_empty(data_dict.get("leftDioptre2"), 0.0018)
        leftAstigmatism = handle_empty(data_dict.get("leftAstigmatism"),  0.047846)
        leftLens = handle_empty(data_dict.get("leftLens"), 'no')
        leftPneumatic = handle_empty(data_dict.get("leftPneumatic"), 0.163287)
        leftPachymetry = handle_empty(data_dict.get("leftPachymetry"), 0.969737)
        leftAxialLength = handle_empty(data_dict.get("leftAxialLength"), 0.096287)

        # Right eye measurements  
        rightDioptre1 = handle_empty(data_dict.get("rightDioptre1"), -0.071738)
        rightDioptre2 = handle_empty(data_dict.get("rightDioptre2"), 0.0018)
        rightAstigmatism = handle_empty(data_dict.get("rightAstigmatism"),0.047846)
        rightLens = handle_empty(data_dict.get("rightLens"), 'no')
        rightPneumatic = handle_empty(data_dict.get("rightPneumatic"),  0.163287)
        rightPachymetry = handle_empty(data_dict.get("rightPachymetry"), 0.969737)
        rightAxialLength = handle_empty(data_dict.get("rightAxialLength"),  0.096287)

        if leftLens == 'no':
            leftLens = 0
        else:
            leftLens = 1

        if rightLens == 'no':
            rightLens= 0
        else:
            rightLens = 1

        if gender == 'male':
            gender = 1.0
        else: 
            gender = 0.0
                
        # Preprocess the images
        left_eye_image = preprocess_image(image_bytes_left_eye)
        right_eye_image = preprocess_image(image_bytes_right_eye)
        # get original images
        original_left_image = get_original_image(image_bytes_left_eye)
        original_right_image = get_original_image(image_bytes_right_eye)


        # Preprocess the tabular data
        left_tabular_data_arr = [age, 
                            gender,
                            leftDioptre1,
                            leftDioptre2,
                            leftAstigmatism,
                            leftLens,
                            leftPneumatic,
                            leftPachymetry,
                            leftAxialLength,
                            ]
        
        right_tabular_data_arr = [age, 
                             gender,
                             rightDioptre1,
                             rightDioptre2, 
                             rightAstigmatism,
                             rightLens,
                             rightPneumatic,
                             rightPachymetry,
                             rightAxialLength,
                             ]
        # tabualr data should be expanded dimensions before passing to shap and gradcam
        left_tabular_array = np.array([left_tabular_data_arr], dtype=np.float32) 
        right_tabular_array = np.array([right_tabular_data_arr], dtype=np.float32)

        # feed in to the fusion model  - left & right eye
        left_prediction = fusion_model.predict({'image_input': left_eye_image, 'tabular_input': left_tabular_array})
        right_prediction = fusion_model.predict({'image_input': right_eye_image, 'tabular_input': right_tabular_array})
        # left_prediction = fusion_model.predict([left_eye_image, left_tabular_array])
        # right_prediction = fusion_model.predict([right_eye_image, right_tabular_array])
        
        # get glaucoma stage 
        left_glaucoma_stage = glaucoma_state(left_prediction)
        right_glaucoma_stage = glaucoma_state(right_prediction)

        print("glaucoma prediction for right eye:",right_glaucoma_stage)
        print("glaucoma prediction for left eye", left_glaucoma_stage)

        # Explainable AI
        # SHAP
        left_shap_filename = generate_shap(left_eye_image, left_tabular_array, uid)
        right_shap_filename = generate_shap(right_eye_image, right_tabular_array, uid)
 
        # GradCAM
        left_gradcam_filename = generate_gradcam(original_left_image, left_eye_image, left_tabular_array, uid)
        print('left gradcam path', left_gradcam_filename)
        time.sleep(3)
        right_gradcam_filename = generate_gradcam(original_right_image, right_eye_image, right_tabular_array, uid)
        print('right gradcam path', right_gradcam_filename)

        # Build URLs pointing to Flask routes
        left_shap_url = f"{BACKEND_BASE_URL}/assets/shap_assets/{left_shap_filename}"
        right_shap_url = f"{BACKEND_BASE_URL}/assets/shap_assets/{right_shap_filename}"
        left_gradcam_url = f"{BACKEND_BASE_URL}/assets/gradcam_assets/{left_gradcam_filename}"
        right_gradcam_url = f"{BACKEND_BASE_URL}/assets/gradcam_assets/{right_gradcam_filename}"

        
        return jsonify({
            "glaucoma_state_right_eye": right_glaucoma_stage,
            "glaucoma_state_left_eye": left_glaucoma_stage,
            "left_shap_path": left_shap_url,
            "right_shap_path": right_shap_url,
            "left_gradcam_path": left_gradcam_url,
            "right_gradcam_path": right_gradcam_url
            }),200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# endpoint to describe API
@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "message": "Glaucoma Detection API",
        "usage": {
            "endpoint": "/predict",
            "method": "POST",
            "parameters": {
                "image1": "Left eye image (JPEG/PNG)",
                "image2": "Right eye image (JPEG/PNG)",
                "Gender": "Patient gender (male/female)",
                "Age": "Patient age (numerical)",
                "dioptre_1": "Dioptre 1 (numerical)",
                "dioptre_2": "Dioptre 2 (numerical)",
                "astigmatism": "Astigmatism (numerical)",
                "Phakic_Pseudophakic": "Phakic/Pseudophakic (0 or 1)",
                "Pneumatic": "Pneumatic IOP (numerical)",
                "Pachymetry": "Pachymetry (numerical)",
                "Axial_Length": "Axial length (numerical)",
                "VF_MD": "Visual Field MD (numerical)",
                "Eye": "Eye (0 for OS, 1 for OD)"
            }
        }
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # Run on port 5000 with debug mode enabled