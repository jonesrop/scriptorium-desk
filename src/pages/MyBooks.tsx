import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Calendar, Clock, AlertTriangle, Search, Heart } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

interface BorrowedBook {
  id: string;
  bookId: string;
  title: string;
  author: string;
  issueDate: string;
  dueDate: string;
  status: 'active' | 'overdue';
  renewals: number;
  maxRenewals: number;
}

interface BookHistory {
  id: string;
  title: string;
  author: string;
  issueDate: string;
  returnDate: string;
  fine: number;
}

interface ReservedBook {
  id: string;
  bookId: string;
  title: string;
  author: string;
  reserveDate: string;
  position: number;
  estimatedAvailable: string;
}

const MyBooks = () => {
  const { profile } = useSupabaseAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const [currentBooks] = useState<BorrowedBook[]>([
    {
      id: 'TXN001',
      bookId: 'BK001',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      issueDate: '2024-01-15',
      dueDate: '2024-01-29',
      status: 'active',
      renewals: 0,
      maxRenewals: 2
    },
    {
      id: 'TXN003',
      bookId: 'BK003',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      issueDate: '2024-01-10',
      dueDate: '2024-01-20',
      status: 'overdue',
      renewals: 1,
      maxRenewals: 2
    }
  ]);

  const [bookHistory] = useState<BookHistory[]>([
    {
      id: 'TXN002',
      title: '1984',
      author: 'George Orwell',
      issueDate: '2023-12-01',
      returnDate: '2023-12-14',
      fine: 0
    },
    {
      id: 'TXN004',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      issueDate: '2023-11-15',
      returnDate: '2023-12-05',
      fine: 5
    }
  ]);

  const [reservedBooks] = useState<ReservedBook[]>([
    {
      id: 'RES001',
      bookId: 'BK005',
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      reserveDate: '2024-01-20',
      position: 2,
      estimatedAvailable: '2024-02-05'
    }
  ]);

  const calculateDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateOverdueDays = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const totalFines = bookHistory.reduce((sum, book) => sum + book.fine, 0);
  const overdueBooks = currentBooks.filter(book => book.status === 'overdue');

  const filteredHistory = bookHistory.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">My Books</h1>
        <p className="text-muted-foreground">Manage your borrowed books, history, and reservations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <div>
                <p className="text-2xl font-bold">{currentBooks.length}</p>
                <p className="text-xs text-muted-foreground">Current Books</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <div>
                <p className="text-2xl font-bold text-destructive">{overdueBooks.length}</p>
                <p className="text-xs text-muted-foreground">Overdue Books</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-warning" />
              <div>
                <p className="text-2xl font-bold">{reservedBooks.length}</p>
                <p className="text-xs text-muted-foreground">Reserved Books</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-success" />
              <div>
                <p className="text-2xl font-bold">${totalFines}</p>
                <p className="text-xs text-muted-foreground">Total Fines</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Alert */}
      {overdueBooks.length > 0 && (
        <Card className="border-destructive bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Overdue Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground mb-4">
              You have {overdueBooks.length} overdue book(s). Please return them as soon as possible to avoid additional fines.
            </p>
            <div className="space-y-2">
              {overdueBooks.map((book) => (
                <div key={book.id} className="flex justify-between items-center p-2 bg-background rounded">
                  <span className="font-medium">{book.title}</span>
                  <Badge variant="destructive">
                    {calculateOverdueDays(book.dueDate)} days overdue
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Currently Borrowed</TabsTrigger>
          <TabsTrigger value="history">Reading History</TabsTrigger>
          <TabsTrigger value="reserved">Reserved Books</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Currently Borrowed Books
              </CardTitle>
              <CardDescription>
                Books you currently have checked out from the library.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentBooks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  You don't have any books currently borrowed.
                </div>
              ) : (
                <div className="space-y-4">
                  {currentBooks.map((book) => {
                    const daysUntilDue = calculateDaysUntilDue(book.dueDate);
                    return (
                      <div key={book.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{book.title}</h3>
                            <p className="text-muted-foreground">by {book.author}</p>
                          </div>
                          <Badge variant={book.status === 'overdue' ? 'destructive' : 'default'}>
                            {book.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Issue Date</p>
                            <p className="font-medium">{new Date(book.issueDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Due Date</p>
                            <p className="font-medium">{new Date(book.dueDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Days Until Due</p>
                            <p className={`font-medium ${daysUntilDue < 0 ? 'text-destructive' : daysUntilDue <= 3 ? 'text-warning' : 'text-success'}`}>
                              {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days`}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Renewals</p>
                            <p className="font-medium">{book.renewals}/{book.maxRenewals}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={book.renewals >= book.maxRenewals || book.status === 'overdue'}
                          >
                            Renew Book
                          </Button>
                          <Button variant="outline" size="sm">
                            Request Return
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Reading History
              </CardTitle>
              <CardDescription>
                Books you have previously borrowed and returned.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your reading history..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Return Date</TableHead>
                      <TableHead>Fine</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium">{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{new Date(book.issueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(book.returnDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {book.fine > 0 ? (
                            <Badge variant="destructive">${book.fine}</Badge>
                          ) : (
                            <Badge variant="default">No Fine</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredHistory.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No books found in your reading history.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reserved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Reserved Books
              </CardTitle>
              <CardDescription>
                Books you have reserved and are waiting for availability.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reservedBooks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  You don't have any books reserved.
                </div>
              ) : (
                <div className="space-y-4">
                  {reservedBooks.map((book) => (
                    <div key={book.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{book.title}</h3>
                          <p className="text-muted-foreground">by {book.author}</p>
                        </div>
                        <Badge variant="secondary">Reserved</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Reserve Date</p>
                          <p className="font-medium">{new Date(book.reserveDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Queue Position</p>
                          <p className="font-medium">#{book.position}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Estimated Available</p>
                          <p className="font-medium">{new Date(book.estimatedAvailable).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        Cancel Reservation
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyBooks;