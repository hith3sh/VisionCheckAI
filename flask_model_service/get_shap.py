import shap
import numpy as np
import cv2
import pickle
import tensorflow as tf
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import os
import uuid
from model_loader import get_model
import keras
from tensorflow.keras.layers import Layer
import bz2

fusion_model = get_model()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# images should be on the front-end/public/assets/gradcam_assets to be displayed on the results page
SHAP_ASSETS_DIR = os.path.join(BASE_DIR, '../front-end/public/assets/shap_assets')
os.makedirs(SHAP_ASSETS_DIR, exist_ok=True)

PICKLE_PATH = os.path.join(BASE_DIR, '../weights/shap_explainer.pkl.bz2')

tabular_features = ["Age", "Gender", "dioptre_1", "dioptre_2","astigmatism","Phakic_Pseudophakic","Pneumatic","Pachymetry","Axial_Length"]


with bz2.BZ2File(PICKLE_PATH, 'rb') as f:
    explainer = pickle.load(f)

# with open(PICKLE_PATH, 'rb') as f:
#     explainer = pickle.load(f)

def generate_shap(image, tabular_data):
    try:
        filename = f'shap_plot_{uuid.uuid4()}.png'
        filepath = os.path.join(SHAP_ASSETS_DIR, filename)
        
        # Generate SHAP values from explainer
        shap_values = explainer.shap_values([image, tabular_data])
        shap_values_reshaped = shap_values[1][:, :, 1] 

        # Create and save the plot without displaying
        plt.figure(figsize=(10, 6))
        shap.summary_plot(
            shap_values_reshaped, 
            tabular_data,
            feature_names=tabular_features,
            plot_type="bar",
            show=False
        )
        
        # Save figure with high DPI and tight layout
        plt.savefig(
            filepath,
            dpi=300,
            bbox_inches='tight',
            format='png'
        )
        plt.close('all')  # Close all figures
        
        print(f"SHAP plot saved to: {filepath}")
        
        return filename

    except Exception as e:
        print(f"Error generating SHAP plot: {str(e)}")
        raise e

# if __name__ == "__main__":
    # Test the function
    # image_path = "cropped_image.jpg"

    # output_path = generate_shap(image_path, tabular_array_np)
    # print(f"SHAP plot saved to: {output_path}")