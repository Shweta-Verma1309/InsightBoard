'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useBoardStore } from '@/store/boardStore';
import { boardService } from '@/services/boardService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  Plus, 
  X, 
  ArrowLeft,
  Globe,
  Lock,
  Tag,
  Users,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function CreateBoardPage() {
  const { user } = useAuthStore();
  const { addBoard } = useBoardStore();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublic: true,
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVisibilityChange = (isPublic: boolean) => {
    setFormData(prev => ({
      ...prev,
      isPublic
    }));
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setTags(prev => [...prev, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Board title is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Board description is required');
      return;
    }

    setIsLoading(true);

    try {
      // Mock board creation
      const newBoard = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        tags,
        createdBy: user?.id || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: formData.isPublic,
        members: [user?.id || '']
      };

      // In a real app, you would call: await boardService.createBoard(boardData)
      const createdBoard = await boardService.createBoard({
      title: formData.title.trim(),
      description: formData.description.trim(),
      tags,
      isPublic: formData.isPublic,
      createdBy: user?.id || '',
    });
    addBoard(createdBoard);

    toast.success('Board created successfully!');
    router.push("/boards");
    //   router.push(`/boards/${newBoard.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create board');
      toast.error(err.message || 'Failed to create board');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedTags = [
    'product', 'features', 'ui/ux', 'bugs', 'feedback', 
    'marketing', 'team', 'retrospective', 'ideas', 'improvement'
  ];

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            <Link href="/boards">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Boards
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create New Board
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Set up a new insight board for your team to collaborate
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                  Board Details
                </CardTitle>
                <CardDescription>
                  Provide information about your new insight board
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Board Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Product Feedback, Team Retrospective"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="h-11"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe the purpose of this board and what kind of feedback you're looking for..."
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-3">
                    <Label>Tags</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleTagInputKeyPress}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        disabled={!tagInput.trim() || tags.length >= 10}
                        size="sm"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Current Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                            <Tag className="w-3 h-3" />
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

                    {/* Suggested Tags */}
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Suggested tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedTags
                          .filter(tag => !tags.includes(tag))
                          .slice(0, 6)
                          .map((tag) => (
                            <Button
                              key={tag}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (tags.length < 10) {
                                  setTags(prev => [...prev, tag]);
                                }
                              }}
                              className="text-xs"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              {tag}
                            </Button>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Visibility */}
                  <div className="space-y-3">
                    <Label>Board Visibility</Label>
                    <div className="space-y-3">
                      <div 
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.isPublic 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                        onClick={() => handleVisibilityChange(true)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Globe className="w-5 h-5 text-green-600" />
                            <div>
                              <h3 className="font-medium">Public Board</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Anyone can view and contribute to this board
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={formData.isPublic}
                            onCheckedChange={() => handleVisibilityChange(true)}
                          />
                        </div>
                      </div>

                      <div 
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          !formData.isPublic 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                        onClick={() => handleVisibilityChange(false)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Lock className="w-5 h-5 text-gray-600" />
                            <div>
                              <h3 className="font-medium">Private Board</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Only invited members can access this board
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={!formData.isPublic}
                            onCheckedChange={() => handleVisibilityChange(false)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Submit */}
                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Board...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Create Board
                        </>
                      )}
                    </Button>
                    <Link href="/boards">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
              <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
                <CardDescription>
                  This is how your board will appear to others
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">
                          {formData.title || 'Board Title'}
                        </h3>
                        {formData.isPublic ? (
                          <Globe className="w-4 h-4 text-green-600" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formData.description || 'Board description will appear here...'}
                      </p>
                    </div>
                  </div>
                  
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        1 member
                      </div>
                      <span>Created by {user?.name}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}