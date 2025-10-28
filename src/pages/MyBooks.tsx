import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Calendar, Clock, AlertTriangle, Search, Heart, RefreshCw, Loader2 } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BorrowedBook {
  id: string;
  book_id: string;
  book_title: string;
  book_author: string;
  issue_date: string;
  due_date: string;
  status: 'issued' | 'returned' | 'overdue';
  renewal_count: number;
  max_renewals: number;
  fine_amount: number;
}

interface BookHistory {
  id: string;
  title: string;
  author: string;
  issueDate: string;
  returnDate: string;
  fine: number;
}

const MyBooks = () => {
  const { profile } = useSupabaseAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentBooks, setCurrentBooks] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [renewingId, setRenewingId] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.user_id) {
      fetchBorrowedBooks();
    }
  }, [profile]);

  const fetchBorrowedBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('issued_books')
        .select(`
          id,
          book_id,
          issue_date,
          due_date,
          status,
          renewal_count,
          max_renewals,
          fine_amount,
          book:books(title, author)
        `)
        .eq('user_id', profile?.user_id)
        .in('status', ['issued', 'overdue'])
        .order('due_date', { ascending: true });

      if (error) throw error;

      const formattedBooks = data?.map((item: any) => ({
        id: item.id,
        book_id: item.book_id,
        book_title: item.book.title,
        book_author: item.book.author,
        issue_date: item.issue_date,
        due_date: item.due_date,
        status: item.status,
        renewal_count: item.renewal_count,
        max_renewals: item.max_renewals,
        fine_amount: item.fine_amount,
      })) || [];

      setCurrentBooks(formattedBooks);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load borrowed books',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRenewBook = async (bookId: string) => {
    setRenewingId(bookId);
    try {
      const { data, error } = await supabase.rpc('renew_book', {
        issued_book_id: bookId,
        renewal_days: 14,
      });

      if (error) throw error;

      const result = data as any;
      if (result?.success) {
        toast({
          title: 'Book renewed!',
          description: result.message,
        });
        fetchBorrowedBooks();
      } else {
        toast({
          title: 'Cannot renew',
          description: result?.message || 'Failed to renew book',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to renew book',
        variant: 'destructive',
      });
    } finally {
      setRenewingId(null);
    }
  };

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

  const overdueBooks = currentBooks.filter(book => book.status === 'overdue');

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
        <h1 className="text-3xl font-display font-bold text-foreground">My Books</h1>
        <p className="text-muted-foreground">Manage your currently borrowed books</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <div>
                <p className="text-2xl font-bold">{currentBooks.length}</p>
                <p className="text-xs text-muted-foreground">Currently Borrowed</p>
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
      </div>

      {/* Overdue Alert */}
      {overdueBooks.length > 0 && (
        <Card className="border-destructive bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Overdue Books Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground mb-4">
              You have {overdueBooks.length} overdue book(s). Please return them as soon as possible to avoid additional fines.
            </p>
            <div className="space-y-2">
              {overdueBooks.map((book) => (
                <div key={book.id} className="flex justify-between items-center p-2 bg-background rounded">
                  <span className="font-medium">{book.book_title}</span>
                  <Badge variant="destructive">
                    {calculateOverdueDays(book.due_date)} days overdue
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Currently Borrowed Books */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Currently Borrowed Books
          </CardTitle>
          <CardDescription>
            Books you currently have checked out. You can renew each book up to 2 times.
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
                const daysUntilDue = calculateDaysUntilDue(book.due_date);
                const canRenew = book.renewal_count < book.max_renewals && book.status !== 'overdue';
                
                return (
                  <div key={book.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{book.book_title}</h3>
                        <p className="text-muted-foreground">by {book.book_author}</p>
                      </div>
                      <Badge variant={book.status === 'overdue' ? 'destructive' : 'default'}>
                        {book.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Issue Date</p>
                        <p className="font-medium">{new Date(book.issue_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Due Date</p>
                        <p className="font-medium">{new Date(book.due_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Days Until Due</p>
                        <p className={`font-medium ${daysUntilDue < 0 ? 'text-destructive' : daysUntilDue <= 3 ? 'text-warning' : 'text-success'}`}>
                          {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} overdue` : `${daysUntilDue} days`}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Renewals Used</p>
                        <p className="font-medium">{book.renewal_count}/{book.max_renewals}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={!canRenew || renewingId === book.id}
                        onClick={() => handleRenewBook(book.id)}
                      >
                        {renewingId === book.id ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin mr-2" />
                            Renewing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-3 w-3 mr-2" />
                            Renew ({book.max_renewals - book.renewal_count} left)
                          </>
                        )}
                      </Button>
                    </div>

                    {book.fine_amount > 0 && (
                      <div className="bg-warning/10 border border-warning rounded p-2 text-sm">
                        <p className="text-warning-foreground">
                          <strong>Fine:</strong> ${book.fine_amount.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyBooks;