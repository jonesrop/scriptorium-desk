import { Button } from '@/components/ui/button';
import { Home, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-white" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-display font-semibold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist in our library catalog.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/app/catalog">
              <BookOpen className="mr-2 h-4 w-4" />
              Browse Books
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;