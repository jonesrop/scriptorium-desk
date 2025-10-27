export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'student';
  firstName: string;
  lastName: string;
  contactNumber?: string;
  createdAt: Date;
  isActive: boolean;
}

export interface Book {
  id: string;
  callNumber: string;
  title: string;
  author: string;
  publisher: string;
  genre: string;
  totalCopies: number;
  availableCopies: number;
  isbn?: string;
  publicationYear?: number;
  description?: string;
  createdAt: Date;
  borrowCount: number;
}

export interface IssuedBook {
  id: string;
  bookId: string;
  userId: string;
  issueDate: Date;
  dueDate: Date;
  returnDate?: Date;
  fineAmount: number;
  status: 'issued' | 'returned' | 'overdue';
  renewalCount: number;
}

export interface BookReservation {
  id: string;
  bookId: string;
  userId: string;
  requestDate: Date;
  status: 'pending' | 'fulfilled' | 'cancelled';
}

export interface DashboardStats {
  totalBooks: number;
  totalUsers: number;
  booksIssued: number;
  overdueBooks: number;
  availableBooks: number;
  totalFines: number;
}