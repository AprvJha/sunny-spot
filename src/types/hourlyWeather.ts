export interface HourlyForecastItem {
  dt: number;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  pop: number; // Probability of precipitation
  rain?: {
    "1h": number;
  };
  snow?: {
    "1h": number;
  };
}

export interface HourlyWeatherData {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  hourly: HourlyForecastItem[];
}