import { useState } from 'react';
import { ForecastData, TemperatureUnit } from '../types/weather';
import { convertTemperature, getTemperatureSymbol, getWeatherIconUrl } from '../utils/weatherUtils';
import { Button } from './ui/button';
import { Calendar, Clock } from 'lucide-react';

interface OptimizedHourlyForecastProps {
  forecast: ForecastData;
  temperatureUnit: TemperatureUnit;
}

export const OptimizedHourlyForecast = ({ forecast, temperatureUnit }: OptimizedHourlyForecastProps) => {
  const [viewMode, setViewMode] = useState<'hourly' | 'daily'>('hourly');

  const processHourlyData = () => {
    return forecast.list.slice(0, 24).map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
        hour: 'numeric',
        hour12: true 
      }),
      temp: convertTemperature(item.main.temp, temperatureUnit),
      icon: item.weather[0].icon,
      description: item.weather[0].description,
      pop: Math.round(item.pop * 100)
    }));
  };

  const processDailyData = () => {
    const dailyData: { [key: string]: any } = {};
    
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          temps: [],
          icons: {},
          descriptions: {},
          pop: []
        };
      }
      
      dailyData[date].temps.push(item.main.temp);
      dailyData[date].icons[item.weather[0].icon] = (dailyData[date].icons[item.weather[0].icon] || 0) + 1;
      dailyData[date].descriptions[item.weather[0].description] = true;
      dailyData[date].pop.push(item.pop);
    });

    return Object.values(dailyData).slice(0, 5).map((day: any) => {
      const maxTemp = Math.max(...day.temps);
      const minTemp = Math.min(...day.temps);
      const mostCommonIcon = Object.keys(day.icons).reduce((a, b) => 
        day.icons[a] > day.icons[b] ? a : b
      );
      const avgPop = Math.round(day.pop.reduce((a: number, b: number) => a + b, 0) / day.pop.length * 100);
      
      return {
        date: new Date(day.date).toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }),
        maxTemp: convertTemperature(maxTemp, temperatureUnit),
        minTemp: convertTemperature(minTemp, temperatureUnit),
        icon: mostCommonIcon,
        description: Object.keys(day.descriptions)[0],
        pop: avgPop
      };
    });
  };

  const hourlyData = processHourlyData();
  const dailyData = processDailyData();
  const displayData = viewMode === 'hourly' ? hourlyData : dailyData;

  return (
    <div className="modern-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">
          {viewMode === 'hourly' ? '24-Hour' : '5-Day'} Forecast
        </h3>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'hourly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('hourly')}
            className="gap-2"
          >
            <Clock className="h-4 w-4" />
            Hourly
          </Button>
          <Button
            variant={viewMode === 'daily' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('daily')}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            Daily
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-4 min-w-max">
          {displayData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-3 min-w-[80px] p-3 rounded-lg bg-gradient-surface hover:bg-primary/5 transition-all duration-200 hover-lift"
            >
              <div className="text-sm font-medium text-muted-foreground text-center">
                {viewMode === 'hourly' ? item.time : item.date}
              </div>
              
              <div className="relative">
                <img
                  src={getWeatherIconUrl(item.icon)}
                  alt={item.description}
                  className="w-12 h-12 object-contain"
                />
              </div>
              
              {viewMode === 'hourly' ? (
                <div className="text-lg font-bold text-foreground">
                  {item.temp}{getTemperatureSymbol(temperatureUnit)}
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-sm font-bold text-foreground">
                    {item.maxTemp}°
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.minTemp}°
                  </div>
                </div>
              )}
              
              {item.pop > 0 && (
                <div className="text-xs text-blue-500 font-medium">
                  {item.pop}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};