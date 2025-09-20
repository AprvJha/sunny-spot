import { useState, useEffect, useCallback } from 'react';
import { WeatherData, ForecastData, TemperatureUnit, WeatherCondition } from '../types/weather';
import { weatherApi, getLocationFromBrowser } from '../services/weatherApi';
import { getWeatherCondition, getBackgroundClass, isDay } from '../utils/weatherUtils';
import { ApiKeyModal } from './ApiKeyModal';
import { SearchBar } from './SearchBar';
import { WeatherCard } from './WeatherCard';
import { ForecastChart } from './ForecastChart';
import { OptimizedHourlyForecast } from './OptimizedHourlyForecast';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { ThemeToggle } from './ThemeToggle';
import { TemperatureToggle } from './TemperatureToggle';
import { WeatherBackground } from './WeatherBackground';
import { CityDashboard, addCityToDashboard } from './CityDashboard';
import { LocalTimeWidget } from './LocalTimeWidget';
import { PopularCities } from './PopularCities';
import { toast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import weatherLogo from '@/assets/weather-logo.png';

export const WeatherApp = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('celsius');
  const [backgroundCondition, setBackgroundCondition] = useState<string>('bg-gradient-hero');
  const [weatherCondition, setWeatherCondition] = useState<WeatherCondition>('clear');
  const [showDashboard, setShowDashboard] = useState(false);

  // Initialize app
  useEffect(() => {
    // Load saved temperature unit
    const savedUnit = localStorage.getItem('temperatureUnit') as TemperatureUnit;
    if (savedUnit) {
      setTemperatureUnit(savedUnit);
    }

    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }

    // Check for API key
    if (!weatherApi.hasApiKey()) {
      setShowApiKeyModal(true);
      return;
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
      setWeatherCondition(condition);
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

  const searchWeather = useCallback(async (city: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        weatherApi.getCurrentWeather(city),
        weatherApi.getForecast(city)
      ]);

      setCurrentWeather(weatherData);
      setForecast(forecastData);
      
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
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLocationSearch = useCallback(async () => {
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
  }, []);

  const handleRefresh = () => {
    if (currentWeather) {
      searchWeather(currentWeather.name);
    }
  };

  const addToFavorites = async () => {
    if (!currentWeather) return;
    
    const success = await addCityToDashboard(currentWeather.name);
    if (success) {
      toast({
        title: "City Added",
        description: `${currentWeather.name} has been added to your dashboard.`,
      });
    } else {
      toast({
        title: "Already Added",
        description: `${currentWeather.name} is already in your dashboard.`,
        variant: "destructive",
      });
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

  const handleCitySelect = (cityName: string) => {
    searchWeather(cityName);
    setShowDashboard(false);
  };

  return (
    <div className={`min-h-screen ${backgroundCondition} transition-all duration-1000 relative overflow-hidden`}>
      {/* Weather Background Animation */}
      <WeatherBackground condition={weatherCondition} />
      {/* Navigation Bar */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={weatherLogo} 
                alt="Weather App Logo" 
                className="h-12 w-12 object-contain drop-shadow-lg"
              />
              <div className="absolute -inset-1 bg-gradient-primary rounded-full opacity-20 blur-sm"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Weather App</h1>
              <p className="text-sm text-muted-foreground font-medium">Simple & Clean</p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-3">
            <Button
              variant={showDashboard ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowDashboard(!showDashboard)}
              className="gap-2"
            >
              Dashboard
            </Button>
            <TemperatureToggle 
              unit={temperatureUnit} 
              onToggle={handleTemperatureToggle} 
            />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-12">
        {showDashboard ? (
          <div className="space-y-8">
            <CityDashboard 
              temperatureUnit={temperatureUnit}
              onCitySelect={handleCitySelect}
            />
          </div>
        ) : (
          <>
            {/* Hero Search Section */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Weather Made Simple
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Get precise weather forecasts for any location
                </p>
              </div>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <SearchBar 
                  onSearch={searchWeather}
                  onLocationSearch={handleLocationSearch}
                  onRefresh={handleRefresh}
                  isLoading={isLoading}
                  currentCity={currentWeather?.name || ''}
                />
              </div>
            </div>

            {/* Popular Cities Quick Access */}
            {!currentWeather && !isLoading && (
              <div className="mb-12">
                <PopularCities onCitySelect={searchWeather} />
              </div>
            )}

            {/* Weather Content */}
            <div className="space-y-8">
          {error ? (
            <div className="max-w-2xl mx-auto">
              <ErrorMessage 
                message={error}
                onRetry={handleRetry}
                onShowApiKeyModal={() => setShowApiKeyModal(true)}
                showApiKeyButton={!weatherApi.hasApiKey()}
              />
            </div>
          ) : isLoading ? (
            <div className="max-w-4xl mx-auto">
              <LoadingSpinner message="Fetching weather data..." />
            </div>
          ) : currentWeather && forecast ? (
            <div className="space-y-8">
              {/* Main Weather Card with Add to Favorites */}
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addToFavorites}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add to Dashboard
                  </Button>
                </div>
                <WeatherCard 
                  weather={currentWeather} 
                  temperatureUnit={temperatureUnit} 
                />
              </div>
              
              {/* Local Time Widget */}
              <div className="max-w-4xl mx-auto">
                <LocalTimeWidget 
                  timezone={currentWeather.timezone}
                  cityName={currentWeather.name}
                />
              </div>
              
              {/* Enhanced Forecast Section */}
              <div className="max-w-6xl mx-auto space-y-8">
                <OptimizedHourlyForecast 
                  forecast={forecast} 
                  temperatureUnit={temperatureUnit} 
                />
                
                <ForecastChart 
                  forecast={forecast} 
                  temperatureUnit={temperatureUnit} 
                />
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center py-20">
              <div className="modern-card p-12">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto opacity-20"></div>
                  <h3 className="text-2xl font-semibold text-foreground">
                    Ready to explore?
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Search for any city or use your current location to get started
                  </p>
                </div>
              </div>
            </div>
          )}
          </>
        )}
      </main>

      {/* API Key Modal */}
      <ApiKeyModal 
        isOpen={showApiKeyModal} 
        onApiKeySet={handleApiKeySet} 
      />
    </div>
  );
};