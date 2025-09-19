import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, User, Key } from 'lucide-react';
import { useState } from 'react';

export const DemoCredentialsBanner = () => {
  const [isVisible, setIsVisible] = useState(
    !localStorage.getItem('demo-banner-dismissed')
  );

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('demo-banner-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 flex justify-center">
      <Alert className="max-w-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 backdrop-blur-sm">
        <User className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
            <span className="font-medium">🌤️ CloudCast Demo</span>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Key className="h-3 w-3" />
                <strong>Email:</strong> test@cloudcast.demo
              </span>
              <span>
                <strong>Password:</strong> demo123
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="ml-2 h-6 w-6 p-0 hover:bg-white/10"
          >
            <X className="h-3 w-3" />
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};