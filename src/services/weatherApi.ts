import { WeatherData, ForecastData, LocationData } from '../types/weather';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

class WeatherApiService {
  private apiKey: string | null = null;

  constructor() {
    this.apiKey = localStorage.getItem('weatherApiKey');
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('weatherApiKey', key);
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  hasApiKey(): boolean {
    return Boolean(this.apiKey);
  }

  private async makeRequest(endpoint: string, params: Record<string, string>): Promise<any> {
    if (!this.apiKey) {
      throw new Error('API key is required. Please set your OpenWeatherMap API key.');
    }

    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('appid', this.apiKey);
    url.searchParams.append('units', 'metric');
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
      } else if (response.status === 404) {
        throw new Error('City not found. Please check the city name and try again.');
      } else {
        throw new Error(`Weather service error: ${response.statusText}`);
      }
    }

    return response.json();
  }

  async getCurrentWeather(city: string): Promise<WeatherData> {
    return this.makeRequest('/weather', { q: city });
  }

  async getCurrentWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    return this.makeRequest('/weather', { 
      lat: lat.toString(), 
      lon: lon.toString() 
    });
  }

  async getForecast(city: string): Promise<ForecastData> {
    return this.makeRequest('/forecast', { q: city });
  }

  async getForecastByCoords(lat: number, lon: number): Promise<ForecastData> {
    return this.makeRequest('/forecast', { 
      lat: lat.toString(), 
      lon: lon.toString() 
    });
  }
}

export const weatherApi = new WeatherApiService();

export const getLocationFromBrowser = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location access denied by user.'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information is unavailable.'));
            break;
          case error.TIMEOUT:
            reject(new Error('Location request timed out.'));
            break;
          default:
            reject(new Error('An unknown error occurred while retrieving location.'));
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
};