export interface Translations {
  common: {
    search: string;
    settings: string;
    save: string;
    cancel: string;
    close: string;
    loading: string;
    error: string;
    success: string;
    retry: string;
  };
  weather: {
    temperature: string;
    feelsLike: string;
    humidity: string;
    windSpeed: string;
    pressure: string;
    visibility: string;
    sunrise: string;
    sunset: string;
    forecast: string;
    hourly: string;
    daily: string;
    today: string;
    tomorrow: string;
  };
  auth: {
    signIn: string;
    signUp: string;
    signOut: string;
    email: string;
    password: string;
    confirmPassword: string;
    forgotPassword: string;
    createAccount: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
  };
  settings: {
    title: string;
    language: string;
    temperatureUnit: string;
    celsius: string;
    fahrenheit: string;
    theme: string;
    light: string;
    dark: string;
    system: string;
    notifications: string;
    defaultCity: string;
    favoriteCities: string;
    addToFavorites: string;
    removeFromFavorites: string;
  };
  cities: {
    popular: string;
    recent: string;
    favorites: string;
    addCity: string;
    removeCity: string;
    noFavorites: string;
  };
  voice: {
    searchByVoice: string;
    listening: string;
    clickToSpeak: string;
    speechNotSupported: string;
  };
  notifications: {
    weatherAlert: string;
    enableNotifications: string;
    notificationPermission: string;
    extremeWeather: string;
  };
  offline: {
    youreOffline: string;
    cachedData: string;
    lastUpdated: string;
  };
}

export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'zh';