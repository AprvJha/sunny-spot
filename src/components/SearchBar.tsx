import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, X, RefreshCw } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationSearch: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  currentCity: string;
}

const popularCities = [
  'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 
  'Dubai', 'Singapore', 'Los Angeles', 'Mumbai', 'Berlin'
];

export const SearchBar = ({ 
  onSearch, 
  onLocationSearch, 
  onRefresh, 
  isLoading, 
  currentCity 
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const handleClearInput = () => {
    setSearchQuery('');
  };

  const handlePopularCitySelect = (city: string) => {
    onSearch(city);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Main Search Bar */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 h-12 text-lg bg-card/80 backdrop-blur-sm border-white/20"
            disabled={isLoading}
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearInput}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Button 
          type="submit" 
          size="lg" 
          disabled={isLoading || !searchQuery.trim()}
          className="h-12 px-6"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-center">
        <Button
          variant="secondary"
          onClick={onLocationSearch}
          disabled={isLoading}
          className="flex items-center gap-2 bg-card/60 backdrop-blur-sm border border-white/10 hover:bg-card/80"
        >
          <MapPin className="h-4 w-4" />
          Use My Location
        </Button>
        
        {currentCity && (
          <Button
            variant="secondary"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 bg-card/60 backdrop-blur-sm border border-white/10 hover:bg-card/80"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>

      {/* Popular Cities */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <span className="text-sm text-foreground/70 font-medium whitespace-nowrap">
          Quick search:
        </span>
        <div className="flex flex-wrap gap-1 justify-center">
          {popularCities.map((city) => (
            <Button
              key={city}
              variant="outline"
              size="sm"
              onClick={() => handlePopularCitySelect(city)}
              disabled={isLoading}
              className="text-xs bg-card/40 backdrop-blur-sm border-white/10 hover:bg-card/60"
            >
              {city}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};