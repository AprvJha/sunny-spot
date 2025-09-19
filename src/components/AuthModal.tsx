import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from '@/hooks/useTranslations';
import { toast } from 'sonner';

interface AuthModalProps {
  trigger?: React.ReactNode;
}

export const AuthModal = ({ trigger }: AuthModalProps) => {
  const { user, signIn, signUp, signOut } = useAuth();
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Signed in successfully');
        setOpen(false);
        setEmail('');
        setPassword('');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await signUp(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Account created successfully! Please check your email for verification.');
        setOpen(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signed out successfully');
      setOpen(false);
    }
  };

  if (user) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline" size="sm" className="bg-card/60 backdrop-blur-sm border border-white/10 hover:bg-card/80">
              <User className="h-4 w-4 mr-2" />
              {user.email}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-md border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-foreground">Account</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Signed in as: {user.email}
            </div>
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              {t.auth.signOut}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="bg-card/60 backdrop-blur-sm border border-white/10 hover:bg-card/80">
            <LogIn className="h-4 w-4 mr-2" />
            {t.auth.signIn}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-md border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t.auth.signIn}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="signin" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              {t.auth.signIn}
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              {t.auth.signUp}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">{t.auth.email}</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-card/60 border-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signin-password">{t.auth.password}</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-card/60 border-white/10"
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t.common.loading : t.auth.signIn}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">{t.auth.email}</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-card/60 border-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">{t.auth.password}</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-card/60 border-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">{t.auth.confirmPassword}</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-card/60 border-white/10"
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t.common.loading : t.auth.signUp}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};