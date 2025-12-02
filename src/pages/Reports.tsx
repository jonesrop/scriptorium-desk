import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  TrendingUp, 
  BookOpen, 
  Users, 
  DollarSign, 
  AlertTriangle,
  Loader2 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BorrowingReport {
  user_name: string;
  book_title: string;
  issue_date: string;
  due_date: string;
  status: string;
}

interface OverdueReport {
  user_name: string;
  book_title: string;
  days_overdue: number;
  fine_amount: number;
}

const Reports = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [borrowingData, setBorrowingData] = useState<BorrowingReport[]>([]);
  const [overdueData, setOverdueData] = useState<OverdueReport[]>([]);
  const [stats, setStats] = useState({
    totalBorrowed: 0,
    totalReturned: 0,
    totalOverdue: 0,
    totalFines: 0,
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      // Fetch issued books with user and book details
      const { data: issuedBooks, error } = await supabase
        .from('issued_books')
        .select('*')
        .order('issue_date', { ascending: false });

      if (error) throw error;

      // Fetch related data
      const booksWithDetails = await Promise.all(
        (issuedBooks || []).map(async (issued) => {
          const [bookRes, userRes] = await Promise.all([
            supabase.from('books').select('title').eq('id', issued.book_id).single(),
            supabase.from('profiles').select('first_name, last_name').eq('user_id', issued.user_id).single()
          ]);

          return {
            ...issued,
            book_title: bookRes.data?.title || 'Unknown',
            user_name: userRes.data ? `${userRes.data.first_name} ${userRes.data.last_name}` : 'Unknown'
          };
        })
      );

      // Calculate stats
      const totalBorrowed = booksWithDetails.filter(b => b.status === 'issued').length;
      const totalReturned = booksWithDetails.filter(b => b.status === 'returned').length;
      
      const overdue = booksWithDetails
        .filter(b => b.status === 'issued' && new Date(b.due_date) < new Date())
        .map(b => {
          const daysOverdue = Math.floor(
            (new Date().getTime() - new Date(b.due_date).getTime()) / (1000 * 60 * 60 * 24)
          );
          return {
            user_name: b.user_name,
            book_title: b.book_title,
            days_overdue: daysOverdue,
            fine_amount: daysOverdue * 0.5, // $0.50 per day
          };
        });

      const totalFines = overdue.reduce((sum, item) => sum + item.fine_amount, 0);

      setStats({
        totalBorrowed,
        totalReturned,
        totalOverdue: overdue.length,
        totalFines,
      });

      setBorrowingData(booksWithDetails.map(b => ({
        user_name: b.user_name,
        book_title: b.book_title,
        issue_date: new Date(b.issue_date).toLocaleDateString(),
        due_date: new Date(b.due_date).toLocaleDateString(),
        status: b.status,
      })));

      setOverdueData(overdue);
    } catch (error: any) {
      toast({
        title: "Error Loading Reports",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast({
        title: "No Data",
        description: "No data available to export",
        variant: "destructive"
      });
      return;
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `Report exported as ${filename}.csv`,
    });
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
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-muted-foreground">Comprehensive library usage and performance reports</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Currently Borrowed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalBorrowed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Returned This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalReturned}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Books</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.totalOverdue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Fines</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">${stats.totalFines.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="borrowing" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="borrowing">Borrowing Report</TabsTrigger>
          <TabsTrigger value="overdue">Overdue Report</TabsTrigger>
        </TabsList>

        <TabsContent value="borrowing" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Borrowing Activity</CardTitle>
                  <CardDescription>Complete list of all issued and returned books</CardDescription>
                </div>
                <Button
                  onClick={() => exportToCSV(borrowingData, 'borrowing-report')}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {borrowingData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No borrowing activity found
                        </TableCell>
                      </TableRow>
                    ) : (
                      borrowingData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.user_name}</TableCell>
                          <TableCell>{item.book_title}</TableCell>
                          <TableCell>{item.issue_date}</TableCell>
                          <TableCell>{item.due_date}</TableCell>
                          <TableCell>
                            <Badge variant={item.status === 'returned' ? 'default' : 'secondary'}>
                              {item.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Overdue Books</CardTitle>
                  <CardDescription>Books that have exceeded their due date</CardDescription>
                </div>
                <Button
                  onClick={() => exportToCSV(overdueData, 'overdue-report')}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead>Days Overdue</TableHead>
                      <TableHead>Fine Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overdueData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No overdue books found
                        </TableCell>
                      </TableRow>
                    ) : (
                      overdueData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.user_name}</TableCell>
                          <TableCell>{item.book_title}</TableCell>
                          <TableCell>
                            <Badge variant="destructive">{item.days_overdue} days</Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-amber-600 dark:text-amber-400">
                            ${item.fine_amount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
