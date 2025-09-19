import { supabase } from '@/integrations/supabase/client';

export const createDemoUser = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: 'test@cloudcast.demo',
    password: 'demo123',
    options: {
      emailRedirectTo: `${window.location.origin}/`
    }
  });
  
  if (error) {
    console.error('Error creating demo user:', error);
    return { success: false, error };
  }
  
  console.log('Demo user created successfully:', data);
  return { success: true, data };
};

export const getDemoCredentials = () => ({
  email: 'test@cloudcast.demo',
  password: 'demo123'
});

export const DEMO_API_KEY_INSTRUCTIONS = `
🔑 Get your free OpenWeatherMap API key:
1. Visit: https://openweathermap.org/api
2. Sign up for a free account
3. Generate your API key
4. Enter it in CloudCast to see real weather data

⚡ The API key is stored locally and never sent to our servers.
`;

export const DEMO_FEATURES = [
  '🌤️ Real-time weather conditions',
  '📊 5-day detailed forecasts', 
  '🗣️ Voice search functionality',
  '📱 Progressive Web App (PWA)',
  '🌍 Multi-language support (8 languages)',
  '👤 User authentication & preferences',
  '❤️ Favorite cities management',
  '📶 Offline weather caching',
  '🌙 Dark/Light theme toggle',
  '🌡️ Celsius/Fahrenheit toggle'
];