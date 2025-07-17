import axiosClient from '@/lib/axiosClient';
import { Board, Post, Comment } from '@/store/boardStore';

interface CreateBoardData {
  title: string;
  description: string;
  tags: string[];
  isPublic: boolean;
}

interface CreatePostData {
  boardId: string;
  title: string;
  content: string;
  tags: string[];
}

interface CreateCommentData {
  postId: string;
  content: string;
}

export const boardService = {
  // Board CRUD
  async getBoards(): Promise<Board[]> {
    try {
      const response = await axiosClient.get('/boards');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch boards');
    }
  },

  async getBoardById(id: string): Promise<Board> {
    try {
      const response = await axiosClient.get(`/boards/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch board');
    }
  },

  async createBoard(boardData: CreateBoardData): Promise<Board> {
    try {
      const response = await axiosClient.post('/boards', boardData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create board');
    }
  },

  async updateBoard(id: string, boardData: Partial<CreateBoardData>): Promise<Board> {
    try {
      const response = await axiosClient.put(`/boards/${id}`, boardData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update board');
    }
  },

  async deleteBoard(id: string): Promise<void> {
    try {
      await axiosClient.delete(`/boards/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete board');
    }
  },

  // Post CRUD
  async getPosts(boardId: string): Promise<Post[]> {
    try {
      const response = await axiosClient.get(`/boards/${boardId}/posts`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch posts');
    }
  },

  async createPost(postData: CreatePostData): Promise<Post> {
    try {
      const response = await axiosClient.post(`/boards/${postData.boardId}/posts`, postData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create post');
    }
  },

  async updatePost(postId: string, postData: Partial<CreatePostData>): Promise<Post> {
    try {
      const response = await axiosClient.put(`/posts/${postId}`, postData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update post');
    }
  },

  async deletePost(postId: string): Promise<void> {
    try {
      await axiosClient.delete(`/posts/${postId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete post');
    }
  },

  // Voting
  async votePost(postId: string, voteType: 'up' | 'down'): Promise<{ upvotes: number; downvotes: number; userVote: 'up' | 'down' | null }> {
    try {
      const response = await axiosClient.post(`/posts/${postId}/vote`, { voteType });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to vote');
    }
  },

  // Comments
  async getComments(postId: string): Promise<Comment[]> {
    try {
      const response = await axiosClient.get(`/posts/${postId}/comments`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch comments');
    }
  },

  async createComment(commentData: CreateCommentData): Promise<Comment> {
    try {
      const response = await axiosClient.post(`/posts/${commentData.postId}/comments`, commentData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create comment');
    }
  },

  async updateComment(commentId: string, content: string): Promise<Comment> {
    try {
      const response = await axiosClient.put(`/comments/${commentId}`, { content });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update comment');
    }
  },

  async deleteComment(commentId: string): Promise<void> {
    try {
      await axiosClient.delete(`/comments/${commentId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete comment');
    }
  },

  // Mock functions for demo
  async mockGetBoards(): Promise<Board[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: '1',
        title: 'Product Feedback',
        description: 'Share your ideas and feedback about our product features',
        tags: ['product', 'features', 'ui/ux'],
        createdBy: '1',
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: true,
        members: ['1', '2', '3']
      },
      {
        id: '2',
        title: 'Team Retrospective',
        description: 'Weekly team retrospective and improvement suggestions',
        tags: ['team', 'retrospective', 'process'],
        createdBy: '2',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: false,
        members: ['1', '2']
      },
      {
        id: '3',
        title: 'Marketing Ideas',
        description: 'Brainstorm marketing strategies and campaign ideas',
        tags: ['marketing', 'campaigns', 'growth'],
        createdBy: '1',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: true,
        members: ['1', '2', '3', '4']
      }
    ];
  },

  async mockGetPosts(boardId: string): Promise<Post[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: '1',
        boardId,
        title: 'Add Dark Mode Support',
        content: 'It would be great to have a dark mode option for better user experience during night time usage.',
        tags: ['ui/ux', 'feature-request'],
        author: {
          id: '2',
          name: 'Team Member',
          avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        votes: {
          upvotes: 15,
          downvotes: 2,
          userVote: 'up'
        },
        status: 'pending',
        comments: [
          {
            id: '1',
            postId: '1',
            content: 'Great idea! This would definitely improve accessibility.',
            author: {
              id: '1',
              name: 'Admin User',
              avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
            },
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            updatedAt: new Date(Date.now() - 3600000).toISOString()
          }
        ],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '2',
        boardId,
        title: 'Improve Search Functionality',
        content: 'The current search is quite basic. We need better filtering options and search by tags.',
        tags: ['search', 'improvement'],
        author: {
          id: '1',
          name: 'Admin User',
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        votes: {
          upvotes: 8,
          downvotes: 1,
          userVote: null
        },
        status: 'reviewed',
        comments: [],
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: '3',
        boardId,
        title: 'Mobile App Version',
        content: 'We should consider developing a mobile app for better accessibility on mobile devices.',
        tags: ['mobile', 'app', 'feature-request'],
        author: {
          id: '3',
          name: 'Designer',
          avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        votes: {
          upvotes: 22,
          downvotes: 3,
          userVote: 'up'
        },
        status: 'pending',
        comments: [
          {
            id: '2',
            postId: '3',
            content: 'This would be amazing! React Native could be a good choice.',
            author: {
              id: '2',
              name: 'Team Member',
              avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
            },
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            updatedAt: new Date(Date.now() - 7200000).toISOString()
          },
          {
            id: '3',
            postId: '3',
            content: 'We should also consider PWA as an alternative.',
            author: {
              id: '1',
              name: 'Admin User',
              avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
            },
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            updatedAt: new Date(Date.now() - 1800000).toISOString()
          }
        ],
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 1800000).toISOString()
      }
    ];
  }
};