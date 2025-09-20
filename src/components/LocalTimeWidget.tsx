import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { formatLocalTime } from '../utils/weatherUtils';

interface LocalTimeWidgetProps {
  timezone: number;
  cityName: string;
  compact?: boolean;
}

export const LocalTimeWidget = ({ timezone, cityName, compact = false }: LocalTimeWidgetProps) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(formatLocalTime(timezone));
    };

    // Update immediately
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [timezone]);

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>{currentTime}</span>
      </div>
    );
  }

  return (
    <div className="modern-card p-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div className="absolute -inset-1 bg-gradient-primary rounded-full opacity-20 blur-sm"></div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg">Local Time</h3>
          <p className="text-sm text-muted-foreground">{cityName}</p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground font-mono">
            {currentTime}
          </div>
        </div>
      </div>
    </div>
  );
};