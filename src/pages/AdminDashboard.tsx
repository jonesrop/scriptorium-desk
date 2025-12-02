import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  DollarSign,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalBooks: number;
  totalUsers: number;
  booksIssued: number;
  overdueBooks: number;
  availableBooks: number;
  totalFines: number;
}

interface RecentActivity {
  id: string;
  type: string;
  message: string;
  time: string;
  status: 'success' | 'warning' | 'info';
}

interface PopularBook {
  title: string;
  author: string;
  borrow_count: number;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    totalUsers: 0,
    booksIssued: 0,
    overdueBooks: 0,
    availableBooks: 0,
    totalFines: 0,
  });
  const [popularBooks, setPopularBooks] = useState<PopularBook[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats in parallel
      const [
        booksRes,
        usersRes,
        issuedRes,
        finesRes,
      ] = await Promise.all([
        supabase.from('books').select('*', { count: 'exact' }),
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('issued_books').select('*'),
        supabase.from('fines').select('amount, status'),
      ]);

      const totalBooks = booksRes.count || 0;
      const totalUsers = usersRes.count || 0;
      const allIssued = issuedRes.data || [];
      
      // Calculate stats
      const booksIssued = allIssued.filter(b => b.status === 'issued').length;
      const overdueBooks = allIssued.filter(b => {
        if (b.status !== 'issued') return false;
        return new Date(b.due_date) < new Date();
      }).length;

      const availableBooks = (booksRes.data || []).reduce((sum, book) => 
        sum + (book.available_copies || 0), 0
      );

      const totalFines = (finesRes.data || [])
        .filter(f => f.status === 'pending')
        .reduce((sum, fine) => sum + Number(fine.amount), 0);

      setStats({
        totalBooks,
        totalUsers,
        booksIssued,
        overdueBooks,
        availableBooks,
        totalFines,
      });

      // Fetch popular books
      const { data: popularBooksData } = await supabase
        .from('books')
        .select('title, author, borrow_count')
        .order('borrow_count', { ascending: false })
        .limit(5);

      setPopularBooks(popularBooksData || []);

      // Fetch recent activities (from audit logs or issued_books)
      const { data: recentIssued } = await supabase
        .from('issued_books')
        .select(`
          *,
          books (title),
          profiles (first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      const activities: RecentActivity[] = (recentIssued || []).map((item: any) => {
        const bookTitle = item.books?.title || 'Unknown Book';
        const userName = item.profiles ? `${item.profiles.first_name} ${item.profiles.last_name}` : 'Unknown User';
        const isOverdue = item.status === 'issued' && new Date(item.due_date) < new Date();
        
        return {
          id: item.id,
          type: item.status === 'returned' ? 'book_returned' : isOverdue ? 'overdue' : 'book_issued',
          message: item.status === 'returned' 
            ? `Book "${bookTitle}" returned by ${userName}`
            : isOverdue
            ? `Book "${bookTitle}" is overdue by ${userName}`
            : `Book "${bookTitle}" issued to ${userName}`,
          time: formatTimeAgo(item.created_at),
          status: item.status === 'returned' ? 'success' : isOverdue ? 'warning' : 'info',
        };
      });

      setRecentActivities(activities);
    } catch (error: any) {
      toast({
        title: "Error Loading Dashboard",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-amber-600 dark:text-amber-400';
      case 'info': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-foreground';
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'book_issued': return <BookOpen className="h-4 w-4" />;
      case 'book_returned': return <CheckCircle className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      case 'new_user': return <Users className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
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
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of library operations and statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalBooks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.availableBooks} available
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active library members
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Books Issued</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.booksIssued}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently borrowed
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Books</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.overdueBooks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Books</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.availableBooks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready to issue
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Fines</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">${stats.totalFines.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Outstanding payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Popular Books */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest library transactions and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-border last:border-0">
                    <div className={`mt-1 ${getStatusColor(activity.status)}`}>
                      {getStatusIcon(activity.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-foreground leading-none">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Popular Books */}
        <Card>
          <CardHeader>
            <CardTitle>Most Borrowed Books</CardTitle>
            <CardDescription>Top 5 books by borrow count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularBooks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
              ) : (
                popularBooks.map((book, index) => (
                  <div key={index} className="flex items-center justify-between pb-3 border-b border-border last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{book.title}</p>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {book.borrow_count} times
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild className="h-auto py-4">
              <Link to="/app/books">
                <BookOpen className="mr-2 h-4 w-4" />
                Manage Books
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4">
              <Link to="/app/users">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4">
              <Link to="/app/transactions">
                <Clock className="mr-2 h-4 w-4" />
                Issue/Return Books
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4">
              <Link to="/app/reports">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Reports
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
