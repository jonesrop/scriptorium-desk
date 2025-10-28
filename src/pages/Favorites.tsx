import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, BookOpen, Trash2, Star, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface FavoriteBook {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
    publisher: string;
    genre: string;
    available_copies: number;
    total_copies: number;
    borrow_count: number;
    description: string | null;
  };
  created_at: string;
}

const Favorites = () => {
  const { profile } = useSupabaseAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.user_id) {
      fetchFavorites();
    }
  }, [profile]);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('book_favorites')
        .select(`
          id,
          created_at,
          book:books(
            id,
            title,
            author,
            publisher,
            genre,
            available_copies,
            total_copies,
            borrow_count,
            description
          )
        `)
        .eq('user_id', profile?.user_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data as any);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load favorites',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('book_favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      setFavorites(favorites.filter(f => f.id !== favoriteId));
      toast({
        title: 'Removed from favorites',
        description: 'Book has been removed from your favorites',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to remove favorite',
        variant: 'destructive',
      });
    }
  };

  const getAvailabilityBadge = (available: number) => {
    if (available === 0) {
      return <Badge variant="destructive">Not Available</Badge>;
    } else if (available <= 2) {
      return <Badge variant="secondary" className="bg-warning/20 text-warning-foreground">Limited</Badge>;
    }
    return <Badge variant="secondary" className="bg-success/20 text-success-foreground">Available</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">My Favorites</h1>
        <p className="text-muted-foreground">Books you've saved for later</p>
      </div>

      {favorites.length === 0 ? (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start adding books to your favorites to build your reading list
            </p>
            <Button onClick={() => window.location.href = '/app/catalog'}>
              Browse Books
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <Card key={favorite.id} className="shadow-soft hover:shadow-medium transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight mb-2">
                      {favorite.book.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {favorite.book.author}
                    </CardDescription>
                    <p className="text-xs text-muted-foreground mt-1">
                      {favorite.book.publisher}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFavorite(favorite.id)}
                    className="ml-2 p-2"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-xs">
                    {favorite.book.genre}
                  </Badge>
                </div>

                {favorite.book.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {favorite.book.description}
                  </p>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Availability:</span>
                    {getAvailabilityBadge(favorite.book.available_copies)}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Copies:</span>
                    <span>{favorite.book.available_copies} of {favorite.book.total_copies} available</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Popularity:</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-secondary" />
                      <span>{favorite.book.borrow_count} borrows</span>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  disabled={favorite.book.available_copies === 0}
                  size="sm"
                >
                  {favorite.book.available_copies > 0 ? (
                    <>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Request to Borrow
                    </>
                  ) : (
                    'Currently Unavailable'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;