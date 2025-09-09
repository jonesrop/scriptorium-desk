import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Plus, Edit, Trash2, Search, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'student' | 'librarian';
  status: 'active' | 'inactive';
  joinDate: string;
  booksIssued: number;
}

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([
    {
      id: 'ST001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1234567890',
      role: 'student',
      status: 'active',
      joinDate: '2024-01-15',
      booksIssued: 2
    },
    {
      id: 'ST002',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      phone: '+1234567891',
      role: 'student',
      status: 'active',
      joinDate: '2024-02-20',
      booksIssued: 1
    },
    {
      id: 'LB001',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@library.com',
      phone: '+1234567892',
      role: 'librarian',
      status: 'active',
      joinDate: '2023-09-10',
      booksIssued: 0
    }
  ]);
  
  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'joinDate' | 'booksIssued'>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'student',
    status: 'active'
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate user ID
    const rolePrefix = newUser.role === 'student' ? 'ST' : 'LB';
    const roleUsers = users.filter(u => u.role === newUser.role);
    const userId = `${rolePrefix}${String(roleUsers.length + 1).padStart(3, '0')}`;
    
    const user: User = {
      ...newUser,
      id: userId,
      joinDate: new Date().toISOString().split('T')[0],
      booksIssued: 0
    };
    
    setUsers([...users, user]);
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'student',
      status: 'active'
    });
    
    toast({
      title: "User Added Successfully",
      description: `${user.firstName} ${user.lastName} has been added as a ${user.role}.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: "User Deleted",
      description: `${user?.firstName} ${user?.lastName} has been removed.`,
      variant: "destructive"
    });
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    toast({
      title: "Status Updated",
      description: "User status has been updated successfully.",
    });
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground">Manage library users and their accounts</p>
      </div>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add">Add New User</TabsTrigger>
          <TabsTrigger value="manage">Manage Users</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New User
              </CardTitle>
              <CardDescription>
                Create a new student or librarian account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        placeholder="user@example.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                        placeholder="+1234567890"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select 
                      value={newUser.role} 
                      onValueChange={(value: 'student' | 'librarian') => setNewUser({...newUser, role: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="librarian">Librarian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={newUser.status} 
                      onValueChange={(value: 'active' | 'inactive') => setNewUser({...newUser, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add User Account
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Directory
              </CardTitle>
              <CardDescription>
                View and manage all library users and their accounts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Books Issued</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback className="bg-gradient-primary text-white">
                                {getInitials(user.firstName, user.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.firstName} {user.lastName}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{user.id}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm">{user.email}</p>
                            <p className="text-sm text-muted-foreground">{user.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'librarian' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.status === 'active' ? 'default' : 'destructive'}
                            className="cursor-pointer"
                            onClick={() => toggleUserStatus(user.id)}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.booksIssued}</TableCell>
                        <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No users found matching your search criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;