import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  BookOpen, 
  User, 
  Heart,
  Plus,
  Loader2,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

interface Book {
  id: string;
  call_number: string;
  title: string;
  author: string;
  publisher: string;
  genre: string;
  isbn?: string;
  total_copies: number;
  available_copies: number;
  description?: string;
  publication_year?: number;
  borrow_count: number;
}

const BookCatalog = () => {
  const { toast } = useToast();
  const { user } = useSupabaseAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    fetchBooks();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('title');

      if (error) throw error;
      setBooks((data || []) as Book[]);
    } catch (error: any) {
      toast({
        title: "Error Loading Books",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('book_favorites')
        .select('book_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data.map(fav => fav.book_id));
    } catch (error: any) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (bookId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add favorites.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (favorites.includes(bookId)) {
        const { error } = await supabase
          .from('book_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('book_id', bookId);

        if (error) throw error;
        setFavorites(favorites.filter(id => id !== bookId));
      } else {
        const { error } = await supabase
          .from('book_favorites')
          .insert([{ user_id: user.id, book_id: bookId }]);

        if (error) throw error;
        setFavorites([...favorites, bookId]);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const genres = ['All', ...Array.from(new Set(books.map(book => book.genre)))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const getAvailabilityBadge = (available: number, total: number) => {
    if (available === 0) {
      return <Badge variant="destructive">Not Available</Badge>;
    } else if (available <= 2) {
      return <Badge variant="secondary" className="bg-warning/20 text-warning-foreground">Limited</Badge>;
    }
    return <Badge variant="secondary" className="bg-success/20 text-success-foreground">Available</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Book Catalog</h1>
          <p className="text-muted-foreground">Browse and discover books in our library collection</p>
        </div>
      </div>

      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search books by title, author, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-4 py-2 border border-input bg-background rounded-md text-sm"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredBooks.length} of {books.length} books
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="shadow-soft hover:shadow-medium transition-all duration-200 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight mb-2">{book.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {book.author}
                  </CardDescription>
                  <p className="text-xs text-muted-foreground mt-1">
                    {book.publisher} • {book.publication_year}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(book.id)}
                  className="ml-2 p-2"
                >
                  <Heart 
                    className={`h-4 w-4 ${
                      favorites.includes(book.id) 
                        ? 'fill-secondary text-secondary' 
                        : 'text-muted-foreground hover:text-secondary'
                    }`}
                  />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-xs">
                  {book.genre}
                </Badge>
                <span className="text-xs text-muted-foreground">#{book.call_number}</span>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {book.description || 'No description available'}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Availability:</span>
                  {getAvailabilityBadge(book.available_copies, book.total_copies)}
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Copies:</span>
                  <span>{book.available_copies} of {book.total_copies} available</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Borrowed:</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-secondary" />
                    <span>{book.borrow_count} times</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1" 
                  disabled={book.available_copies === 0}
                  size="sm"
                >
                  {book.available_copies > 0 ? (
                    <>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Borrow
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Reserve
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No books found matching your search criteria.
        </div>
      )}
    </div>
  );
};

export default BookCatalog;
