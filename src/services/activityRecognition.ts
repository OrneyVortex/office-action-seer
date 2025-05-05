
import { Activity } from '@/components/ActivityCard';

// This simulates a trained CNN+LSTM model processing
// In a real implementation, this would use TensorFlow.js or a backend API
export const recognizeActivity = async (videoFile: File): Promise<Activity[]> => {
  console.log('Processing video file:', videoFile.name);
  
  // Simulate processing time with a more realistic delay based on file size
  const processingTime = Math.min(3000 + (videoFile.size / (1024 * 1024) * 500), 8000);
  await new Promise(resolve => setTimeout(resolve, processingTime));
  
  // Pre-defined activities our model can recognize with improved detail
  const possibleActivities = [
    'sitting', 'standing', 'walking', 'typing', 'reading', 
    'talking', 'writing', 'drinking', 'using phone'
  ];
  
  // Generate more accurate results based on filename patterns
  const generateEnhancedResults = (): Activity[] => {
    // Create a bias based on the file name for demo purposes
    let biasedActivity = 'sitting'; // default bias
    let secondaryActivity = '';
    
    const fileName = videoFile.name.toLowerCase();
    
    // Primary activity detection with improved pattern matching
    if (fileName.includes('walk')) biasedActivity = 'walking';
    if (fileName.includes('stand')) biasedActivity = 'standing';
    if (fileName.includes('sit')) biasedActivity = 'sitting';
    if (fileName.includes('typ') || fileName.includes('keyboard')) biasedActivity = 'typing';
    if (fileName.includes('read')) biasedActivity = 'reading';
    if (fileName.includes('talk') || fileName.includes('speak')) biasedActivity = 'talking';
    if (fileName.includes('writ') || fileName.includes('pen')) biasedActivity = 'writing';
    if (fileName.includes('drink') || fileName.includes('coffee')) biasedActivity = 'drinking';
    if (fileName.includes('phone') || fileName.includes('call')) biasedActivity = 'using phone';
    
    // Secondary activity detection
    if (biasedActivity === 'sitting' && fileName.includes('typ')) secondaryActivity = 'typing';
    if (biasedActivity === 'standing' && fileName.includes('talk')) secondaryActivity = 'talking';
    
    // Generate activity scores with improved accuracy
    const results = possibleActivities.map(activity => {
      // Base confidence is very low (more realistic for irrelevant activities)
      let confidence = 1 + Math.random() * 10;
      
      // If this is our biased activity, boost its confidence significantly
      if (activity === biasedActivity) {
        confidence = 85 + Math.random() * 10; // 85-95%
      }
      
      // If this is a secondary activity, give it a decent confidence
      if (activity === secondaryActivity) {
        confidence = 45 + Math.random() * 15; // 45-60%
      }
      
      // Context-based confidence adjustments
      if (biasedActivity === 'sitting' && activity === 'standing') confidence = Math.max(confidence, 5); // can't do both
      if (biasedActivity === 'walking' && activity === 'sitting') confidence = Math.max(confidence, 3); // can't do both
      
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
  
  return generateEnhancedResults();
};
