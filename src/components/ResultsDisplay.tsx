
import React from 'react';
import ActivityCard, { Activity } from './ActivityCard';

interface ResultsDisplayProps {
  activities: Activity[];
  isLoading: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ activities, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full py-16 flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Processing video...</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return null;
  }

  const topActivity = activities.find(a => a.isActive);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>
      
      {topActivity && (
        <div className="mb-8 p-4 bg-primary/5 rounded-lg border">
          <p className="text-lg">
            Detected Activity: <span className="font-bold capitalize">{topActivity.name}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            The model has identified the primary activity in this video clip.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {activities.map((activity) => (
          <ActivityCard key={activity.name} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default ResultsDisplay;
