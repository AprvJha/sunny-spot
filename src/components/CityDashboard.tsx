import { useState, useEffect } from 'react';
import { WeatherData, TemperatureUnit } from '../types/weather';
import { weatherApi } from '../services/weatherApi';
import { WeatherCard } from './WeatherCard';
import { LoadingSpinner } from './LoadingSpinner';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';

interface CityDashboardProps {
  temperatureUnit: TemperatureUnit;
  onCitySelect: (city: string) => void;
}

interface SavedCity {
  name: string;
  weather: WeatherData;
  lastUpdated: number;
}

export const CityDashboard = ({ temperatureUnit, onCitySelect }: CityDashboardProps) => {
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSavedCities();
  }, []);

  const loadSavedCities = () => {
    const stored = localStorage.getItem('savedCities');
    if (stored) {
      try {
        const cities = JSON.parse(stored);
        setSavedCities(cities);
        refreshCitiesWeather(cities);
      } catch (error) {
        console.error('Error loading saved cities:', error);
      }
    }
  };

  const refreshCitiesWeather = async (cities: SavedCity[]) => {
    if (!weatherApi.hasApiKey()) return;
    
    setIsLoading(true);
    const updatedCities: SavedCity[] = [];

    for (const city of cities) {
      try {
        const weather = await weatherApi.getCurrentWeather(city.name);
        updatedCities.push({
          name: city.name,
          weather,
          lastUpdated: Date.now()
        });
      } catch (error) {
        // Keep the old data if refresh fails
        updatedCities.push(city);
      }
    }

    setSavedCities(updatedCities);
    localStorage.setItem('savedCities', JSON.stringify(updatedCities));
    setIsLoading(false);
  };

  const addCity = async (cityName: string) => {
    if (!weatherApi.hasApiKey()) {
      toast({
        title: "API Key Required",
        description: "Please set your OpenWeatherMap API key first.",
        variant: "destructive",
      });
      return;
    }

    if (savedCities.some(city => city.name.toLowerCase() === cityName.toLowerCase())) {
      toast({
        title: "City Already Added",
        description: `${cityName} is already in your dashboard.`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const weather = await weatherApi.getCurrentWeather(cityName);
      const newCity: SavedCity = {
        name: weather.name,
        weather,
        lastUpdated: Date.now()
      };

      const updatedCities = [...savedCities, newCity];
      setSavedCities(updatedCities);
      localStorage.setItem('savedCities', JSON.stringify(updatedCities));

      toast({
        title: "City Added",
        description: `${weather.name} has been added to your dashboard.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add city. Please check the name and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeCity = (cityName: string) => {
    const updatedCities = savedCities.filter(city => city.name !== cityName);
    setSavedCities(updatedCities);
    localStorage.setItem('savedCities', JSON.stringify(updatedCities));

    toast({
      title: "City Removed",
      description: `${cityName} has been removed from your dashboard.`,
    });
  };

  const handleCityClick = (cityName: string) => {
    onCitySelect(cityName);
  };

  if (savedCities.length === 0) {
    return (
      <div className="modern-card p-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto opacity-20"></div>
          <h3 className="text-xl font-semibold text-foreground">
            No cities in your dashboard
          </h3>
          <p className="text-muted-foreground">
            Search for cities to add them to your personal weather dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Your Cities</h2>
        {isLoading && <LoadingSpinner />}
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {savedCities.map((city) => (
          <div key={city.name} className="relative group">
            <div 
              className="cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => handleCityClick(city.name)}
            >
              <WeatherCard
                weather={city.weather}
                temperatureUnit={temperatureUnit}
                compact={true}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 bg-black/20 hover:bg-black/40 text-white"
              onClick={(e) => {
                e.stopPropagation();
                removeCity(city.name);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export function for external use
export const addCityToDashboard = async (cityName: string): Promise<boolean> => {
  if (!weatherApi.hasApiKey()) return false;
  
  try {
    const stored = localStorage.getItem('savedCities');
    const cities = stored ? JSON.parse(stored) : [];
    
    if (cities.some((city: SavedCity) => city.name.toLowerCase() === cityName.toLowerCase())) {
      return false; // Already exists
    }

    const weather = await weatherApi.getCurrentWeather(cityName);
    const newCity: SavedCity = {
      name: weather.name,
      weather,
      lastUpdated: Date.now()
    };

    const updatedCities = [...cities, newCity];
    localStorage.setItem('savedCities', JSON.stringify(updatedCities));
    return true;
  } catch (error) {
    return false;
  }
};
