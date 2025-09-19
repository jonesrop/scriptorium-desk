import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import AdminDashboard from '@/pages/AdminDashboard';
import StudentDashboard from '@/pages/StudentDashboard';

export function DashboardRouter() {
  const { profile } = useSupabaseAuth();
  
  if (profile?.role === 'admin') {
    return <AdminDashboard />;
  } else {
    return <StudentDashboard />;
  }
}