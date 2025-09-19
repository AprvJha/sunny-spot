import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Key, Shield, CloudIcon } from 'lucide-react';

interface SetupInstructionsProps {
  onSetApiKey: () => void;
}

export const SetupInstructions = ({ onSetApiKey }: SetupInstructionsProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full bg-card/95 backdrop-blur-md border border-white/10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
            <CloudIcon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to CloudCast</CardTitle>
          <p className="text-muted-foreground">
            Your personal weather companion with advanced forecasting and beautiful visualizations
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              To get started, you'll need a free OpenWeatherMap API key. This ensures accurate and up-to-date weather data.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Get Your Free API Key
            </h3>
            <div className="pl-8 space-y-2">
              <p className="text-sm text-muted-foreground">
                Visit OpenWeatherMap and create a free account to get your API key.
              </p>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <a
                  href="https://openweathermap.org/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Get API Key <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              Configure CloudCast
            </h3>
            <div className="pl-8 space-y-2">
              <p className="text-sm text-muted-foreground">
                Enter your API key to start using CloudCast with real weather data.
              </p>
              <Button onClick={onSetApiKey} className="w-full sm:w-auto">
                <Key className="h-4 w-4 mr-2" />
                Set API Key
              </Button>
            </div>
          </div>
          
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Privacy:</strong> Your API key is stored locally in your browser and never transmitted to our servers. 
              It's only used to make requests directly to OpenWeatherMap.
            </AlertDescription>
          </Alert>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">✨ What you'll get:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Real-time weather conditions</li>
              <li>• 5-day detailed forecasts</li>
              <li>• Beautiful weather visualizations</li>
              <li>• Offline caching</li>
              <li>• Multi-language support</li>
              <li>• Voice search</li>
              <li>• PWA support for mobile</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};