import tensorflow as tf
import os
from tensorflow.keras.layers import Layer
import keras
    
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
#MODEL_PATH = os.path.join(BASE_DIR, '../weights/retinal_fusion_model.h5')
MODEL_PATH = os.path.join('weights', 'retinal_fusion_model.h5')

_fusion_model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully")

def get_model():
    return _fusion_model