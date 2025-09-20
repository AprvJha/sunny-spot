import { MapPin } from 'lucide-react';
import { Button } from './ui/button';

interface PopularCitiesProps {
  onCitySelect: (city: string) => void;
}

const popularCities = [
  { name: 'New York', country: 'US', icon: '🗽' },
  { name: 'London', country: 'UK', icon: '🇬🇧' },
  { name: 'Tokyo', country: 'JP', icon: '🗾' },
  { name: 'Paris', country: 'FR', icon: '🗼' },
  { name: 'Sydney', country: 'AU', icon: '🏛️' },
  { name: 'Dubai', country: 'AE', icon: '🏙️' },
  { name: 'Singapore', country: 'SG', icon: '🌆' },
  { name: 'Hong Kong', country: 'HK', icon: '🌃' },
  { name: 'Los Angeles', country: 'US', icon: '🌴' },
  { name: 'Barcelona', country: 'ES', icon: '🏖️' },
  { name: 'Amsterdam', country: 'NL', icon: '🌷' },
  { name: 'Berlin', country: 'DE', icon: '🏛️' }
];

export const PopularCities = ({ onCitySelect }: PopularCitiesProps) => {
  return (
    <div className="modern-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div className="absolute -inset-1 bg-gradient-primary rounded-full opacity-20 blur-sm"></div>
        </div>
        <h3 className="text-lg font-semibold text-foreground">Popular Cities</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {popularCities.map((city) => (
          <Button
            key={`${city.name}-${city.country}`}
            variant="ghost"
            size="sm"
            className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-primary/10 hover:scale-105 transition-all duration-200 group"
            onClick={() => onCitySelect(city.name)}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
              {city.icon}
            </span>
            <div className="text-center">
              <div className="text-sm font-medium text-foreground leading-tight">
                {city.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {city.country}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};