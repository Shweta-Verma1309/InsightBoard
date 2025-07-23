'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useBoardStore } from '@/store/boardStore';
import { boardService } from '@/services/boardService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  ArrowLeft, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Send,
  Globe,
  Lock,
  Users,
  Clock,
  Tag,
  TrendingUp,
  X
} from 'lucide-react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function BoardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { currentBoard, setCurrentBoard, posts, setPosts, setLoading } = useBoardStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'votes' | 'comments'>('recent');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isCommenting, setIsCommenting] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  
  // Create Post Form
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const boardId = params.id as string;

  useEffect(() => {
    if (!boardId || typeof boardId !== 'string') return;
    const fetchBoardData = async () => {
      if (!boardId) return;
      
      setLoading(true);
      try {
        // Fetch board details and posts
        console.log('SURU HOGA');
        const [boardData, postsData] = await Promise.all([
          boardService.getBoardById(boardId),
          boardService.getPosts(boardId)
        ]);
        console.log("router.query.id", boardId);

        console.log('Board ID:', boardId);

        setCurrentBoard(boardData);
        setPosts(postsData);
      } catch (error) {
        console.error('Failed to fetch board data:', error);
        toast.error('Failed to load board');
        router.push('/boards');
      } finally {
        setLoading(false);
      }
    };

    fetchBoardData();
  }, [boardId, setCurrentBoard, setPosts, setLoading, router]);

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = filterStatus === 'all' || post.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'votes':
          return (b.votes.upvotes - b.votes.downvotes) - (a.votes.upvotes - a.votes.downvotes);
        case 'comments':
          return b.comments.length - a.comments.length;
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Handle post creation
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const newPost = await boardService.createPost({
        boardId,
        title: postForm.title.trim(),
        content: postForm.content.trim(),
        tags: postForm.tags,
      });

      setPosts([newPost, ...posts]);
      setPostForm({ title: '', content: '', tags: [] });
      setIsCreatePostOpen(false);
      toast.success('Post created successfully!');
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle voting
  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    try {
      const updatedVotes = await boardService.votePost(postId, voteType);
      
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, votes: updatedVotes }
          : post
      ));
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  // Handle comment creation
  const handleCreateComment = async (postId: string) => {
    if (!commentText.trim()) return;

    try {
      const newComment = await boardService.createComment({
        postId,
        content: commentText.trim(),
      });

      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      ));

      setCommentText('');
      setIsCommenting(null);
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  // Add tag to post form
  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !postForm.tags.includes(trimmedTag) && postForm.tags.length < 5) {
      setPostForm(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPostForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!currentBoard) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

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
            <div className="flex items-center space-x-4">
              <Link href="/boards">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Boards
                </Button>
              </Link>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currentBoard.title}
                  </h1>
                  {currentBoard.isPublic ? (
                    <Globe className="w-5 h-5 text-green-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentBoard.description}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {currentBoard.members.length} members
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Updated {formatDistanceToNow(new Date(currentBoard.updatedAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>

            <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create Post</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                  <DialogDescription>
                    Share your idea, feedback, or suggestion with the team.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="post-title">Title *</Label>
                    <Input
                      id="post-title"
                      placeholder="What's your idea or suggestion?"
                      value={postForm.title}
                      onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="post-content">Content *</Label>
                    <Textarea
                      id="post-content"
                      placeholder="Describe your idea in detail..."
                      value={postForm.content}
                      onChange={(e) => setPostForm(prev => ({ ...prev, content: e.target.value }))}
                      required
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {postForm.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {postForm.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? 'Creating...' : 'Create Post'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsCreatePostOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Board Tags */}
          {currentBoard.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-wrap gap-2"
            >
              {currentBoard.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center space-x-1">
                  <Tag className="w-3 h-3" />
                  <span>{tag}</span>
                </Badge>
              ))}
            </motion.div>
          )}

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-between"
          >
            <div className="flex flex-1 items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="implemented">Implemented</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: 'recent' | 'votes' | 'comments') => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="votes">Most Voted</SelectItem>
                  <SelectItem value="comments">Most Discussed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Posts List */}
          <div className="space-y-6">
            {filteredPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No posts found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchQuery ? 'Try adjusting your search terms' : 'Be the first to share an idea!'}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsCreatePostOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Post
                  </Button>
                )}
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <CardTitle className="text-lg">{post.title}</CardTitle>
                              <Badge 
                                variant={
                                  post.status === 'implemented' ? 'default' :
                                  post.status === 'reviewed' ? 'secondary' :
                                  post.status === 'rejected' ? 'destructive' : 'outline'
                                }
                                className="text-xs"
                              >
                                {post.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                                  <AvatarFallback className="text-xs">
                                    {post.author.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{post.author.name}</span>
                              </div>
                              <span>•</span>
                              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                            </div>
                          </div>
                          
                          {(user?.id === post.author.id || user?.role === 'admin') && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
                        
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Voting and Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-4">
                            {/* Voting */}
                            <div className="flex items-center space-x-2">
                              <Button
                                variant={post.votes.userVote === 'up' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleVote(post.id, 'up')}
                                className="flex items-center space-x-1"
                              >
                                <ThumbsUp className="w-4 h-4" />
                                <span>{post.votes.upvotes}</span>
                              </Button>
                              <Button
                                variant={post.votes.userVote === 'down' ? 'destructive' : 'outline'}
                                size="sm"
                                onClick={() => handleVote(post.id, 'down')}
                                className="flex items-center space-x-1"
                              >
                                <ThumbsDown className="w-4 h-4" />
                                <span>{post.votes.downvotes}</span>
                              </Button>
                            </div>

                            {/* Comments */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsCommenting(isCommenting === post.id ? null : post.id)}
                              className="flex items-center space-x-1"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>{post.comments.length}</span>
                            </Button>
                          </div>

                          <div className="text-xs text-gray-500">
                            Score: {post.votes.upvotes - post.votes.downvotes}
                          </div>
                        </div>

                        {/* Comments Section */}
                        {post.comments.length > 0 && (
                          <div className="space-y-3 pt-4 border-t">
                            <h4 className="font-medium text-sm">Comments ({post.comments.length})</h4>
                            {post.comments.map((comment) => (
                              <div key={comment.id} className="flex space-x-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                                  <AvatarFallback className="text-xs">
                                    {comment.author.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-sm">{comment.author.name}</span>
                                    <span className="text-xs text-gray-500">
                                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Comment Input */}
                        {isCommenting === post.id && (
                          <div className="flex space-x-2 pt-4 border-t">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user?.avatar} alt={user?.name} />
                              <AvatarFallback className="text-xs">
                                {user?.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex space-x-2">
                              <Input
                                placeholder="Add a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleCreateComment(post.id)}
                              />
                              <Button 
                                size="sm" 
                                onClick={() => handleCreateComment(post.id)}
                                disabled={!commentText.trim()}
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}