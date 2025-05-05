import tensorflow as tf
import numpy as np
import cv2
import matplotlib.pyplot as plt
import os
import uuid
from model_loader import get_model
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# images should be on the front-end/public/assets/gradcam_assets to be displayed on the results page

#GRADCAM_ASSETS_DIR = os.path.join(BASE_DIR, '../front-end/public/assets/gradcam_assets/') 
GRADCAM_ASSETS_DIR = os.path.join('/app/assets', 'gradcam_assets')
os.makedirs(GRADCAM_ASSETS_DIR, exist_ok=True)

model = get_model()

def generate_gradcam(original_image, image, tabular_data, uid, layer_name='conv2d_5'):
    try:
        # Generate a random filename using UUID
        time_now = datetime.now().strftime("%Y%m%d-%H%M%S")
        filename =f'{time_now}.png'
        folder_path = os.path.join(GRADCAM_ASSETS_DIR, uid)
        os.makedirs(folder_path, exist_ok=True)
        output_path = os.path.join(folder_path, filename)
        uidpath = uid + '/' + filename
        # Create GradCAM model
        grad_model = tf.keras.models.Model(
            [model.inputs],
            [model.get_layer(layer_name).output, model.output]
        )

        image = tf.convert_to_tensor(image, dtype=tf.float32)
        tabular_data = tf.convert_to_tensor(tabular_data, dtype=tf.float32)

        zero_tabular = tf.zeros_like(tabular_data)

        # Generate gradients
        with tf.GradientTape() as tape:
            conv_outputs, predictions = grad_model([image, zero_tabular])
            loss = predictions[:, np.argmax(predictions[0])]

        # Extract gradients and feature map
        grads = tape.gradient(loss, conv_outputs)
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        conv_outputs = conv_outputs[0]
        
        # Generate heatmap
        heatmap = tf.reduce_sum(tf.multiply(pooled_grads, conv_outputs), axis=-1)
        heatmap = tf.maximum(heatmap, 0)
        max_val = tf.math.reduce_max(heatmap)
        heatmap = heatmap / (max_val + 1e-10)
        heatmap = heatmap.numpy()
        # print('heatmap', heatmap)
        # print("Predictions:", predictions.numpy())
        # print("Conv Output shape:", conv_outputs.shape)

        
        # Resize heatmap to match original image size
        heatmap = cv2.resize(heatmap, (224, 224))
        heatmap = np.uint8(255 * heatmap)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        
        original_image_resized = cv2.resize(original_image, (heatmap.shape[1], heatmap.shape[0]))

        # Superimpose heatmap on original image
        try:
            superimposed = cv2.addWeighted(original_image_resized, 0.5, heatmap, 0.5, 0)
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
        return uidpath

    except Exception as e:
        print(f"Error in generate_gradcam: {str(e)}")
        raise e
