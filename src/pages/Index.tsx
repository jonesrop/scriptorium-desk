import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Library, BookOpen, Users, BarChart3, Clock, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Book Management",
      description: "Comprehensive catalog management with search and filtering capabilities"
    },
    {
      icon: Users,
      title: "User Administration",
      description: "Manage student and librarian accounts with role-based access"
    },
    {
      icon: Clock,
      title: "Issue & Return",
      description: "Track book borrowing, returns, and overdue notifications"
    },
    {
      icon: BarChart3,
      title: "Reports & Analytics",
      description: "Detailed insights into library usage and performance metrics"
    },
    {
      icon: Shield,
      title: "Secure Access",
      description: "Role-based authentication with secure login system"
    },
    {
      icon: Library,
      title: "Digital Library",
      description: "Modern interface for efficient library operations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-background/10 backdrop-blur-sm"></div>
        <div className="relative container mx-auto px-6 py-24">
          <div className="text-center text-white">
            <div className="mb-8 flex justify-center">
              <div className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Library className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
              LibraryPro
              <span className="block text-3xl md:text-4xl font-normal text-white/80 mt-2">
                Modern Library Management
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Streamline your library operations with our comprehensive management system. 
              From book cataloging to user administration, everything you need in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
                <Link to="/login">Access System</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 text-lg px-8 py-6 backdrop-blur-sm"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-background py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your library efficiently and effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-muted py-20">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-display font-bold text-foreground mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of libraries already using LibraryPro to streamline their operations
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link to="/login">Access Library System</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
