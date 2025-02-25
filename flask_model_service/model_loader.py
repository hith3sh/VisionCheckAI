import tensorflow as tf
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, '../weights/glaucoma_cnn_model.h5')

print(f"Loading model from: {MODEL_PATH}")
fusion_model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully")

def get_model():
    return fusion_model