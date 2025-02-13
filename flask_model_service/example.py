import shap
import numpy as np
import cv2
import pickle
import tensorflow as tf
import matplotlib.pyplot as plt

def process_image(imagepath):
    image= cv2.imread(imagepath) 
    # Resize the image to match model input size
    image = cv2.resize(image, (224, 224))
    # Normalize to [0, 1] for model input
    image_array = image / 255.0
    image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
    return image_array

tabular_features = [
                        "Age",               # Numerical
                        "dioptre_1",         # Numerical
                        "dioptre_2",         # Numerical
                        "astigmatism",       # Numerical
                        "Phakic_Pseudophakic",  # Categorical (will be one-hot encoded)
                        "Pneumatic",         # Numerical
                        "Pachymetry",        # Numerical
                        "Axial_Length",      # Numerical
                        "VF_MD",             # Numerical
                        "Gender",            # Categorical (will be one-hot encoded)
                        "Eye"                # Categorical (will be one-hot encoded)
                    ]

gender = 0
age = 42
rightDioptre1 =  0.737636
rightDioptre2 = -1.625104
rightAstigmatism = 92.371608
rightLens =0.666667
rightPneumatic = 16.259596
rightPachymetry = 536.930380
rightAxialLength = 23.551106
rightVFMD = -4.344207
rightEye = 1

right_tabular_data_arr = [
                    age,
                    rightDioptre1,
                    rightDioptre2, 
                    rightAstigmatism,
                    rightLens,
                    rightPneumatic,
                    rightPachymetry,
                    rightAxialLength,
                    rightVFMD,
                    gender,
                    rightEye
                    ]

tabular_array_np = np.array([right_tabular_data_arr], dtype=np.float32) # adding batch dimension
print(tabular_array_np.shape) # shape (1, 11)

right_eye_image = process_image('cropped_image.jpg')

fusion_model = tf.keras.models.load_model('../weights/glaucoma_cnn_model.h5')
with open('../weights/shap_explainer.pkl', 'rb') as f:
    explainer = pickle.load(f)



#generate shap values from explainer
shap_values = explainer.shap_values([right_eye_image, tabular_array_np])
shap_values_reshaped = shap_values[1][:, :, 1] 
print('shap value shape', shap_values_reshaped.shape)  # (1, 11)

# PLOTTING SUMMARY
shap.summary_plot(shap_values_reshaped , tabular_array_np, 
                  feature_names=tabular_features,
                  plot_type="bar")

plt.savefig('shap_summary_plot.png')



