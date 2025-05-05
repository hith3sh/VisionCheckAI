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
from datetime import datetime
import joblib

fusion_model = get_model()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# images should be on the front-end/public/assets/gradcam_assets to be displayed on the results page

# SHAP_ASSETS_DIR = os.path.join(BASE_DIR, '../front-end/public/assets/shap_assets/')
SHAP_ASSETS_DIR = os.path.join(BASE_DIR, 'shared_volume', 'shap_assets')

os.makedirs(SHAP_ASSETS_DIR, exist_ok=True)
MINMAXSCALAR = os.path.join(BASE_DIR, 'weights', 'minmax_scaler.pkl')
PICKLE_PATH = os.path.join(BASE_DIR, 'weights', 'shap_explainer.pkl.bz2')


tabular_features = ["Age", "Gender", "dioptre_1", "dioptre_2","astigmatism","Phakic_Pseudophakic","Pneumatic","Pachymetry","Axial_Length"]

scaler = joblib.load(MINMAXSCALAR)

with bz2.BZ2File(PICKLE_PATH, 'rb') as f:
    explainer = pickle.load(f)


def generate_shap(image, tabular_data, uid):
    try:
        folder_path = os.path.join(SHAP_ASSETS_DIR, uid)
        os.makedirs(folder_path, exist_ok=True)
        time_now = datetime.now().strftime("%Y%m%d-%H%M%S")
        filename =f'{time_now}.png'
        filepath = os.path.join(folder_path, filename)
        uidpath = uid + '/' + filename
        # Generate SHAP values from explainer
        tabular_data_normalized = scaler.transform(tabular_data)

        shap_values = explainer.shap_values([image, tabular_data_normalized])
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
        
        return uidpath

    except Exception as e:
        print(f"Error generating SHAP plot: {str(e)}")
        raise e
