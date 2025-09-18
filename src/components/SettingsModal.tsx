import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, X } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslations } from '@/hooks/useTranslations';
import { Language } from '@/types/translations';
import { toast } from 'sonner';

interface SettingsModalProps {
  trigger?: React.ReactNode;
}

export const SettingsModal = ({ trigger }: SettingsModalProps) => {
  const { preferences, updatePreferences, removeFromFavorites } = useSettings();
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [defaultCity, setDefaultCity] = useState(preferences.default_city || '');

  const handleSave = async () => {
    await updatePreferences({
      default_city: defaultCity || undefined,
    });
    toast.success(t.common.success);
    setOpen(false);
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          await updatePreferences({ notifications_enabled: true });
          toast.success('Notifications enabled');
        } else {
          toast.error('Notification permission denied');
        }
      } catch (error) {
        toast.error('Failed to enable notifications');
      }
    } else {
      await updatePreferences({ notifications_enabled: false });
      toast.success('Notifications disabled');
    }
  };

  const languageNames: Record<Language, string> = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    it: 'Italiano',
    pt: 'Português',
    ru: 'Русский',
    zh: '中文',
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="bg-card/60 backdrop-blur-sm border border-white/10 hover:bg-card/80">
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-md border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t.settings.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Language Selection */}
          <div className="space-y-2">
            <Label htmlFor="language" className="text-sm font-medium text-foreground">
              {t.settings.language}
            </Label>
            <Select
              value={preferences.language}
              onValueChange={(value: Language) => updatePreferences({ language: value })}
            >
              <SelectTrigger className="bg-card/60 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-md border border-white/10">
                {Object.entries(languageNames).map(([code, name]) => (
                  <SelectItem key={code} value={code}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Temperature Unit */}
          <div className="space-y-2">
            <Label htmlFor="temperature-unit" className="text-sm font-medium text-foreground">
              {t.settings.temperatureUnit}
            </Label>
            <Select
              value={preferences.temperature_unit}
              onValueChange={(value: 'celsius' | 'fahrenheit') => updatePreferences({ temperature_unit: value })}
            >
              <SelectTrigger className="bg-card/60 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-md border border-white/10">
                <SelectItem value="celsius">{t.settings.celsius}</SelectItem>
                <SelectItem value="fahrenheit">{t.settings.fahrenheit}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <Label htmlFor="theme" className="text-sm font-medium text-foreground">
              {t.settings.theme}
            </Label>
            <Select
              value={preferences.theme_preference}
              onValueChange={(value: 'light' | 'dark' | 'system') => updatePreferences({ theme_preference: value })}
            >
              <SelectTrigger className="bg-card/60 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-md border border-white/10">
                <SelectItem value="light">{t.settings.light}</SelectItem>
                <SelectItem value="dark">{t.settings.dark}</SelectItem>
                <SelectItem value="system">{t.settings.system}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Default City */}
          <div className="space-y-2">
            <Label htmlFor="default-city" className="text-sm font-medium text-foreground">
              {t.settings.defaultCity}
            </Label>
            <Input
              id="default-city"
              value={defaultCity}
              onChange={(e) => setDefaultCity(e.target.value)}
              placeholder="Enter city name"
              className="bg-card/60 border-white/10 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="text-sm font-medium text-foreground">
              {t.settings.notifications}
            </Label>
            <Switch
              id="notifications"
              checked={preferences.notifications_enabled}
              onCheckedChange={handleNotificationToggle}
            />
          </div>

          {/* Favorite Cities */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {t.settings.favoriteCities}
            </Label>
            <div className="flex flex-wrap gap-2">
              {preferences.favorite_cities.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t.cities.noFavorites}</p>
              ) : (
                preferences.favorite_cities.map((city) => (
                  <Badge key={city} variant="secondary" className="flex items-center gap-1">
                    {city}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => removeFromFavorites(city)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button onClick={handleSave}>
              {t.common.save}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};