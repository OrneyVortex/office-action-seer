
import React from 'react';
import { Check } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

export interface Activity {
  name: string;
  confidence: number;
  isActive: boolean;
}

interface ActivityCardProps {
  activity: Activity;
}

const getConfidenceColor = (confidence: number): string => {
  if (confidence > 75) return 'bg-green-500';
  if (confidence > 50) return 'bg-yellow-500';
  return 'bg-gray-400';
};

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  return (
    <div 
      className={`p-4 border rounded-lg transition-all ${
        activity.isActive 
          ? 'border-primary/50 bg-primary/5 shadow-sm' 
          : 'border-border hover:border-primary/20'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium capitalize">{activity.name}</h3>
        {activity.isActive && (
          <div className="bg-primary/20 text-primary rounded-full p-1">
            <Check size={16} />
          </div>
        )}
      </div>
      
      <Progress 
        value={activity.confidence} 
        className={`h-2 ${
          activity.isActive ? 'bg-primary/20' : 'bg-muted'
        }`}
      />
      
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-muted-foreground">
          {activity.confidence < 30 ? 'Low confidence' : 
           activity.confidence < 70 ? 'Medium confidence' : 
           'High confidence'}
        </span>
        <span className={`text-sm font-medium ${
          activity.isActive ? 'text-primary' : 'text-muted-foreground'
        }`}>
          {activity.confidence.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default ActivityCard;
