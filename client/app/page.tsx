'use client';

import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Users, 
  Zap, 
  Shield, 
  BarChart3, 
  Lightbulb,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      icon: MessageSquare,
      title: 'Real-time Collaboration',
      description: 'Collaborate with your team in real-time with live updates and instant notifications.',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Role-based Access',
      description: 'Secure role-based permissions for Admin, Member, and Viewer access levels.',
      color: 'text-green-600'
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      description: 'Share ideas, vote on suggestions, and provide feedback instantly.',
      color: 'text-yellow-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track engagement, popular ideas, and team collaboration metrics.',
      color: 'text-purple-600'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'JWT-based authentication with HTTP-only cookies for maximum security.',
      color: 'text-red-600'
    },
    {
      icon: Lightbulb,
      title: 'Smart Organization',
      description: 'Organize feedback with tags, filters, and smart search capabilities.',
      color: 'text-orange-600'
    }
  ];

  const benefits = [
    'Create unlimited insight boards for different projects',
    'Real-time voting and commenting system',
    'Advanced search and filtering options',
    'Comprehensive analytics and reporting',
    'Mobile-responsive design',
    'Dark mode support'
  ];

  return (
    <Layout>
      <div className="space-y-20">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-20"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <Badge variant="secondary" className="mb-4 px-4 py-2">
                🚀 Real-time Collaboration Platform
              </Badge>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Transform Ideas into
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Actionable Insights
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              InsightBoard is a powerful real-time feedback and collaboration dashboard that helps teams 
              brainstorm ideas, collect feedback, vote on suggestions, and collaborate seamlessly.
            </p>
            
            {!isAuthenticated ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                    Sign In
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/boards">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                    Browse Boards
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Modern Teams
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to collect, organize, and act on feedback from your team and users.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center mb-4`}>
                        <Icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-3xl"
        >
          <div className="max-w-4xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose InsightBoard?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Built for teams who value collaboration and data-driven decisions.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 text-lg">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Demo Section */}
        {!isAuthenticated && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="py-20 text-center"
          >
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Try InsightBoard with our demo accounts and see how it can transform your team's collaboration.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Admin Demo</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">Full access to all features</p>
                  <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                    <p>Email: admin@insightboard.com</p>
                    <p>Password: admin123</p>
                  </div>
                </Card>
                
                <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Member Demo</h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-3">Standard user experience</p>
                  <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
                    <p>Email: member@insightboard.com</p>
                    <p>Password: member123</p>
                  </div>
                </Card>
              </div>
              
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-3">
                  Try Demo Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}