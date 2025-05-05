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
    // We're using MobileNet as our base model for activity detection
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
        // We'll sample multiple frames from the video for better analysis
        video.currentTime = video.duration * 0.25; // First sample at 25%
      };
      
      // Track which frame we're on (for multi-frame processing)
      let frameCount = 0;
      const totalFramesToSample = 5;
      const frameTensors: tf.Tensor[] = [];
      
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
            
          frameTensors.push(imageTensor);
          frameCount++;
          
          // If we haven't processed enough frames yet, seek to the next position
          if (frameCount < totalFramesToSample) {
            video.currentTime = video.duration * ((frameCount + 1) / (totalFramesToSample + 1));
          } else {
            // We've processed all frames, now combine them
            // Stack all frames together for batch processing
            const combinedTensor = tf.concat(frameTensors, 0);
            
            // Clean up individual frame tensors
            frameTensors.forEach(tensor => tensor.dispose());
            URL.revokeObjectURL(videoUrl);
            
            resolve(combinedTensor);
          }
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

/**
 * Extract features from video frames using our model
 */
export const extractFeatures = async (frames: tf.Tensor, model: tf.LayersModel): Promise<number[]> => {
  try {
    // Get activation from the second-to-last layer of MobileNet
    const activationModel = tf.model({
      inputs: model.inputs,
      outputs: model.layers[model.layers.length - 2].output
    });
    
    // Run the activation model on our frames
    const activation = activationModel.predict(frames) as tf.Tensor;
    
    // Average the activations across frames to get a single feature vector
    const meanActivation = activation.mean(0);
    
    // Convert to array
    const features = await meanActivation.data() as Float32Array;
    
    // Clean up tensors
    tf.dispose([activation, meanActivation]);
    
    // Return as regular array
    return Array.from(features);
  } catch (error) {
    console.error('Error extracting features:', error);
    throw new Error('Failed to extract features from video');
  }
}

/**
 * Classify activities based on extracted features
 */
export const classifyActivities = (features: number[]): Activity[] => {
  // Create a classifier for the features
  // This is a simplified approach - in a real system, you'd have a trained classifier
  
  // Create simulated classifier weights for each activity
  // In a real system, these would come from your trained model
  const activityWeights: Record<string, number[]> = {};
  
  // Generate weights for each activity
  ACTIVITY_CLASSES.forEach(activity => {
    // Create a signature of key features for each activity
    // This is just a simulation of what a real classifier would do
    const activityVector = new Array(features.length).fill(0);
    
    // Simulate activity signatures based on the activity type
    if (activity === 'sitting') {
      // Lower body features would be more prominent
      for (let i = 0; i < features.length; i++) {
        if (i % 7 === 0) activityVector[i] = 0.8;
      }
    } else if (activity === 'walking') {
      // Motion features would be more prominent
      for (let i = 0; i < features.length; i++) {
        if (i % 5 === 0) activityVector[i] = 0.9;
      }
    } else if (activity === 'typing') {
      // Upper body and hand features
      for (let i = 0; i < features.length; i++) {
        if (i % 11 === 0) activityVector[i] = 0.85;
      }
    }
    // Other activities would have their own patterns
    
    activityWeights[activity] = activityVector;
  });
  
  // Calculate similarity scores between our features and each activity signature
  const results = ACTIVITY_CLASSES.map(activity => {
    const weights = activityWeights[activity];
    
    // Calculate dot product as similarity
    let similarity = 0;
    for (let i = 0; i < features.length && i < weights.length; i++) {
      similarity += features[i] * weights[i];
    }
    
    // Normalize to 0-100 confidence
    const confidence = Math.min(Math.max((similarity * 100), 0), 100);
    
    return {
      name: activity,
      confidence,
      isActive: false
    };
  });
  
  // Add some variation based on feature patterns
  results.forEach(result => {
    // Add variation based on feature patterns
    const variation = features.reduce((sum, val, idx) => {
      // Use different parts of the feature vector for different activities
      if (result.name === 'sitting' && idx % 7 === 0) return sum + val;
      if (result.name === 'walking' && idx % 5 === 0) return sum + val * 2;
      if (result.name === 'typing' && idx % 11 === 0) return sum + val * 1.5;
      return sum;
    }, 0);
    
    // Apply the variation (normalized)
    result.confidence = Math.min(Math.max(result.confidence + variation * 10, 5), 95);
  });
  
  // Sort by confidence (highest first)
  results.sort((a, b) => b.confidence - a.confidence);
  
  // Mark the highest confidence as active
  if (results.length > 0) {
    results[0].isActive = true;
  }
  
  return results;
}
