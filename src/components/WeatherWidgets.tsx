import { WeatherData, TemperatureUnit } from '../types/weather';
import { convertTemperature, getTemperatureSymbol, formatTime } from '../utils/weatherUtils';
import { Card } from './ui/card';
import { 
  Wind, 
  Eye, 
  Gauge, 
  Droplets, 
  Sunrise, 
  Sunset,
  Cloud,
  Thermometer
} from 'lucide-react';

interface WeatherWidgetsProps {
  weather: WeatherData;
  temperatureUnit: TemperatureUnit;
}

export const WeatherWidgets = ({ weather, temperatureUnit }: WeatherWidgetsProps) => {
  const tempSymbol = getTemperatureSymbol(temperatureUnit);
  const feelsLike = convertTemperature(weather.main.feels_like, temperatureUnit);
  const windSpeed = temperatureUnit === 'fahrenheit' 
    ? Math.round(weather.wind.speed * 2.237) // Convert m/s to mph
    : Math.round(weather.wind.speed * 3.6); // Convert m/s to km/h
  const windUnit = temperatureUnit === 'fahrenheit' ? 'mph' : 'km/h';
  
  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const widgets = [
    {
      id: 'feels-like',
      title: 'Feels Like',
      value: `${feelsLike}${tempSymbol}`,
      icon: Thermometer,
      description: 'Perceived temperature'
    },
    {
      id: 'wind',
      title: 'Wind',
      value: `${windSpeed} ${windUnit}`,
      icon: Wind,
      description: `${getWindDirection(weather.wind.deg)} direction${weather.wind.gust ? `, gusts up to ${Math.round(weather.wind.gust * (temperatureUnit === 'fahrenheit' ? 2.237 : 3.6))} ${windUnit}` : ''}`
    },
    {
      id: 'visibility',
      title: 'Visibility',
      value: `${Math.round(weather.visibility / 1000)} km`,
      icon: Eye,
      description: 'Horizontal visibility'
    },
    {
      id: 'pressure',
      title: 'Pressure',
      value: `${weather.main.pressure} hPa`,
      icon: Gauge,
      description: weather.main.sea_level ? `Sea level: ${weather.main.sea_level} hPa` : 'Atmospheric pressure'
    },
    {
      id: 'humidity',
      title: 'Humidity',
      value: `${weather.main.humidity}%`,
      icon: Droplets,
      description: 'Relative humidity'
    },
    {
      id: 'cloudiness',
      title: 'Cloudiness',
      value: `${weather.clouds.all}%`,
      icon: Cloud,
      description: 'Cloud coverage'
    },
    {
      id: 'sunrise',
      title: 'Sunrise',
      value: formatTime(weather.sys.sunrise, weather.timezone),
      icon: Sunrise,
      description: 'Local sunrise time'
    },
    {
      id: 'sunset',
      title: 'Sunset',
      value: formatTime(weather.sys.sunset, weather.timezone),
      icon: Sunset,
      description: 'Local sunset time'
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground">Weather Details</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {widgets.map((widget) => {
          const IconComponent = widget.icon;
          return (
            <Card key={widget.id} className="p-4 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
              <div className="flex items-center gap-3">
                <IconComponent className="h-5 w-5 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {widget.title}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {widget.value}
                  </p>
                  {widget.description && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {widget.description}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};