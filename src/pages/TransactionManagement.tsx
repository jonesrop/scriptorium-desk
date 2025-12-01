import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, BookOpen, UserCheck, Search, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Transaction {
  id: string;
  book_id: string;
  user_id: string;
  issue_date: string;
  due_date: string;
  return_date?: string;
  status: 'issued' | 'returned' | 'overdue';
  fine_amount: number;
  books?: { title: string };
  profiles?: { first_name: string; last_name: string };
}

interface Book {
  id: string;
  title: string;
  available_copies: number;
}

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
}

const TransactionManagement = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [issueForm, setIssueForm] = useState({
    bookId: '',
    userId: '',
    dueDate: ''
  });

  const [returnForm, setReturnForm] = useState({
    transactionId: '',
    returnDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsRes, booksRes, usersRes] = await Promise.all([
        supabase
          .from('issued_books')
          .select('*')
          .order('issue_date', { ascending: false }),
        supabase
          .from('books')
          .select('id, title, available_copies')
          .gt('available_copies', 0),
        supabase
          .from('profiles')
          .select('user_id, first_name, last_name')
      ]);

      if (transactionsRes.error) throw transactionsRes.error;
      if (booksRes.error) throw booksRes.error;
      if (usersRes.error) throw usersRes.error;

      // Fetch book and user details separately
      const transactionsWithDetails = await Promise.all(
        (transactionsRes.data || []).map(async (transaction) => {
          const book = await supabase
            .from('books')
            .select('title')
            .eq('id', transaction.book_id)
            .single();
          
          const user = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('user_id', transaction.user_id)
            .single();

          return {
            ...transaction,
            books: book.data,
            profiles: user.data
          };
        })
      );

      setTransactions(transactionsWithDetails as Transaction[]);
      setBooks(booksRes.data || []);
      setUsers(usersRes.data || []);
    } catch (error: any) {
      toast({
        title: "Error Loading Data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const book = books.find(b => b.id === issueForm.bookId);
    if (!book) {
      toast({
        title: "Error",
        description: "Please select a valid book.",
        variant: "destructive"
      });
      return;
    }

    if (book.available_copies <= 0) {
      toast({
        title: "Book Unavailable",
        description: "This book is currently out of stock.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('issued_books')
        .insert([{
          book_id: issueForm.bookId,
          user_id: issueForm.userId,
          due_date: issueForm.dueDate,
          status: 'issued'
        }])
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('books')
        .update({ available_copies: book.available_copies - 1 })
        .eq('id', issueForm.bookId);

      fetchData();
      
      setIssueForm({ bookId: '', userId: '', dueDate: '' });
      
      toast({
        title: "Book Issued Successfully",
        description: `"${book.title}" has been issued.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleReturnBook = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const transaction = transactions.find(t => t.id === returnForm.transactionId);
    if (!transaction) {
      toast({
        title: "Error",
        description: "Transaction not found.",
        variant: "destructive"
      });
      return;
    }

    const dueDate = new Date(transaction.due_date);
    const returnDate = new Date(returnForm.returnDate);
    const daysOverdue = Math.max(0, Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
    const fine = daysOverdue * 1;

    try {
      const { error } = await supabase
        .from('issued_books')
        .update({ 
          return_date: returnForm.returnDate, 
          status: 'returned',
          fine_amount: fine
        })
        .eq('id', returnForm.transactionId);

      if (error) throw error;

      const book = books.find(b => b.id === transaction.book_id);
      if (book) {
        await supabase
          .from('books')
          .update({ available_copies: book.available_copies + 1 })
          .eq('id', transaction.book_id);
      }

      setReturnForm({ transactionId: '', returnDate: new Date().toISOString().split('T')[0] });
      fetchData();
      
      toast({
        title: "Book Returned Successfully",
        description: fine > 0 
          ? `Book returned with a fine of $${fine}.`
          : "Book returned without any fine.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const bookTitle = transaction.books?.title || '';
    const userName = transaction.profiles 
      ? `${transaction.profiles.first_name} ${transaction.profiles.last_name}` 
      : '';
    
    return bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
           userName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const overdueTransactions = transactions.filter(t => t.status === 'overdue');

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
        <h1 className="text-3xl font-display font-bold text-foreground">Transaction Management</h1>
        <p className="text-muted-foreground">Issue and return books, manage library transactions</p>
      </div>

      {overdueTransactions.length > 0 && (
        <Card className="border-warning bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Overdue Books Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-warning-foreground">
              There are {overdueTransactions.length} overdue book(s) that require attention.
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="issue" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="issue">Issue Book</TabsTrigger>
          <TabsTrigger value="return">Return Book</TabsTrigger>
          <TabsTrigger value="transactions">All Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="issue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Issue New Book
              </CardTitle>
              <CardDescription>
                Issue a book to a student or library member.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleIssueBook} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bookSelect">Select Book *</Label>
                    <Select 
                      value={issueForm.bookId} 
                      onValueChange={(value) => setIssueForm({...issueForm, bookId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a book" />
                      </SelectTrigger>
                      <SelectContent>
                        {books.map((book) => (
                          <SelectItem key={book.id} value={book.id}>
                            {book.title} (Available: {book.available_copies})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userSelect">Select User *</Label>
                    <Select 
                      value={issueForm.userId} 
                      onValueChange={(value) => setIssueForm({...issueForm, userId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.user_id} value={user.user_id}>
                            {user.first_name} {user.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={issueForm.dueDate}
                    onChange={(e) => setIssueForm({...issueForm, dueDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Issue Book
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="return" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Return Book
              </CardTitle>
              <CardDescription>
                Process book returns and calculate fines if applicable.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReturnBook} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transactionSelect">Select Transaction *</Label>
                    <Select 
                      value={returnForm.transactionId} 
                      onValueChange={(value) => setReturnForm({...returnForm, transactionId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a transaction" />
                      </SelectTrigger>
                      <SelectContent>
                        {transactions.filter(t => t.status !== 'returned').map((transaction) => (
                          <SelectItem key={transaction.id} value={transaction.id}>
                            {transaction.books?.title} - {transaction.profiles?.first_name} {transaction.profiles?.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="returnDate">Return Date *</Label>
                    <Input
                      id="returnDate"
                      type="date"
                      value={returnForm.returnDate}
                      onChange={(e) => setReturnForm({...returnForm, returnDate: e.target.value})}
                      max={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Process Return
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Transaction History
              </CardTitle>
              <CardDescription>
                View all book transactions and their current status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions by book or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Return Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Fine</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.books?.title}</TableCell>
                        <TableCell>
                          {transaction.profiles?.first_name} {transaction.profiles?.last_name}
                        </TableCell>
                        <TableCell>{new Date(transaction.issue_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(transaction.due_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {transaction.return_date 
                            ? new Date(transaction.return_date).toLocaleDateString()
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              transaction.status === 'returned' ? 'default' :
                              transaction.status === 'overdue' ? 'destructive' : 'secondary'
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {transaction.fine_amount > 0 ? `$${transaction.fine_amount}` : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredTransactions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions found matching your search criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransactionManagement;
