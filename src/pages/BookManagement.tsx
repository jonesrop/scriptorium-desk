import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  genre: string;
  isbn: string;
  quantity: number;
  available: number;
  description: string;
  publishedYear: number;
}

const BookManagement = () => {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([
    {
      id: 'BK001',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      publisher: 'Scribner',
      genre: 'Fiction',
      isbn: '978-0-7432-7356-5',
      quantity: 5,
      available: 3,
      description: 'A classic American novel set in the Jazz Age.',
      publishedYear: 1925
    },
    {
      id: 'BK002',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      publisher: 'J.B. Lippincott & Co.',
      genre: 'Fiction',
      isbn: '978-0-06-112008-4',
      quantity: 4,
      available: 4,
      description: 'A novel about racial injustice and childhood innocence.',
      publishedYear: 1960
    }
  ]);
  
  const [newBook, setNewBook] = useState<Omit<Book, 'id' | 'available'>>({
    title: '',
    author: '',
    publisher: '',
    genre: '',
    isbn: '',
    quantity: 1,
    description: '',
    publishedYear: new Date().getFullYear()
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  const genres = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Technology', 'Art', 'Philosophy'];

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookId = `BK${String(books.length + 1).padStart(3, '0')}`;
    const book: Book = {
      ...newBook,
      id: bookId,
      available: newBook.quantity
    };
    
    setBooks([...books, book]);
    setNewBook({
      title: '',
      author: '',
      publisher: '',
      genre: '',
      isbn: '',
      quantity: 1,
      description: '',
      publishedYear: new Date().getFullYear()
    });
    
    toast({
      title: "Book Added Successfully",
      description: `"${book.title}" has been added to the library catalog.`,
    });
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks(books.filter(book => book.id !== bookId));
    toast({
      title: "Book Deleted",
      description: "The book has been removed from the catalog.",
      variant: "destructive"
    });
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    <Label htmlFor="title">Book Title *</Label>
                    <Input
                      id="title"
                      value={newBook.title}
                      onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                      placeholder="Enter book title"
                      required
                    />
                  </div>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input
                      id="publisher"
                      value={newBook.publisher}
                      onChange={(e) => setNewBook({...newBook, publisher: e.target.value})}
                      placeholder="Enter publisher name"
                    />
                  </div>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={newBook.quantity}
                      onChange={(e) => setNewBook({...newBook, quantity: parseInt(e.target.value) || 1})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Published Year</Label>
                    <Input
                      id="year"
                      type="number"
                      min="1000"
                      max={new Date().getFullYear()}
                      value={newBook.publishedYear}
                      onChange={(e) => setNewBook({...newBook, publishedYear: parseInt(e.target.value) || new Date().getFullYear()})}
                    />
                  </div>
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
                      <TableHead>Book ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Genre</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-mono">{book.id}</TableCell>
                        <TableCell className="font-medium">{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{book.genre}</Badge>
                        </TableCell>
                        <TableCell>{book.quantity}</TableCell>
                        <TableCell>{book.available}</TableCell>
                        <TableCell>
                          <Badge variant={book.available > 0 ? "default" : "destructive"}>
                            {book.available > 0 ? "Available" : "Out of Stock"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
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