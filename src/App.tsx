import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardRouter } from "@/components/DashboardRouter";

import Index from "./pages/Index";
import Auth from '@/pages/Auth';
import BookCatalog from "./pages/BookCatalog";
import BookManagement from "./pages/BookManagement";
import UserManagement from "./pages/UserManagement";
import TransactionManagement from "./pages/TransactionManagement";
import MyBooks from "./pages/MyBooks";
import Favorites from "./pages/Favorites";
import ReadingStats from "./pages/ReadingStats";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SupabaseAuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
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
              <Route path="books" element={<BookManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="transactions" element={<TransactionManagement />} />
              <Route path="reports" element={<div className="p-8 text-center text-muted-foreground">Reports - Coming Soon</div>} />
              {/* Student routes */}
              <Route path="catalog" element={<BookCatalog />} />
              <Route path="my-books" element={<MyBooks />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="history" element={<ReadingStats />} />
              <Route path="settings" element={<div className="p-8 text-center text-muted-foreground">Settings - Coming Soon</div>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SupabaseAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
