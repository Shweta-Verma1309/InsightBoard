'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useBoardStore } from '@/store/boardStore';
import { boardService } from '@/services/boardService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Plus,
  ArrowRight,
  Clock,
  ThumbsUp,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { boards, setBoards, setLoading } = useBoardStore();
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalBoards: 0,
    totalPosts: 0,
    totalComments: 0,
    myBoards: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const boardsData = await boardService.mockGetBoards();
        setBoards(boardsData);
        
        // Get recent posts from all boards
        const allPosts = [];
        for (const board of boardsData.slice(0, 2)) {
          const posts = await boardService.mockGetPosts(board.id);
          allPosts.push(...posts.map(post => ({ ...post, boardTitle: board.title })));
        }
        
        // Sort by creation date and take the most recent
        const sortedPosts = allPosts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 5);
        
        setRecentPosts(sortedPosts);
        
        // Calculate stats
        const totalComments = allPosts.reduce((sum, post) => sum + post.comments.length, 0);
        const myBoards = boardsData.filter(board => board.createdBy === user?.id).length;
        
        setStats({
          totalBoards: boardsData.length,
          totalPosts: allPosts.length,
          totalComments,
          myBoards,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id, setBoards, setLoading]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {getGreeting()}, {user?.name}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Here's what's happening with your boards today.
                </p>
              </div>
              <Link href="/boards/create">
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create Board</span>
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Total Boards
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {stats.totalBoards}
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {stats.myBoards} created by you
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">
                  Total Posts
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {stats.totalPosts}
                </div>
                <p className="text-xs text-green-700 dark:text-green-300">
                  +12% from last week
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">
                  Comments
                </CardTitle>
                <MessageCircle className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {stats.totalComments}
                </div>
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  Active discussions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100">
                  Team Members
                </CardTitle>
                <Users className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  24
                </div>
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  Across all boards
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Boards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Your Boards</CardTitle>
                    <CardDescription>
                      Boards you've created or recently accessed
                    </CardDescription>
                  </div>
                  <Link href="/boards">
                    <Button variant="outline" size="sm">
                      View All
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {boards.slice(0, 3).map((board) => (
                      <Link key={board.id} href={`/boards/${board.id}`}>
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                          <div className="flex-1">
                            <h3 className="font-medium">{board.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {board.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              {board.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              <div className="flex items-center text-xs text-gray-500">
                                <Users className="w-3 h-3 mr-1" />
                                {board.members.length}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {formatDistanceToNow(new Date(board.updatedAt), { addSuffix: true })}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest posts and discussions across all boards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <Link key={post.id} href={`/boards/${post.boardId}`}>
                        <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={post.author.avatar} alt={post.author.name} />
                            <AvatarFallback className="text-xs">
                              {post.author.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium truncate">
                                {post.title}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {post.boardTitle}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              by {post.author.name}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <div className="flex items-center">
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                {post.votes.upvotes}
                              </div>
                              <div className="flex items-center">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                {post.comments.length}
                              </div>
                              <span>
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}