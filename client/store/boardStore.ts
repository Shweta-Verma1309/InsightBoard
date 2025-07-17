import { create } from 'zustand';

export interface Board {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  members: string[];
}

export interface Post {
  id: string;
  boardId: string;
  title: string;
  content: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  votes: {
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down' | null;
  };
  status: 'pending' | 'reviewed' | 'implemented' | 'rejected';
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  posts: Post[];
  currentPost: Post | null;
  isLoading: boolean;
  searchQuery: string;
  filterStatus: string;
  sortBy: 'recent' | 'votes' | 'comments';
  
  // Actions
  setBoards: (boards: Board[]) => void;
  setCurrentBoard: (board: Board | null) => void;
  setPosts: (posts: Post[]) => void;
  setCurrentPost: (post: Post | null) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: string) => void;
  setSortBy: (sortBy: 'recent' | 'votes' | 'comments') => void;
  addPost: (post: Post) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  deletePost: (postId: string) => void;
  addComment: (postId: string, comment: Comment) => void;
  updateComment: (postId: string, commentId: string, content: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: [],
  currentBoard: null,
  posts: [],
  currentPost: null,
  isLoading: false,
  searchQuery: '',
  filterStatus: 'all',
  sortBy: 'recent',
  
  setBoards: (boards) => set({ boards }),
  setCurrentBoard: (board) => set({ currentBoard: board }),
  setPosts: (posts) => set({ posts }),
  setCurrentPost: (post) => set({ currentPost: post }),
  setLoading: (loading) => set({ isLoading: loading }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setSortBy: (sortBy) => set({ sortBy }),
  
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  
  updatePost: (postId, updates) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === postId ? { ...post, ...updates } : post
    )
  })),
  
  deletePost: (postId) => set((state) => ({
    posts: state.posts.filter(post => post.id !== postId)
  })),
  
  addComment: (postId, comment) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, comment] }
        : post
    )
  })),
  
  updateComment: (postId, commentId, content) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === postId 
        ? {
            ...post,
            comments: post.comments.map(comment =>
              comment.id === commentId
                ? { ...comment, content, updatedAt: new Date().toISOString() }
                : comment
            )
          }
        : post
    )
  })),
  
  deleteComment: (postId, commentId) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === postId 
        ? {
            ...post,
            comments: post.comments.filter(comment => comment.id !== commentId)
          }
        : post
    )
  })),
}));