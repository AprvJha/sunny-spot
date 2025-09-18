import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  loading: boolean;
}

export interface UserPreferences {
  id?: string;
  user_id?: string;
  favorite_cities: string[];
  default_city?: string;
  temperature_unit: 'celsius' | 'fahrenheit';
  theme_preference: 'light' | 'dark' | 'system';
  language: 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'zh';
  notifications_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}