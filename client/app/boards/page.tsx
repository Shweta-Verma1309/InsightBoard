'use client';

import { useEffect, useState } from 'react';
import { useBoardStore } from '@/store/boardStore';
import { useAuthStore } from '@/store/authStore';
import { boardService } from '@/services/boardService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Plus, 
  Users, 
  Clock, 
  Filter,
  Grid,
  List,
  Globe,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function BoardsPage() {
  const { user } = useAuthStore();
  const { boards, setBoards, setLoading } = useBoardStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    const fetchBoards = async () => {
      setLoading(true);
      try {
        const boardsData = await boardService.mockGetBoards();
        setBoards(boardsData);
      } catch (error) {
        console.error('Failed to fetch boards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [setBoards, setLoading]);

  const filteredBoards = boards.filter(board => {
    const matchesSearch = board.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         board.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         board.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'my-boards' && board.createdBy === user?.id) ||
                         (filterBy === 'public' && board.isPublic) ||
                         (filterBy === 'private' && !board.isPublic);
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'name':
        return a.title.localeCompare(b.title);
      case 'members':
        return b.members.length - a.members.length;
      default:
        return 0;
    }
  });

  const BoardCard = ({ board, index }: { board: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/boards/${board.id}`}>
        <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {board.title}
                  </CardTitle>
                  {board.isPublic ? (
                    <Globe className="w-4 h-4 text-green-600" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <CardDescription className="line-clamp-2">
                  {board.description}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-3">
              {board.tags.slice(0, 3).map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {board.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{board.tags.length - 3}
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {board.members.length}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDistanceToNow(new Date(board.updatedAt), { addSuffix: true })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );

  const BoardListItem = ({ board, index }: { board: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/boards/${board.id}`}>
        <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                    {board.title}
                  </h3>
                  {board.isPublic ? (
                    <Globe className="w-4 h-4 text-green-600" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                  <div className="flex flex-wrap gap-1">
                    {board.tags.slice(0, 2).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {board.description}
                </p>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {board.members.length} members
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Updated {formatDistanceToNow(new Date(board.updatedAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Insight Boards
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Discover and collaborate on feedback boards
              </p>
            </div>
            <Link href="/boards/create">
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Board</span>
              </Button>
            </Link>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-between"
          >
            <div className="flex flex-1 items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search boards, tags, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Boards</SelectItem>
                  <SelectItem value="my-boards">My Boards</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="members">Members</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          {/* Boards Grid/List */}
          <div className="space-y-6">
            {filteredBoards.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No boards found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchQuery ? 'Try adjusting your search terms' : 'Create your first board to get started'}
                </p>
                {!searchQuery && (
                  <Link href="/boards/create">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Board
                    </Button>
                  </Link>
                )}
              </motion.div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBoards.map((board, index) => (
                      <BoardCard key={board.id} board={board} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBoards.map((board, index) => (
                      <BoardListItem key={board.id} board={board} index={index} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}