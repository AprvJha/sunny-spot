import { ForecastData, TemperatureUnit } from '../types/weather';
import { convertTemperature, getTemperatureSymbol } from '../utils/weatherUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ForecastChartProps {
  forecast: ForecastData;
  temperatureUnit: TemperatureUnit;
}

export const ForecastChart = ({ forecast, temperatureUnit }: ForecastChartProps) => {
  const tempSymbol = getTemperatureSymbol(temperatureUnit);

  // Process forecast data - take one reading per day (around noon)
  const dailyForecast = forecast.list
    .filter((item, index) => index % 8 === 0) // Every 8th item (24 hours / 3 hours = 8)
    .slice(0, 5) // Next 5 days
    .map(item => {
      const date = new Date(item.dt * 1000);
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        temp: convertTemperature(item.main.temp, temperatureUnit),
        minTemp: convertTemperature(item.main.temp_min, temperatureUnit),
        maxTemp: convertTemperature(item.main.temp_max, temperatureUnit),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
      };
    });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.day}, {data.date}</p>
          <p className="text-primary">
            Temperature: {data.temp}{tempSymbol}
          </p>
          <p className="text-muted-foreground text-sm">
            High: {data.maxTemp}{tempSymbol} • Low: {data.minTemp}{tempSymbol}
          </p>
          <p className="text-muted-foreground text-sm capitalize">
            {data.description}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-card/60 backdrop-blur-lg border border-white/10 shadow-weather">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          5-Day Temperature Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyForecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ 
                    value: `Temperature (${tempSymbol})`, 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {dailyForecast.map((day, index) => (
              <div 
                key={index}
                className="bg-background/30 rounded-lg p-3 text-center space-y-2"
              >
                <div className="font-medium text-sm">{day.day}</div>
                <div className="text-xs text-muted-foreground">{day.date}</div>
                <img 
                  src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                  alt={day.description}
                  className="w-8 h-8 mx-auto"
                />
                <div className="font-bold">{day.temp}{tempSymbol}</div>
                <div className="text-xs text-muted-foreground">
                  {day.maxTemp}° / {day.minTemp}°
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};