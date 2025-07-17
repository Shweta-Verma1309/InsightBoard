import axiosClient from '@/lib/axiosClient';

export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalBoards: number;
  totalPosts: number;
  totalComments: number;
  topUsers: {
    id: string;
    name: string;
    avatar?: string;
    postsCount: number;
    commentsCount: number;
    votesReceived: number;
  }[];
  topPosts: {
    id: string;
    title: string;
    boardTitle: string;
    votes: number;
    comments: number;
    author: string;
  }[];
  trendingTags: {
    tag: string;
    count: number;
    growth: number;
  }[];
  activityData: {
    date: string;
    posts: number;
    comments: number;
    votes: number;
  }[];
}

export const analyticsService = {
  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const response = await axiosClient.get('/analytics');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch analytics');
    }
  },

  async getUserActivity(userId: string, period: '7d' | '30d' | '90d' = '30d'): Promise<any> {
    try {
      const response = await axiosClient.get(`/analytics/users/${userId}?period=${period}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user activity');
    }
  },

  async getBoardAnalytics(boardId: string): Promise<any> {
    try {
      const response = await axiosClient.get(`/analytics/boards/${boardId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch board analytics');
    }
  },

  // Mock function for demo
  async mockGetAnalytics(): Promise<AnalyticsData> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      totalUsers: 156,
      activeUsers: 89,
      totalBoards: 12,
      totalPosts: 234,
      totalComments: 567,
      topUsers: [
        {
          id: '1',
          name: 'Admin User',
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
          postsCount: 45,
          commentsCount: 123,
          votesReceived: 234
        },
        {
          id: '2',
          name: 'Team Member',
          avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
          postsCount: 32,
          commentsCount: 89,
          votesReceived: 187
        },
        {
          id: '3',
          name: 'Designer',
          avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
          postsCount: 28,
          commentsCount: 76,
          votesReceived: 156
        }
      ],
      topPosts: [
        {
          id: '3',
          title: 'Mobile App Version',
          boardTitle: 'Product Feedback',
          votes: 22,
          comments: 8,
          author: 'Designer'
        },
        {
          id: '1',
          title: 'Add Dark Mode Support',
          boardTitle: 'Product Feedback',
          votes: 15,
          comments: 5,
          author: 'Team Member'
        },
        {
          id: '2',
          title: 'Improve Search Functionality',
          boardTitle: 'Product Feedback',
          votes: 8,
          comments: 3,
          author: 'Admin User'
        }
      ],
      trendingTags: [
        { tag: 'feature-request', count: 45, growth: 23 },
        { tag: 'ui/ux', count: 32, growth: 18 },
        { tag: 'mobile', count: 28, growth: 45 },
        { tag: 'improvement', count: 24, growth: 12 },
        { tag: 'bug', count: 19, growth: -5 }
      ],
      activityData: [
        { date: '2024-01-01', posts: 12, comments: 34, votes: 56 },
        { date: '2024-01-02', posts: 15, comments: 42, votes: 67 },
        { date: '2024-01-03', posts: 18, comments: 38, votes: 72 },
        { date: '2024-01-04', posts: 22, comments: 45, votes: 89 },
        { date: '2024-01-05', posts: 19, comments: 41, votes: 78 },
        { date: '2024-01-06', posts: 25, comments: 52, votes: 94 },
        { date: '2024-01-07', posts: 28, comments: 48, votes: 102 }
      ]
    };
  }
};