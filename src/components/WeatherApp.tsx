import { useState, useEffect, useCallback } from 'react';
import { weatherApi, getLocationFromBrowser } from '../services/weatherApi';
import { WeatherData, ForecastData, TemperatureUnit } from '../types/weather';
import { SearchBar } from './SearchBar';
import { WeatherCard } from './WeatherCard';
import { ForecastChart } from './ForecastChart';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { TemperatureToggle } from './TemperatureToggle';
import { ApiKeyModal } from './ApiKeyModal';
import { ThemeToggle } from './ThemeToggle';
import { OfflineIndicator } from './OfflineIndicator';
import { WeatherBackground } from './WeatherBackground';
import { CityDashboard } from './CityDashboard';
import { LocalTimeWidget } from './LocalTimeWidget';
import { PopularCities } from './PopularCities';
import { VoiceSearch } from './VoiceSearch';
import { SettingsModal } from './SettingsModal';
import { AuthModal } from './AuthModal';
import { useOfflineWeather } from '../hooks/useOfflineWeather';
import { useSettings } from '@/contexts/SettingsContext';
import { useNotifications } from '@/hooks/useNotifications';
import { usePWA } from '@/hooks/usePWA';
import { useTranslations } from '@/hooks/useTranslations';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export const WeatherApp = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState('');
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('celsius');
  
  const { preferences, addToFavorites } = useSettings();
  const { checkForExtremeWeather } = useNotifications();
  const { isInstallable, installApp } = usePWA();
  const t = useTranslations();

  const { isOnline, saveWeatherData, getCachedWeatherData } = useOfflineWeather();

  const fetchWeatherData = useCallback(async (city: string) => {
    if (!weatherApi.hasApiKey()) {
      setError('Please set your API key first');
      return;
    }

    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const languageMap: Record<string, string> = {
        en: 'en', es: 'es', fr: 'fr', de: 'de', it: 'it', pt: 'pt', ru: 'ru', zh: 'zh',
      };
      
      const lang = languageMap[preferences.language] || 'en';
      
      const [weatherData, forecastData] = await Promise.all([
        weatherApi.getCurrentWeather(city, lang),
        weatherApi.getForecast(city, lang)
      ]);

      setCurrentWeather(weatherData);
      setForecast(forecastData);
      setCurrentCity(city);
      saveWeatherData(weatherData, forecastData);
      localStorage.setItem('lastSearchedCity', city);
      
      checkForExtremeWeather(weatherData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      
      const cached = getCachedWeatherData();
      if (cached) {
        setCurrentWeather(cached.weather);
        setForecast(cached.forecast);
        setCurrentCity(cached.city);
        toast.info('Showing cached weather data');
      }
    } finally {
      setLoading(false);
    }
  }, [saveWeatherData, getCachedWeatherData, preferences.language, checkForExtremeWeather]);

  // Sync temperature unit with preferences
  useEffect(() => {
    setTemperatureUnit(preferences.temperature_unit);
  }, [preferences.temperature_unit]);

  // Load default city or last searched city
  useEffect(() => {
    const defaultCity = preferences.default_city;
    const lastCity = localStorage.getItem('lastSearchedCity');
    
    if (defaultCity) {
      fetchWeatherData(defaultCity);
    } else if (lastCity) {
      fetchWeatherData(lastCity);
    }
  }, [fetchWeatherData, preferences.default_city]);

  const handleLocationSearch = async () => {
    try {
      const location = await getLocationFromBrowser();
      const weatherData = await weatherApi.getCurrentWeatherByCoords(location.latitude, location.longitude);
      fetchWeatherData(weatherData.name);
    } catch (err) {
      toast.error('Failed to get your location');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 relative overflow-hidden">
      <WeatherBackground condition={currentWeather ? 'clear' : 'clear'} />
      
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-white">CloudCast</h1>
            {isInstallable && (
              <Button onClick={installApp} size="sm" className="bg-primary/20 hover:bg-primary/30 text-white border border-white/20">
                <Download className="h-4 w-4 mr-2" />
                Install App
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <TemperatureToggle unit={temperatureUnit} onToggle={setTemperatureUnit} />
            <VoiceSearch onResult={fetchWeatherData} disabled={loading} />
            <SettingsModal />
            <AuthModal />
            <ThemeToggle />
            <ApiKeyModal />
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <SearchBar onSearch={fetchWeatherData} disabled={loading} />
          <PopularCities onCitySelect={fetchWeatherData} isLoading={loading} />
        </div>

        <OfflineIndicator isOnline={isOnline} />

        {error ? (
          <ErrorMessage message={error} onRetry={() => fetchWeatherData(currentCity)} />
        ) : loading ? (
          <LoadingSpinner />
        ) : currentWeather && forecast ? (
          <div className="space-y-8">
            <WeatherCard weather={currentWeather} temperatureUnit={temperatureUnit} />
            <LocalTimeWidget cityName={currentWeather.name} timezoneOffset={currentWeather.timezone} country={currentWeather.sys.country} />
            <CityDashboard currentWeather={currentWeather} temperatureUnit={temperatureUnit} onAddCity={fetchWeatherData} />
            <ForecastChart forecast={forecast} temperatureUnit={temperatureUnit} />
          </div>
        ) : null}
      </main>
    </div>
  );
};