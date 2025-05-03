
import React, { useState } from 'react';
import { Activity } from '@/components/ActivityCard';
import FileUpload from '@/components/FileUpload';
import ResultsDisplay from '@/components/ResultsDisplay';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { recognizeActivity } from '@/services/activityRecognition';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const { toast } = useToast();

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    // Only set the file, don't process automatically
  };

  const handleAnalyzeClick = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setActivities([]);

    try {
      const results = await recognizeActivity(file);
      setActivities(results);
      
      // Toast notification for the detected activity
      const mainActivity = results.find(a => a.isActive);
      if (mainActivity) {
        toast({
          title: "Activity detected",
          description: `The main activity in this video is ${mainActivity.name}`,
        });
      }
    } catch (error) {
      console.error('Error processing video:', error);
      toast({
        title: "Processing Error",
        description: "There was an error analyzing the video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setActivities([]);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold mb-4">Human Activity Recognition</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload a video clip of office activity and our AI will identify what's happening
            using CNN and LSTM neural networks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <h2 className="text-2xl font-bold mb-6">Upload Video</h2>
              <FileUpload 
                onFileSelected={handleFileSelected}
                onAnalyzeClick={handleAnalyzeClick}
                onReset={handleReset}
                isProcessing={isProcessing}
                hasResults={activities.length > 0}
              />
              
              {file && !isProcessing && activities.length > 0 && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Success!</span> Video analyzed successfully.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <ResultsDisplay 
              activities={activities} 
              isLoading={isProcessing} 
            />
            
            {!isProcessing && activities.length === 0 && file && (
              <div className="text-center py-16 border border-dashed rounded-lg">
                <p className="text-muted-foreground">
                  Click the Analyze button to process the video
                </p>
              </div>
            )}

            {!isProcessing && activities.length === 0 && !file && (
              <div className="text-center py-16 text-muted-foreground">
                <p>Upload a video to see activity recognition results</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
