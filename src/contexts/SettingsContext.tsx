import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserPreferences } from '@/types/auth';
import { Language } from '@/types/translations';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface SettingsContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  addToFavorites: (city: string) => Promise<void>;
  removeFromFavorites: (city: string) => Promise<void>;
  loading: boolean;
}

const defaultPreferences: UserPreferences = {
  favorite_cities: [],
  temperature_unit: 'celsius',
  theme_preference: 'system',
  language: 'en',
  notifications_enabled: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(false);

  // Load preferences when user changes
  useEffect(() => {
    if (user) {
      loadUserPreferences();
    } else {
      // Load from localStorage when not authenticated
      loadLocalPreferences();
    }
  }, [user]);

  const loadUserPreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user preferences:', error);
        return;
      }

      if (data) {
        const typedData: UserPreferences = {
          ...data,
          temperature_unit: data.temperature_unit as 'celsius' | 'fahrenheit',
          theme_preference: data.theme_preference as 'light' | 'dark' | 'system',
          language: data.language as any,
        };
        setPreferences(typedData);
        // Sync to localStorage
        localStorage.setItem('user_preferences', JSON.stringify(typedData));
      }
    } finally {
      setLoading(false);
    }
  };

  const loadLocalPreferences = () => {
    const stored = localStorage.getItem('user_preferences');
    if (stored) {
      try {
        const parsedPreferences = JSON.parse(stored);
        setPreferences({ ...defaultPreferences, ...parsedPreferences });
      } catch (error) {
        console.error('Error parsing stored preferences:', error);
      }
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);

    // Always update localStorage
    localStorage.setItem('user_preferences', JSON.stringify(newPreferences));

    // Update database if user is authenticated
    if (user) {
      try {
        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            ...newPreferences,
          });

        if (error) {
          console.error('Error updating user preferences:', error);
          toast.error('Failed to save preferences');
        }
      } catch (error) {
        console.error('Error updating preferences:', error);
        toast.error('Failed to save preferences');
      }
    }
  };

  const addToFavorites = async (city: string) => {
    if (!preferences.favorite_cities.includes(city)) {
      const newFavorites = [...preferences.favorite_cities, city];
      await updatePreferences({ favorite_cities: newFavorites });
      toast.success(`${city} added to favorites`);
    }
  };

  const removeFromFavorites = async (city: string) => {
    const newFavorites = preferences.favorite_cities.filter(c => c !== city);
    await updatePreferences({ favorite_cities: newFavorites });
    toast.success(`${city} removed from favorites`);
  };

  const value = {
    preferences,
    updatePreferences,
    addToFavorites,
    removeFromFavorites,
    loading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};