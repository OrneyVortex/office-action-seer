
import { Activity } from '@/components/ActivityCard';

// This simulates a trained CNN+LSTM model processing
// In a real implementation, this would use TensorFlow.js or a backend API
export const recognizeActivity = async (videoFile: File): Promise<Activity[]> => {
  console.log('Processing video file:', videoFile.name);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Pre-defined activities our model can recognize
  const possibleActivities = ['sitting', 'standing', 'walking', 'typing', 'reading', 'talking'];
  
  // Generate mock confidence scores
  // In a real implementation, these would come from the model
  const generateMockResults = (): Activity[] => {
    // Create a bias based on the file name for demo purposes
    let biasedActivity = 'sitting'; // default bias
    
    const fileName = videoFile.name.toLowerCase();
    if (fileName.includes('walk')) biasedActivity = 'walking';
    if (fileName.includes('stand')) biasedActivity = 'standing';
    if (fileName.includes('sit')) biasedActivity = 'sitting';
    if (fileName.includes('type')) biasedActivity = 'typing';
    if (fileName.includes('read')) biasedActivity = 'reading';
    if (fileName.includes('talk')) biasedActivity = 'talking';
    
    // Generate random confidence scores with bias towards one activity
    const results = possibleActivities.map(activity => {
      // Base confidence is random between 5-30%
      let confidence = 5 + Math.random() * 25;
      
      // If this is our biased activity, boost its confidence
      if (activity === biasedActivity) {
        confidence = 75 + Math.random() * 20; // 75-95%
      }
      
      return {
        name: activity,
        confidence,
        isActive: false
      };
    });
    
    // Sort by confidence (highest first)
    results.sort((a, b) => b.confidence - a.confidence);
    
    // Mark the highest confidence as active
    if (results.length > 0) {
      results[0].isActive = true;
    }
    
    return results;
  };
  
  return generateMockResults();
};
