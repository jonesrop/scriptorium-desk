import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  Clock, 
  AlertTriangle, 
  Plus,
  Search,
  TrendingUp,
  Library
} from 'lucide-react';
import { DashboardStats } from '@/types';

// Mock data for demonstration
const mockStats: DashboardStats = {
  totalBooks: 15420,
  totalUsers: 1250,
  booksIssued: 342,
  overdueBooks: 23,
  availableBooks: 15078,
  totalFines: 1250.50,
};

const recentActivities = [
  {
    id: 1,
    type: 'book_issued',
    message: 'Book "Data Structures & Algorithms" issued to John Doe',
    time: '5 minutes ago',
    status: 'success' as const,
  },
  {
    id: 2,
    type: 'book_returned',
    message: 'Book "Introduction to Physics" returned by Jane Smith',
    time: '12 minutes ago',
    status: 'success' as const,
  },
  {
    id: 3,
    type: 'overdue',
    message: 'Book "Chemistry Fundamentals" is overdue by Michael Brown',
    time: '1 hour ago',
    status: 'warning' as const,
  },
  {
    id: 4,
    type: 'new_user',
    message: 'New student account created for Sarah Wilson',
    time: '2 hours ago',
    status: 'info' as const,
  },
];

const popularBooks = [
  { title: 'Introduction to Computer Science', author: 'Robert Sedgewick', borrowed: 45 },
  { title: 'Calculus: Early Transcendentals', author: 'James Stewart', borrowed: 38 },
  { title: 'Organic Chemistry', author: 'Paula Bruice', borrowed: 32 },
  { title: 'Psychology: The Science of Mind', author: 'Michael Passer', borrowed: 28 },
];

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'info': return 'text-primary';
      default: return 'text-foreground';
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'book_issued': return <BookOpen className="h-4 w-4" />;
      case 'book_returned': return <BookOpen className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      case 'new_user': return <Users className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of library operations and statistics</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="bg-gradient-primary hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <Library className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalBooks.toLocaleString()}</div>
            <p className="text-xs text-success">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-success">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books Issued</CardTitle>
            <BookOpen className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.booksIssued}</div>
            <p className="text-xs text-muted-foreground">
              Currently checked out
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{mockStats.overdueBooks}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest library transactions and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`${getStatusColor(activity.status)} mt-1`}>
                    {getStatusIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Books */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Popular Books</CardTitle>
            <CardDescription>Most borrowed this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularBooks.map((book, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                  </div>
                  <Badge variant="secondary" className="bg-secondary/20 text-secondary-dark">
                    {book.borrowed}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used administrative functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <BookOpen className="h-6 w-6" />
              <span className="text-sm font-medium">Add New Book</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Users className="h-6 w-6" />
              <span className="text-sm font-medium">Manage Users</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Clock className="h-6 w-6" />
              <span className="text-sm font-medium">Issue Book</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <AlertTriangle className="h-6 w-6" />
              <span className="text-sm font-medium">Overdue Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;