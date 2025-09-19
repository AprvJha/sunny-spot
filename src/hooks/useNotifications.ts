import { useEffect } from 'react';
import { WeatherData } from '@/types/weather';
import { useSettings } from '@/contexts/SettingsContext';

export const useNotifications = () => {
  const { preferences } = useSettings();

  useEffect(() => {
    // Check for notification permission
    if ('Notification' in window && preferences.notifications_enabled) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [preferences.notifications_enabled]);

  const checkForExtremeWeather = (weatherData: WeatherData) => {
    if (!preferences.notifications_enabled || Notification.permission !== 'granted') {
      return;
    }

    const { weather, main, wind } = weatherData;
    const condition = weather[0];
    
    // Define extreme weather conditions
    const isExtreme = 
      condition.id < 300 || // Thunderstorm
      condition.id >= 600 && condition.id < 700 || // Snow
      main.temp > 35 || // Very hot
      main.temp < -10 || // Very cold
      wind.speed > 15; // Strong wind

    if (isExtreme) {
      showWeatherNotification(weatherData);
    }
  };

  const showWeatherNotification = (weatherData: WeatherData) => {
    const { weather, name } = weatherData;
    const condition = weather[0];

    new Notification('Extreme Weather Alert', {
      body: `${condition.description} in ${name}. Stay safe!`,
      icon: '/cloudcast-icon.png',
      badge: '/cloudcast-icon.png',
      tag: 'weather-alert',
      requireInteraction: true,
    });
  };

  return {
    checkForExtremeWeather,
    showWeatherNotification,
  };
};