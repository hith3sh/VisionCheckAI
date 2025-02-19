
import numpy as np
import cv2
import tensorflow as tf
import matplotlib.pyplot as plt
from PIL import Image



def process_image(imagepath):
    image= cv2.imread(imagepath) 
    # Resize the image to match model input size
    image = cv2.resize(image, (224, 224))
    # Normalize to [0, 1] for model input
    image_array = image / 255.0
    image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
    return image_array


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





# Grad-CAM implementation
def grad_cam(model, img_array, tabular_data, layer_name):
    grad_model = tf.keras.models.Model(
        inputs=[model.inputs],
        outputs=[model.get_layer(layer_name).output, model.output]
    )
    with tf.GradientTape() as tape: # tracks gradients during the forward pass
        conv_outputs, predictions = grad_model([img_array, tabular_data]) #
        loss = predictions[:, np.argmax(predictions[0])] # isolates the score of predicted class

    grads = tape.gradient(loss, conv_outputs)  # Compute gradients
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))  # Global average pooling
    conv_output = conv_outputs[0]  # Remove batch dimension
    heatmap = tf.reduce_sum(tf.multiply(pooled_grads, conv_outputs), axis=-1)
    heatmap = tf.squeeze(heatmap)
    # Normalize heatmap
    heatmap = tf.maximum(heatmap, 0)  # Apply ReLU
    heatmap /= tf.reduce_max(heatmap)
    return heatmap.numpy()

#model , image , tabular data loading
fusion_model = tf.keras.models.load_model('../weights/glaucoma_cnn_model.h5')
tabular_data = np.array([right_tabular_data_arr], dtype=np.float32) # adding batch dimension
image = process_image(image_path)


# generate grad cam heatmap
heatmap= grad_cam(fusion_model, image, tabular_data, "conv2d_1") # layer should be a CONV layer not a dense layer

# resize heatmap to match image size
heatmap_resized = cv2.resize(heatmap, (image.shape[1],image.shape[2]))

# Convert grayscale heatmap to 3-channel (RGB)
heatmap_resized = np.uint8(255 * heatmap_resized)  # Scale to 0-255
heatmap_colored = cv2.applyColorMap(heatmap_resized, cv2.COLORMAP_JET)  # Apply colormap

# superimpose heatmap on original image
print('image', image.shape, type(image))
img_cv = cv2.cvtColor((image[0] * 255).astype(np.uint8), cv2.COLOR_RGB2BGR)

# Ensure img_cv is in uint8 format
img_cv = (img_cv * 255).astype(np.uint8)

# blendin two images using weights ,
#first img, weight, second img, weight, scalar added to weighted sum
print('img_cv', img_cv.shape, type(img_cv))
print('heatmap_colored', heatmap_colored.shape, type(heatmap_colored))

superimposed_img = cv2.addWeighted(img_cv, 0.5, heatmap_colored, 0.5, 0)

# Display results
plt.figure(figsize=(10, 5))
plt.subplot(1, 3, 1)
original_image = Image.open(image_path)
plt.imshow(original_image)
plt.title("Original Image")

plt.subplot(1, 3, 2)
plt.imshow(heatmap, cmap="jet")
plt.title("Grad-CAM Heatmap")

plt.subplot(1, 3, 3)
plt.imshow(cv2.cvtColor(superimposed_img, cv2.COLOR_BGR2RGB))
plt.title("Superimposed Image")

plt.axis('off')
plt.savefig('gradcam_results.png', bbox_inches='tight', dpi=300)
plt.show()