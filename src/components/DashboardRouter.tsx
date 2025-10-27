import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import AdminDashboard from '@/pages/AdminDashboard';
import StudentDashboard from '@/pages/StudentDashboard';
import { Loader2 } from 'lucide-react';

export function DashboardRouter() {
  const { profile, isLoading } = useSupabaseAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (profile?.role === 'admin') {
    return <AdminDashboard />;
  } else {
    return <StudentDashboard />;
  }
}