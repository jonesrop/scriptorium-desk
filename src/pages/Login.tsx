import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Library, Users, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginCredentials } from '@/types';

const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await login(credentials);
    setIsSubmitting(false);
  };

  const handleInputChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const fillDemoCredentials = (role: 'admin' | 'student') => {
    if (role === 'admin') {
      setCredentials({ username: 'admin', password: 'admin123' });
    } else {
      setCredentials({ username: 'student1', password: 'password' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Hero content */}
        <div className="text-center lg:text-left text-white space-y-6">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
            <Library className="h-12 w-12" />
            <h1 className="font-display text-4xl font-bold">LibraryPro</h1>
          </div>
          
          <h2 className="font-display text-5xl lg:text-6xl font-bold leading-tight">
            Modern Library
            <br />
            Management
          </h2>
          
          <p className="text-xl text-white/90 max-w-md mx-auto lg:mx-0">
            Streamline your library operations with our comprehensive management system
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2" />
              <h3 className="font-semibold">Book Management</h3>
              <p className="text-sm text-white/80">Organize & track inventory</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <h3 className="font-semibold">User Management</h3>
              <p className="text-sm text-white/80">Handle student accounts</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Shield className="h-8 w-8 mx-auto mb-2" />
              <h3 className="font-semibold">Secure Access</h3>
              <p className="text-sm text-white/80">Role-based permissions</p>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md shadow-strong">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Sign in to access your library dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={credentials.username}
                    onChange={handleInputChange('username')}
                    required
                    disabled={isSubmitting || isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={handleInputChange('password')}
                    required
                    disabled={isSubmitting || isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Demo Accounts</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('admin')}
                  disabled={isSubmitting || isLoading}
                >
                  Admin Demo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('student')}
                  disabled={isSubmitting || isLoading}
                >
                  Student Demo
                </Button>
              </div>
              
              <div className="text-xs text-center text-muted-foreground">
                <p>Admin: admin / admin123</p>
                <p>Student: student1 / password</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;