import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Search, 
  Calendar, 
  Clock,
  Star,
  Filter,
  Heart,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for student dashboard
const mockBorrowedBooks = [
  {
    id: '1',
    title: 'Data Structures and Algorithms in Java',
    author: 'Robert Lafore',
    callNumber: 'CS001.123',
    issueDate: new Date('2024-01-10'),
    dueDate: new Date('2024-01-24'),
    renewalCount: 1,
    status: 'issued' as const,
  },
  {
    id: '2',
    title: 'Introduction to Machine Learning',
    author: 'Ethem Alpaydin',
    callNumber: 'CS002.456',
    issueDate: new Date('2024-01-15'),
    dueDate: new Date('2024-01-29'),
    renewalCount: 0,
    status: 'issued' as const,
  },
  {
    id: '3',
    title: 'Calculus: Early Transcendentals',
    author: 'James Stewart',
    callNumber: 'MATH001.789',
    issueDate: new Date('2024-01-05'),
    dueDate: new Date('2024-01-19'),
    renewalCount: 2,
    status: 'overdue' as const,
  },
];

const mockRecommendedBooks = [
  {
    id: '4',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    genre: 'Computer Science',
    rating: 4.8,
    available: true,
  },
  {
    id: '5',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas, Andrew Hunt',
    genre: 'Computer Science',
    rating: 4.9,
    available: true,
  },
  {
    id: '6',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Gang of Four',
    genre: 'Computer Science',
    rating: 4.7,
    available: false,
  },
];

const mockRecentHistory = [
  {
    id: '7',
    title: 'Introduction to Database Systems',
    author: 'C.J. Date',
    returnDate: new Date('2024-01-08'),
    rating: 5,
  },
  {
    id: '8',
    title: 'Operating System Concepts',
    author: 'Abraham Silberschatz',
    returnDate: new Date('2024-01-03'),
    rating: 4,
  },
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (status: string, dueDate: Date) => {
    if (status === 'overdue') {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    
    const daysLeft = getDaysUntilDue(dueDate);
    if (daysLeft <= 3) {
      return <Badge variant="secondary" className="bg-warning/20 text-warning-foreground">Due Soon</Badge>;
    }
    
    return <Badge variant="secondary" className="bg-success/20 text-success-foreground">Active</Badge>;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'fill-secondary text-secondary' : 'text-muted-foreground'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-muted-foreground">Here's your library activity and recommendations</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{mockBorrowedBooks.length}</p>
                <p className="text-xs text-muted-foreground">Books Borrowed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-muted-foreground">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-success" />
              <div>
                <p className="text-2xl font-bold">25</p>
                <p className="text-xs text-muted-foreground">Books Read</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-2xl font-bold">$0.00</p>
                <p className="text-xs text-muted-foreground">Outstanding Fines</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Currently Borrowed Books */}
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle>Currently Borrowed Books</CardTitle>
            <CardDescription>Manage your active book loans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBorrowedBooks.map((book) => (
                <div key={book.id} className="flex items-start justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium leading-none">{book.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
                        <p className="text-xs text-muted-foreground">Call #: {book.callNumber}</p>
                      </div>
                      {getStatusBadge(book.status, book.dueDate)}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Due: {book.dueDate.toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {getDaysUntilDue(book.dueDate)} days left
                      </span>
                      <span>Renewed: {book.renewalCount}x</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      Renew
                    </Button>
                    <Button size="sm" variant="outline">
                      Return
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Books */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
            <CardDescription>Based on your reading history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecommendedBooks.map((book) => (
                <div key={book.id} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium leading-tight">{book.title}</h4>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {renderStars(Math.floor(book.rating))}
                        <span className="text-xs text-muted-foreground ml-1">{book.rating}</span>
                      </div>
                    </div>
                    <Heart className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full" 
                    variant={book.available ? "default" : "outline"}
                    disabled={!book.available}
                  >
                    {book.available ? 'Borrow' : 'Reserve'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reading History */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Recent Reading History</CardTitle>
          <CardDescription>Books you've recently returned</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockRecentHistory.map((book) => (
              <div key={book.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <h4 className="font-medium">{book.title}</h4>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                  <p className="text-xs text-muted-foreground">
                    Returned: {book.returnDate.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(book.rating)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;