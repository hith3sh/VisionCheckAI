import tensorflow as tf
import numpy as np
import cv2
import matplotlib.pyplot as plt
import tensorflow as tf
import os

def generate_gradcam(image_path, model, layer_name='conv2d_1', save_dir='static/gradcam'):
    """
    Generate GradCAM visualization for a given image and model
    
    Args:
        image_path (str): Path to the input image
        model: Loaded tensorflow model
        layer_name (str): Name of the layer to use for GradCAM
        save_dir (str): Directory to save the output visualization
        
    Returns:
        str: Path to the saved GradCAM visualization
    """
    # Create save directory if it doesn't exist
    os.makedirs(save_dir, exist_ok=True)
    
    # Read and preprocess the image
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # # Apply the same preprocessing as in your main app
    # height, width = image.shape[:2]
    # if height == 1934 and width == 2576:
    #     x, y, w, h = (600, 300, 1600, 1200)  # crop box
    #     image = image[y:y+h, x:x+w]
        
    #     # Normalize and enhance
    #     image = cv2.normalize(image, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX)
    #     lab_image = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
    #     l, a, b = cv2.split(lab_image)
    #     clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    #     l = clahe.apply(l)
    #     enhanced_image = cv2.merge((l, a, b))
    #     image = cv2.cvtColor(enhanced_image, cv2.COLOR_LAB2RGB)
    
    # Resize and normalize
    original_image = cv2.resize(image, (224, 224))
    input_image = original_image / 255.0
    input_image = np.expand_dims(input_image, axis=0)

    # Create GradCAM model
    grad_model = tf.keras.models.Model(
        [model.inputs],
        [model.get_layer(layer_name).output, model.output]
    )

    # Generate gradients
    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(input_image)
        class_idx = tf.argmax(predictions[0])
        loss = predictions[:, class_idx]

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
    
    # Superimpose heatmap on original image
    superimposed = cv2.addWeighted(original_image, 0.6, heatmap, 0.4, 0)
    
    # Save the visualization
    output_path = os.path.join(save_dir, f'gradcam_{os.path.basename(image_path)}')
    cv2.imwrite(output_path, cv2.cvtColor(superimposed, cv2.COLOR_RGB2BGR))
    
    return output_path

# Example usage:
if __name__ == "__main__":
    # Load your model
    model = tf.keras.models.load_model('../weights/glaucoma_cnn_model.h5')
    
    # Test the function
    image_path = "path/to/test/image.jpg"
    output_path = generate_gradcam(image_path, model)
    print(f"GradCAM visualization saved to: {output_path}") 