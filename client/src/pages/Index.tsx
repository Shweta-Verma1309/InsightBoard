import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MessageSquare, TrendingUp, Star, ChevronRight, Plus, Bot, Shield, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageSquare,
      title: "Real-time Messaging",
      description: "Instant 1-on-1 and group chats with Socket.IO"
    },
    {
      icon: Bot,
      title: "AI Integration",
      description: "OpenAI-powered chat summaries and sentiment analysis"
    },
    {
      icon: Users,
      title: "Group Management",
      description: "Create and manage groups with owner permissions"
    },
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "JWT-based auth with role-based access control"
    },
    {
      icon: Sparkles,
      title: "Smart Features",
      description: "Typing indicators, read receipts, and chat themes"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed with modern tech stack"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-full bg-primary">
              <MessageSquare className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to InsightBoard
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A real-time feedback and collaboration dashboard for teams to brainstorm, 
            share ideas, and collaborate effectively.
          </p>
          <div className="space-x-4">
            <Button size="lg" onClick={() => navigate("/login")}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/register")}>
              Create Account
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Section */}
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Start Collaborating</CardTitle>
              <CardDescription>
                Explore boards, create feedback posts, and collaborate with your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate("/boards")} 
                className="w-full"
                size="lg"
              >
                View Boards
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
