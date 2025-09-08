import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  BookOpen, 
  User, 
  Calendar,
  Star,
  Heart,
  Plus
} from 'lucide-react';
import { Book } from '@/types';

// Mock book data
const mockBooks: Book[] = [
  {
    id: '1',
    callNumber: 'CS001.123',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    publisher: 'MIT Press',
    genre: 'Computer Science',
    totalCopies: 5,
    availableCopies: 3,
    isbn: '978-0262033848',
    publicationYear: 2009,
    description: 'A comprehensive textbook covering algorithms and data structures.',
    createdAt: new Date('2024-01-01'),
    borrowCount: 45,
  },
  {
    id: '2',
    callNumber: 'MATH001.456',
    title: 'Calculus: Early Transcendentals',
    author: 'James Stewart',
    publisher: 'Cengage Learning',
    genre: 'Mathematics',
    totalCopies: 8,
    availableCopies: 2,
    isbn: '978-1285741550',
    publicationYear: 2015,
    description: 'Complete calculus textbook for undergraduate students.',
    createdAt: new Date('2024-01-15'),
    borrowCount: 67,
  },
  {
    id: '3',
    callNumber: 'PHYS001.789',
    title: 'Fundamentals of Physics',
    author: 'David Halliday',
    publisher: 'Wiley',
    genre: 'Physics',
    totalCopies: 6,
    availableCopies: 0,
    isbn: '978-1118230718',
    publicationYear: 2013,
    description: 'Comprehensive introduction to physics principles.',
    createdAt: new Date('2024-02-01'),
    borrowCount: 38,
  },
  {
    id: '4',
    callNumber: 'CHEM001.012',
    title: 'Organic Chemistry',
    author: 'Paula Yurkanis Bruice',
    publisher: 'Pearson',
    genre: 'Chemistry',
    totalCopies: 4,
    availableCopies: 1,
    isbn: '978-0134042282',
    publicationYear: 2016,
    description: 'Modern approach to organic chemistry with biological applications.',
    createdAt: new Date('2024-01-20'),
    borrowCount: 29,
  },
];

const BookCatalog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);

  const genres = ['All', ...Array.from(new Set(mockBooks.map(book => book.genre)))];

  const filteredBooks = mockBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const toggleFavorite = (bookId: string) => {
    setFavorites(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const getAvailabilityBadge = (available: number, total: number) => {
    if (available === 0) {
      return <Badge variant="destructive">Not Available</Badge>;
    } else if (available <= 2) {
      return <Badge variant="secondary" className="bg-warning/20 text-warning-foreground">Limited</Badge>;
    }
    return <Badge variant="secondary" className="bg-success/20 text-success-foreground">Available</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Book Catalog</h1>
          <p className="text-muted-foreground">Browse and discover books in our library collection</p>
        </div>
      </div>

      {/* Search and Filters */}
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
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredBooks.length} of {mockBooks.length} books
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Sort by Title</Button>
          <Button variant="outline" size="sm">Sort by Author</Button>
          <Button variant="outline" size="sm">Sort by Popularity</Button>
        </div>
      </div>

      {/* Books Grid */}
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
                    {book.publisher} • {book.publicationYear}
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
                <span className="text-xs text-muted-foreground">#{book.callNumber}</span>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {book.description}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Availability:</span>
                  {getAvailabilityBadge(book.availableCopies, book.totalCopies)}
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Copies:</span>
                  <span>{book.availableCopies} of {book.totalCopies} available</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Borrowed:</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-secondary" />
                    <span>{book.borrowCount} times</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1" 
                  disabled={book.availableCopies === 0}
                  size="sm"
                >
                  {book.availableCopies > 0 ? (
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

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" className="px-8">
          Load More Books
        </Button>
      </div>
    </div>
  );
};

export default BookCatalog;