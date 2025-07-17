'use client';

import { useEffect, useState } from 'react';
import { analyticsService, AnalyticsData } from '@/services/analyticsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Activity,
  Crown,
  ThumbsUp,
  MessageCircle,
  Tag,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const data = await analyticsService.mockGetAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <Layout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!analytics) {
    return (
      <ProtectedRoute requiredRole="admin">
        <Layout>
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Failed to load analytics data</p>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <Layout>
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Insights and metrics for your InsightBoard platform
            </p>
          </motion.div>

          {/* Overview Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {analytics.totalUsers}
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {analytics.activeUsers} active
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">
                  Total Boards
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {analytics.totalBoards}
                </div>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Active boards
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">
                  Total Posts
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {analytics.totalPosts}
                </div>
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  Ideas shared
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100">
                  Comments
                </CardTitle>
                <MessageCircle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {analytics.totalComments}
                </div>
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  Discussions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100">
                  Engagement
                </CardTitle>
                <Activity className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                  87%
                </div>
                <p className="text-xs text-red-700 dark:text-red-300">
                  User activity
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Users */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Crown className="w-5 h-5 mr-2 text-yellow-600" />
                    Top Contributors
                  </CardTitle>
                  <CardDescription>
                    Most active users by posts, comments, and votes received
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topUsers.map((user, index) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {index === 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                                <Crown className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{user.postsCount} posts</span>
                              <span>{user.commentsCount} comments</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ThumbsUp className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{user.votesReceived}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Posts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    Top Posts
                  </CardTitle>
                  <CardDescription>
                    Most voted and discussed posts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topPosts.map((post, index) => (
                      <div key={post.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-sm line-clamp-2">{post.title}</h3>
                          <Badge variant="outline" className="text-xs ml-2">
                            {post.boardTitle}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          by {post.author}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {post.votes}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            {post.comments}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Trending Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-purple-600" />
                  Trending Tags
                </CardTitle>
                <CardDescription>
                  Most popular tags and their growth trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {analytics.trendingTags.map((tag) => (
                    <div key={tag.tag} className="p-4 border rounded-lg text-center">
                      <Badge variant="secondary" className="mb-2">
                        {tag.tag}
                      </Badge>
                      <div className="text-2xl font-bold mb-1">{tag.count}</div>
                      <div className={`flex items-center justify-center text-xs ${
                        tag.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tag.growth > 0 ? (
                          <ArrowUp className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(tag.growth)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}