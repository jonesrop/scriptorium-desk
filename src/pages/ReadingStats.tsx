import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Award,
  Target,
  Clock,
  BarChart3,
  Loader2 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ReadingStats {
  total_books_read: number;
  currently_reading: number;
  overdue_books: number;
  favorite_genre: string | null;
  reading_streak_days: number;
}

interface ReadingGoal {
  id: string;
  target_value: number;
  current_value: number;
  start_date: string;
  end_date: string;
  status: string;
}

const ReadingStats = () => {
  const { profile } = useSupabaseAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [goals, setGoals] = useState<ReadingGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [goalTarget, setGoalTarget] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (profile?.user_id) {
      fetchStats();
      fetchGoals();
    }
  }, [profile]);

  const fetchStats = async () => {
    try {
      // Fetch reading statistics
      const { data: issuedBooks, error: issuedError } = await supabase
        .from('issued_books')
        .select('*, book:books(genre)')
        .eq('user_id', profile?.user_id);

      if (issuedError) throw issuedError;

      const totalRead = issuedBooks?.filter(b => b.status === 'returned').length || 0;
      const currentlyReading = issuedBooks?.filter(b => b.status === 'issued').length || 0;
      const overdue = issuedBooks?.filter(b => b.status === 'overdue').length || 0;

      // Find favorite genre
      const genreCounts: { [key: string]: number } = {};
      issuedBooks?.forEach(book => {
        const genre = (book.book as any)?.genre;
        if (genre) {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        }
      });
      
      const favoriteGenre = Object.keys(genreCounts).reduce((a, b) => 
        genreCounts[a] > genreCounts[b] ? a : b
      , null);

      setStats({
        total_books_read: totalRead,
        currently_reading: currentlyReading,
        overdue_books: overdue,
        favorite_genre: favoriteGenre,
        reading_streak_days: Math.floor(Math.random() * 30) + 1, // Mock for now
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load reading statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('reading_goals')
        .select('*')
        .eq('user_id', profile?.user_id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error: any) {
      console.error('Failed to load goals:', error);
    }
  };

  const createGoal = async () => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const { error } = await supabase
        .from('reading_goals')
        .insert({
          user_id: profile?.user_id,
          goal_type: 'books_per_month',
          target_value: goalTarget,
          current_value: 0,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          status: 'active',
        });

      if (error) throw error;

      toast({
        title: 'Goal created!',
        description: `Your goal to read ${goalTarget} books this month has been set.`,
      });
      
      setDialogOpen(false);
      fetchGoals();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to create reading goal',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Reading Statistics</h1>
          <p className="text-muted-foreground">Track your reading progress and achievements</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Target className="h-4 w-4 mr-2" />
              Set New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Reading Goal</DialogTitle>
              <DialogDescription>
                Create a monthly reading goal to track your progress
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="target">Books to read this month</Label>
                <Input
                  id="target"
                  type="number"
                  min="1"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(parseInt(e.target.value))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={createGoal}>Create Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Books Read
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.total_books_read}</div>
            <p className="text-xs text-muted-foreground mt-1">Total completed</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-secondary" />
              Currently Reading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.currently_reading}</div>
            <p className="text-xs text-muted-foreground mt-1">Books in progress</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              Reading Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.reading_streak_days}</div>
            <p className="text-xs text-muted-foreground mt-1">Days in a row</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-accent" />
              Favorite Genre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-sm">
              {stats?.favorite_genre || 'None yet'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">Most read category</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      {goals.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Active Reading Goals
            </CardTitle>
            <CardDescription>Your current reading targets and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {goals.map((goal) => {
              const progress = (goal.current_value / goal.target_value) * 100;
              const daysLeft = Math.ceil(
                (new Date(goal.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              
              return (
                <div key={goal.id} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Read {goal.target_value} books this month</p>
                      <p className="text-sm text-muted-foreground">
                        {goal.current_value} of {goal.target_value} completed • {daysLeft} days left
                      </p>
                    </div>
                    {progress >= 100 && (
                      <Award className="h-6 w-6 text-success" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">
                      {Math.round(progress)}% complete
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Alerts */}
      {stats && stats.overdue_books > 0 && (
        <Card className="shadow-soft border-warning bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <Calendar className="h-5 w-5" />
              Overdue Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-warning-foreground">
              You have {stats.overdue_books} overdue book(s). Please return them to avoid fines.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.href = '/app/my-books'}
            >
              View My Books
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReadingStats;