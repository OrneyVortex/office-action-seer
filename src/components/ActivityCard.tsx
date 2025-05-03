
import React from 'react';
import { Check } from 'lucide-react';

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
    <div className={`activity-card p-4 border rounded-lg ${activity.isActive ? 'active' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium capitalize">{activity.name}</h3>
        {activity.isActive && (
          <div className="bg-primary/20 text-primary rounded-full p-1">
            <Check size={16} />
          </div>
        )}
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${activity.confidence}%` }}
        />
      </div>
      
      <div className="text-sm text-right mt-1 font-medium">
        {activity.confidence.toFixed(1)}%
      </div>
    </div>
  );
};

export default ActivityCard;
