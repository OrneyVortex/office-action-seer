
import React from 'react';
import ActivityCard, { Activity } from './ActivityCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultsDisplayProps {
  activities: Activity[];
  isLoading: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ activities, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Processing Video</CardTitle>
          <CardDescription>
            Running inference with TensorFlow.js model...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-10">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">
            Extracting features and analyzing video frames...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return null;
  }

  const topActivity = activities.find(a => a.isActive);
  const highConfidenceActivities = activities.filter(a => a.confidence > 50);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            Detected Activity: <span className="text-primary capitalize">{topActivity?.name}</span>
          </CardTitle>
          <CardDescription>
            The TensorFlow.js model analyzed {highConfidenceActivities.length} frames from your video and extracted visual features to identify the following activities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {highConfidenceActivities.length > 1 && (
            <div className="mb-4 p-3 bg-primary/5 rounded-md">
              <p className="text-sm">
                <span className="font-semibold">Note:</span> Multiple activities detected with high confidence. 
                The person might be {highConfidenceActivities.slice(0, 2).map(a => a.name).join(' and ')}.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {activities.map((activity) => (
          <ActivityCard key={activity.name} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default ResultsDisplay;
