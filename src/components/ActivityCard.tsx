
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
        className="h-2"
      />
      
      <div className="text-sm text-right mt-1 font-medium">
        {activity.confidence.toFixed(1)}%
      </div>
    </div>
  );
};

export default ActivityCard;
