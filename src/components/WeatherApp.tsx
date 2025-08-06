import { useState, useEffect } from 'react';
import { WeatherData, ForecastData, TemperatureUnit } from '../types/weather';
import { HourlyWeatherData } from '../types/hourlyWeather';
import { weatherApi, getLocationFromBrowser } from '../services/weatherApi';
import { getWeatherCondition, getBackgroundClass, isDay } from '../utils/weatherUtils';
import { ApiKeyModal } from './ApiKeyModal';
import { SearchBar } from './SearchBar';
import { WeatherCard } from './WeatherCard';
import { ForecastChart } from './ForecastChart';
import { HourlyForecast } from './HourlyForecast';
import { WeatherWidgets } from './WeatherWidgets';
import { LoadingSpinner, SkeletonWeatherCard } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { ThemeToggle } from './ThemeToggle';
import { TemperatureToggle } from './TemperatureToggle';
import { toast } from '@/hooks/use-toast';

export const WeatherApp = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('celsius');
  const [backgroundCondition, setBackgroundCondition] = useState<string>('bg-gradient-clear');

  // Initialize app
  useEffect(() => {
    // Check for API key
    if (!weatherApi.hasApiKey()) {
      setShowApiKeyModal(true);
      return;
    }

    // Load saved temperature unit
    const savedUnit = localStorage.getItem('temperatureUnit') as TemperatureUnit;
    if (savedUnit) {
      setTemperatureUnit(savedUnit);
    }

    // Load last searched city or use geolocation
    const lastCity = localStorage.getItem('lastSearchedCity');
    if (lastCity) {
      searchWeather(lastCity);
    } else {
      handleLocationSearch();
    }
  }, []);

  // Update background based on weather conditions
  useEffect(() => {
    if (currentWeather) {
      const isDayTime = isDay(
        Date.now() / 1000,
        currentWeather.sys.sunrise,
        currentWeather.sys.sunset,
        currentWeather.timezone
      );
      
      const condition = getWeatherCondition(currentWeather.weather[0].main, isDayTime);
      const bgClass = getBackgroundClass(condition);
      setBackgroundCondition(bgClass);
    }
  }, [currentWeather]);

  const handleApiKeySet = (apiKey: string) => {
    weatherApi.setApiKey(apiKey);
    setShowApiKeyModal(false);
    setError(null);
    
    // Try to load weather for user's location
    handleLocationSearch();
    
    toast({
      title: "API Key Set",
      description: "Successfully connected to OpenWeatherMap.",
    });
  };

  const searchWeather = async (city: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        weatherApi.getCurrentWeather(city),
        weatherApi.getForecast(city)
      ]);

      setCurrentWeather(weatherData);
      setForecast(forecastData);
      
      // Fetch hourly forecast using coordinates
      try {
        const hourlyData = await weatherApi.getHourlyForecast(
          weatherData.coord.lat, 
          weatherData.coord.lon
        );
        setHourlyForecast(hourlyData);
      } catch (hourlyError) {
        console.warn('Hourly forecast not available:', hourlyError);
        setHourlyForecast(null);
      }
      
      // Save last searched city
      localStorage.setItem('lastSearchedCity', city);
      
      toast({
        title: "Weather Updated",
        description: `Showing weather for ${weatherData.name}, ${weatherData.sys.country}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      setCurrentWeather(null);
      setForecast(null);
      setHourlyForecast(null);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const location = await getLocationFromBrowser();
      const [weatherData, forecastData] = await Promise.all([
        weatherApi.getCurrentWeatherByCoords(location.latitude, location.longitude),
        weatherApi.getForecastByCoords(location.latitude, location.longitude)
      ]);

      setCurrentWeather(weatherData);
      setForecast(forecastData);
      
      // Fetch hourly forecast
      try {
        const hourlyData = await weatherApi.getHourlyForecast(location.latitude, location.longitude);
        setHourlyForecast(hourlyData);
      } catch (hourlyError) {
        console.warn('Hourly forecast not available:', hourlyError);
        setHourlyForecast(null);
      }
      
      // Save the city name for future reference
      localStorage.setItem('lastSearchedCity', weatherData.name);
      
      toast({
        title: "Location Found",
        description: `Showing weather for your current location: ${weatherData.name}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
      
      toast({
        title: "Location Error", 
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (currentWeather) {
      searchWeather(currentWeather.name);
    }
  };

  const handleTemperatureToggle = (unit: TemperatureUnit) => {
    setTemperatureUnit(unit);
    localStorage.setItem('temperatureUnit', unit);
  };

  const handleRetry = () => {
    setError(null);
    const lastCity = localStorage.getItem('lastSearchedCity');
    if (lastCity) {
      searchWeather(lastCity);
    } else {
      handleLocationSearch();
    }
  };

  return (
    <div className={backgroundCondition}>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <header className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              Weather Now
            </h1>
            <p className="text-muted-foreground">
              Beautiful weather forecasts at your fingertips
            </p>
          </div>
          
          <div className="flex gap-2">
            <TemperatureToggle 
              unit={temperatureUnit} 
              onToggle={handleTemperatureToggle} 
            />
            <ThemeToggle />
          </div>
        </header>

        {/* Search Bar */}
        <SearchBar 
          onSearch={searchWeather}
          onLocationSearch={handleLocationSearch}
          onRefresh={handleRefresh}
          isLoading={isLoading}
          currentCity={currentWeather?.name || ''}
        />

        {/* Content */}
        <main className="space-y-8">
          {error ? (
            <ErrorMessage 
              message={error}
              onRetry={handleRetry}
              onShowApiKeyModal={() => setShowApiKeyModal(true)}
              showApiKeyButton={weatherApi.hasApiKey()}
            />
          ) : isLoading ? (
            <>
              <SkeletonWeatherCard />
              <div className="w-full max-w-4xl mx-auto">
                <LoadingSpinner message="Fetching weather forecast..." />
              </div>
            </>
          ) : currentWeather && forecast ? (
            <>
              <WeatherCard 
                weather={currentWeather} 
                temperatureUnit={temperatureUnit} 
              />
              
              <WeatherWidgets 
                weather={currentWeather} 
                temperatureUnit={temperatureUnit} 
              />
              
              {hourlyForecast && (
                <HourlyForecast 
                  hourlyData={hourlyForecast.hourly} 
                  temperatureUnit={temperatureUnit}
                  timezoneOffset={hourlyForecast.timezone_offset}
                />
              )}
              
              <ForecastChart 
                forecast={forecast} 
                temperatureUnit={temperatureUnit} 
              />
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                Search for a city or use your location to get started
              </p>
            </div>
          )}
        </main>

        {/* API Key Modal */}
        <ApiKeyModal 
          isOpen={showApiKeyModal} 
          onApiKeySet={handleApiKeySet} 
        />
      </div>
    </div>
  );
};