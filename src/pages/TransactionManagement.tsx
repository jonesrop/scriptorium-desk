import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, BookOpen, UserCheck, Calendar, Search, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  bookId: string;
  bookTitle: string;
  userId: string;
  userName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'issued' | 'returned' | 'overdue';
  fine: number;
}

const TransactionManagement = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TXN001',
      bookId: 'BK001',
      bookTitle: 'The Great Gatsby',
      userId: 'ST001',
      userName: 'John Doe',
      issueDate: '2024-01-15',
      dueDate: '2024-01-29',
      status: 'issued',
      fine: 0
    },
    {
      id: 'TXN002',
      bookId: 'BK002',
      bookTitle: 'To Kill a Mockingbird',
      userId: 'ST002',
      userName: 'Jane Smith',
      issueDate: '2024-01-10',
      dueDate: '2024-01-24',
      returnDate: '2024-01-22',
      status: 'returned',
      fine: 0
    },
    {
      id: 'TXN003',
      bookId: 'BK003',
      bookTitle: '1984',
      userId: 'ST003',
      userName: 'Mike Johnson',
      issueDate: '2023-12-20',
      dueDate: '2024-01-03',
      status: 'overdue',
      fine: 15
    }
  ]);

  const [issueForm, setIssueForm] = useState({
    bookId: '',
    userId: '',
    dueDate: ''
  });

  const [returnForm, setReturnForm] = useState({
    transactionId: '',
    returnDate: new Date().toISOString().split('T')[0]
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for books and users
  const books = [
    { id: 'BK001', title: 'The Great Gatsby', available: 3 },
    { id: 'BK002', title: 'To Kill a Mockingbird', available: 4 },
    { id: 'BK003', title: '1984', available: 2 },
    { id: 'BK004', title: 'Pride and Prejudice', available: 1 }
  ];

  const users = [
    { id: 'ST001', name: 'John Doe' },
    { id: 'ST002', name: 'Jane Smith' },
    { id: 'ST003', name: 'Mike Johnson' },
    { id: 'ST004', name: 'Sarah Wilson' }
  ];

  const calculateDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const calculateFine = (dueDate: string) => {
    const daysOverdue = calculateDaysOverdue(dueDate);
    return daysOverdue * 1; // $1 per day fine
  };

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();
    
    const book = books.find(b => b.id === issueForm.bookId);
    const user = users.find(u => u.id === issueForm.userId);
    
    if (!book || !user) {
      toast({
        title: "Error",
        description: "Please select valid book and user.",
        variant: "destructive"
      });
      return;
    }

    if (book.available <= 0) {
      toast({
        title: "Book Unavailable",
        description: "This book is currently out of stock.",
        variant: "destructive"
      });
      return;
    }

    const newTransaction: Transaction = {
      id: `TXN${String(transactions.length + 1).padStart(3, '0')}`,
      bookId: issueForm.bookId,
      bookTitle: book.title,
      userId: issueForm.userId,
      userName: user.name,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: issueForm.dueDate,
      status: 'issued',
      fine: 0
    };

    setTransactions([...transactions, newTransaction]);
    setIssueForm({ bookId: '', userId: '', dueDate: '' });
    
    toast({
      title: "Book Issued Successfully",
      description: `"${book.title}" has been issued to ${user.name}.`,
    });
  };

  const handleReturnBook = (e: React.FormEvent) => {
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

    const fine = calculateFine(transaction.dueDate);
    
    setTransactions(transactions.map(t => 
      t.id === returnForm.transactionId 
        ? { ...t, returnDate: returnForm.returnDate, status: 'returned', fine }
        : t
    ));
    
    setReturnForm({ transactionId: '', returnDate: new Date().toISOString().split('T')[0] });
    
    toast({
      title: "Book Returned Successfully",
      description: fine > 0 
        ? `Book returned with a fine of $${fine}.`
        : "Book returned without any fine.",
    });
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const overdueTransactions = transactions.filter(t => {
    if (t.status === 'returned') return false;
    return calculateDaysOverdue(t.dueDate) > 0;
  });

  // Update overdue transactions
  useEffect(() => {
    setTransactions(prevTransactions => 
      prevTransactions.map(t => {
        if (t.status === 'issued' && calculateDaysOverdue(t.dueDate) > 0) {
          return { ...t, status: 'overdue', fine: calculateFine(t.dueDate) };
        }
        return t;
      })
    );
  }, []);

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
                        {books.filter(book => book.available > 0).map((book) => (
                          <SelectItem key={book.id} value={book.id}>
                            {book.title} (Available: {book.available})
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
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.id})
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
                            {transaction.bookTitle} - {transaction.userName} ({transaction.id})
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

                {returnForm.transactionId && (
                  <div className="p-4 bg-muted rounded-lg">
                    {(() => {
                      const transaction = transactions.find(t => t.id === returnForm.transactionId);
                      if (!transaction) return null;
                      
                      const daysOverdue = calculateDaysOverdue(transaction.dueDate);
                      const fine = calculateFine(transaction.dueDate);
                      
                      return (
                        <div className="space-y-2">
                          <h4 className="font-semibold">Transaction Details</h4>
                          <p><strong>Book:</strong> {transaction.bookTitle}</p>
                          <p><strong>User:</strong> {transaction.userName}</p>
                          <p><strong>Due Date:</strong> {new Date(transaction.dueDate).toLocaleDateString()}</p>
                          {daysOverdue > 0 && (
                            <div className="text-warning">
                              <p><strong>Days Overdue:</strong> {daysOverdue}</p>
                              <p><strong>Fine Amount:</strong> ${fine}</p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

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
                  placeholder="Search transactions by book, user, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
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
                        <TableCell className="font-mono">{transaction.id}</TableCell>
                        <TableCell className="font-medium">{transaction.bookTitle}</TableCell>
                        <TableCell>{transaction.userName}</TableCell>
                        <TableCell>{new Date(transaction.issueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(transaction.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {transaction.returnDate 
                            ? new Date(transaction.returnDate).toLocaleDateString()
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
                          {transaction.fine > 0 ? `$${transaction.fine}` : '-'}
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