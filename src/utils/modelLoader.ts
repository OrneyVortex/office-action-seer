
import * as tf from '@tensorflow/tfjs';

// Cache the model to avoid reloading
let cachedModel: tf.LayersModel | null = null;

// Class names that our model can recognize
export const ACTIVITY_CLASSES = [
  'sitting', 'standing', 'walking', 'typing', 'reading', 
  'talking', 'writing', 'drinking', 'using phone'
];

/**
 * Loads the TensorFlow.js model from a URL or returns the cached model
 */
export const loadModel = async (): Promise<tf.LayersModel> => {
  if (cachedModel) {
    return cachedModel;
  }

  try {
    // In a real implementation, this would point to your actual model URL
    // We're using a pre-trained MobileNet model as a placeholder
    const modelUrl = 'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json';
    const model = await tf.loadLayersModel(modelUrl);
    
    console.log('Activity recognition model loaded successfully');
    cachedModel = model;
    return model;
  } catch (error) {
    console.error('Failed to load model:', error);
    throw new Error('Failed to load the activity recognition model');
  }
}

/**
 * Process a video file and extract frames for inference
 */
export const processVideo = async (videoFile: File): Promise<tf.Tensor> => {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.muted = true;
      video.playsInline = true;
      
      // Create a URL for the video file
      const videoUrl = URL.createObjectURL(videoFile);
      video.src = videoUrl;
      
      // When video metadata is loaded, we can extract frames
      video.onloadedmetadata = () => {
        // Seek to a point in the video (25% of the way through as an example)
        video.currentTime = video.duration * 0.25;
      };
      
      // When we've seeked to the right spot
      video.onseeked = async () => {
        try {
          // Create a canvas to capture a frame
          const canvas = document.createElement('canvas');
          canvas.width = 224;  // MobileNet input size
          canvas.height = 224;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          // Draw the current frame to the canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert the canvas to a tensor
          const imageTensor = tf.browser.fromPixels(canvas)
            .toFloat()
            .div(tf.scalar(127.5))
            .sub(tf.scalar(1))
            .expandDims(0);
            
          // Clean up
          URL.revokeObjectURL(videoUrl);
          
          resolve(imageTensor);
        } catch (error) {
          reject(error);
        }
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(videoUrl);
        reject(new Error('Error loading video'));
      };
      
      // Start loading the video
      video.load();
    } catch (error) {
      reject(error);
    }
  });
}
