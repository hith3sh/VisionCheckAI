import tensorflow as tf
import numpy as np
import cv2
import matplotlib.pyplot as plt
import os
import uuid
from model_loader import get_model

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# images should be on the front-end/public/assets/gradcam_assets to be displayed on the results page
GRADCAM_ASSETS_DIR = os.path.join(BASE_DIR, '../front-end/public/assets/gradcam_assets') 
os.makedirs(GRADCAM_ASSETS_DIR, exist_ok=True)

model = get_model()

def generate_gradcam(original_image, image, tabular_data, layer_name='conv2d_1'):
    try:
        # Generate a random filename using UUID
        filename = f'gradcam_{uuid.uuid4()}.png'
        output_path = os.path.join(GRADCAM_ASSETS_DIR, filename)
        
        # Create GradCAM model
        grad_model = tf.keras.models.Model(
            [model.inputs],
            [model.get_layer(layer_name).output, model.output]
        )

        # Generate gradients
        with tf.GradientTape() as tape:
            conv_outputs, predictions = grad_model([image, tabular_data])
            loss = predictions[:, np.argmax(predictions[0])]

        # Extract gradients and feature map
        grads = tape.gradient(loss, conv_outputs)
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        conv_outputs = conv_outputs[0]
        
        # Generate heatmap
        heatmap = tf.reduce_mean(tf.multiply(pooled_grads, conv_outputs), axis=-1)
        heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
        heatmap = heatmap.numpy()
        
        
        # Resize heatmap to match original image size
        heatmap = cv2.resize(heatmap, (224, 224))
        heatmap = np.uint8(255 * heatmap)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        
        original_image_resized = cv2.resize(original_image, (heatmap.shape[1], heatmap.shape[0]))

        # Superimpose heatmap on original image
        try:
            superimposed = cv2.addWeighted(original_image_resized, 0.6, heatmap, 0.4, 0)
        except Exception as e:
            raise e
        
        # Save the visualization
        try:
            result = cv2.imwrite(output_path, cv2.cvtColor(superimposed, cv2.COLOR_RGB2BGR))
            if not result:
                print("cv2.imwrite failed to save the image")
        except Exception as e:
            print(f"Error saving file: {str(e)}")
            raise e
        print(f"GRAD-CAM img saved to: {output_path}")
        return filename

    except Exception as e:
        print(f"Error in generate_gradcam: {str(e)}")
        raise e

# def preprocess_image(image_bytes):
#     image = cv2.imread(image_bytes)
#     image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convert to RGB
#     ## crop the image
#     crop_box = (600, 300, 1600, 1200)
#     height , width = image.shape[:2]
#     if height == 1934 and width == 2576:
#         print('cropping the image')
#         x, y, w, h = crop_box
#         cropped_image = image[y:y+h, x:x+w]

#         # Normalize intensity to range [0, 255]
#         normalized_image = cv2.normalize(cropped_image, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX)
#         # Convert to LAB color space
#         lab_image = cv2.cvtColor(normalized_image, cv2.COLOR_BGR2LAB)
#         # Apply CLAHE to the L channel
#         l, a, b = cv2.split(lab_image)
#         clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
#         l = clahe.apply(l)
#         # Merge the channels back
#         enhanced_image = cv2.merge((l, a, b))
#         # Convert back to BGR color space
#         enhanced_image = cv2.cvtColor(enhanced_image, cv2.COLOR_LAB2BGR)
#         image = enhanced_image
    
#     # Resize the image to match model input size
#     image = cv2.resize(image, (224, 224))
#     # Normalize to [0, 1] for model input
#     image_array = image / 255.0
#     image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
#     return image_array
