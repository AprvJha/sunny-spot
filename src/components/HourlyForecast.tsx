import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HourlyForecastItem } from '@/types/hourlyWeather';
import { TemperatureUnit } from '@/types/weather';
import { convertTemperature, getTemperatureSymbol, getWeatherIconUrl } from '@/utils/weatherUtils';

interface HourlyForecastProps {
  hourlyData: HourlyForecastItem[];
  temperatureUnit: TemperatureUnit;
  timezoneOffset: number;
}

export const HourlyForecast = ({ hourlyData, temperatureUnit, timezoneOffset }: HourlyForecastProps) => {
  // Show next 24 hours
  const next24Hours = hourlyData.slice(0, 24);

  const formatHour = (timestamp: number): string => {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      timeZone: 'UTC'
    });
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Hourly Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {next24Hours.map((hour, index) => (
              <div 
                key={hour.dt} 
                className="flex flex-col items-center min-w-[80px] p-3 rounded-lg bg-background/20 border border-border/50 backdrop-blur-sm hover:bg-background/30 transition-all duration-200"
              >
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  {index === 0 ? 'Now' : formatHour(hour.dt)}
                </div>
                
                <img 
                  src={getWeatherIconUrl(hour.weather[0].icon)} 
                  alt={hour.weather[0].description}
                  className="w-8 h-8 mb-1"
                />
                
                <div className="text-lg font-bold text-foreground mb-1">
                  {convertTemperature(hour.temp, temperatureUnit)}{getTemperatureSymbol(temperatureUnit)}
                </div>
                
                {hour.pop > 0 && (
                  <div className="text-xs text-blue-400 flex items-center gap-1">
                    <span>💧</span>
                    <span>{Math.round(hour.pop * 100)}%</span>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round(hour.wind_speed)} m/s
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};