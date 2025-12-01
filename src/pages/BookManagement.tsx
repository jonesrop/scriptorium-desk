import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
}

const BookManagement = () => {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBook, setNewBook] = useState({
    call_number: '',
    title: '',
    author: '',
    publisher: '',
    genre: '',
    isbn: '',
    total_copies: 1,
    description: '',
    publication_year: new Date().getFullYear()
  });
  const [searchTerm, setSearchTerm] = useState('');

  const genres = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Technology', 'Art', 'Philosophy'];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
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

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('books')
        .insert([{
          ...newBook,
          available_copies: newBook.total_copies
        }])
        .select()
        .single();

      if (error) throw error;

      setBooks([data, ...books]);
      setNewBook({
        call_number: '',
        title: '',
        author: '',
        publisher: '',
        genre: '',
        isbn: '',
        total_copies: 1,
        description: '',
        publication_year: new Date().getFullYear()
      });

      toast({
        title: "Book Added Successfully",
        description: `"${data.title}" has been added to the library catalog.`,
      });
    } catch (error: any) {
      toast({
        title: "Error Adding Book",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) throw error;

      setBooks(books.filter(book => book.id !== bookId));
      toast({
        title: "Book Deleted",
        description: "The book has been removed from the catalog.",
        variant: "destructive"
      });
    } catch (error: any) {
      toast({
        title: "Error Deleting Book",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Book Management</h1>
        <p className="text-muted-foreground">Manage your library's book collection</p>
      </div>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add">Add New Book</TabsTrigger>
          <TabsTrigger value="manage">Manage Books</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Book
              </CardTitle>
              <CardDescription>
                Enter the details of the new book to add it to the library catalog.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddBook} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="call_number">Call Number *</Label>
                    <Input
                      id="call_number"
                      value={newBook.call_number}
                      onChange={(e) => setNewBook({...newBook, call_number: e.target.value})}
                      placeholder="e.g., CS001.123"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Book Title *</Label>
                    <Input
                      id="title"
                      value={newBook.title}
                      onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                      placeholder="Enter book title"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">Author *</Label>
                    <Input
                      id="author"
                      value={newBook.author}
                      onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                      placeholder="Enter author name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="publisher">Publisher *</Label>
                    <Input
                      id="publisher"
                      value={newBook.publisher}
                      onChange={(e) => setNewBook({...newBook, publisher: e.target.value})}
                      placeholder="Enter publisher name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre *</Label>
                    <Select 
                      value={newBook.genre} 
                      onValueChange={(value) => setNewBook({...newBook, genre: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map((genre) => (
                          <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input
                      id="isbn"
                      value={newBook.isbn}
                      onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
                      placeholder="978-0-123456-78-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Published Year</Label>
                    <Input
                      id="year"
                      type="number"
                      min="1000"
                      max={new Date().getFullYear()}
                      value={newBook.publication_year}
                      onChange={(e) => setNewBook({...newBook, publication_year: parseInt(e.target.value) || new Date().getFullYear()})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total_copies">Number of Copies *</Label>
                  <Input
                    id="total_copies"
                    type="number"
                    min="1"
                    value={newBook.total_copies}
                    onChange={(e) => setNewBook({...newBook, total_copies: parseInt(e.target.value) || 1})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newBook.description}
                    onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                    placeholder="Enter book description..."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Book to Library
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Book Catalog
              </CardTitle>
              <CardDescription>
                View and manage all books in the library collection.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search books by title, author, or genre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Call Number</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Genre</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-mono">{book.call_number}</TableCell>
                        <TableCell className="font-medium">{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{book.genre}</Badge>
                        </TableCell>
                        <TableCell>{book.total_copies}</TableCell>
                        <TableCell>{book.available_copies}</TableCell>
                        <TableCell>
                          <Badge variant={book.available_copies > 0 ? "default" : "destructive"}>
                            {book.available_copies > 0 ? "Available" : "Out of Stock"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" disabled>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteBook(book.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredBooks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No books found matching your search criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookManagement;
