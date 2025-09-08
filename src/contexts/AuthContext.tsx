import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, AuthContextType } from '@/types';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@library.edu',
    role: 'admin',
    firstName: 'Library',
    lastName: 'Administrator',
    contactNumber: '+1-555-0101',
    createdAt: new Date('2024-01-01'),
    isActive: true,
  },
  {
    id: '2',
    username: 'student1',
    email: 'john.doe@university.edu',
    role: 'student',
    firstName: 'John',
    lastName: 'Doe',
    contactNumber: '+1-555-0102',
    createdAt: new Date('2024-01-15'),
    isActive: true,
  },
  {
    id: '3',
    username: 'student2',
    email: 'jane.smith@university.edu',
    role: 'student',
    firstName: 'Jane',
    lastName: 'Smith',
    contactNumber: '+1-555-0103',
    createdAt: new Date('2024-02-01'),
    isActive: true,
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored authentication
    const storedUser = localStorage.getItem('libraryUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('libraryUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication logic
    const foundUser = mockUsers.find(
      u => u.username === credentials.username && u.isActive
    );

    if (foundUser && (credentials.password === 'password' || 
                     (credentials.username === 'admin' && credentials.password === 'admin123'))) {
      setUser(foundUser);
      localStorage.setItem('libraryUser', JSON.stringify(foundUser));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${foundUser.firstName}!`,
      });
      
      setIsLoading(false);
      return true;
    }
    
    toast({
      title: "Login Failed",
      description: "Invalid username or password",
      variant: "destructive",
    });
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('libraryUser');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}