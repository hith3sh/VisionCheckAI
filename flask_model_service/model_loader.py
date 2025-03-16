import tensorflow as tf
import os
from tensorflow.keras.layers import Layer

class ScaleLayer(Layer):
    def __init__(self, **kwargs):
        super(ScaleLayer, self).__init__(**kwargs)

    def call(self, inputs):
        return inputs * 0.8
    
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, '../weights/retinal_fusion_model_085_removed_lambda.h5')

#fusion_model = tf.keras.models.load_model(MODEL_PATH)
fusion_model = tf.keras.models.load_model(MODEL_PATH, custom_objects={'ScaleLayer': ScaleLayer})

print("Model loaded successfully")

def get_model():
    return fusion_model