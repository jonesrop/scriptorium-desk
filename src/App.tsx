import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";

import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import BookCatalog from "./pages/BookCatalog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// Dashboard Router Component
function DashboardRouter() {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  } else {
    return <StudentDashboard />;
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardRouter />} />
              {/* Admin routes */}
              <Route path="books" element={<div className="p-8 text-center text-muted-foreground">Book Management - Coming Soon</div>} />
              <Route path="users" element={<div className="p-8 text-center text-muted-foreground">User Management - Coming Soon</div>} />
              <Route path="transactions" element={<div className="p-8 text-center text-muted-foreground">Issue/Return - Coming Soon</div>} />
              <Route path="reports" element={<div className="p-8 text-center text-muted-foreground">Reports - Coming Soon</div>} />
              {/* Student routes */}
              <Route path="catalog" element={<BookCatalog />} />
              <Route path="my-books" element={<div className="p-8 text-center text-muted-foreground">My Books - Coming Soon</div>} />
              <Route path="favorites" element={<div className="p-8 text-center text-muted-foreground">Favorites - Coming Soon</div>} />
              <Route path="history" element={<div className="p-8 text-center text-muted-foreground">Reading History - Coming Soon</div>} />
              <Route path="settings" element={<div className="p-8 text-center text-muted-foreground">Settings - Coming Soon</div>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
