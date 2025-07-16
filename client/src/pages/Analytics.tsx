import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Activity, 
  Calendar,
  Star,
  Tag,
  Clock,
  Target
} from "lucide-react";

const Analytics = () => {
  const stats = {
    totalUsers: 156,
    activeUsers: 89,
    totalPosts: 342,
    totalVotes: 1247,
    avgEngagement: 85,
    boardsCreated: 23,
  };

  const topUsers = [
    { id: 1, name: "Sarah Johnson", posts: 23, votes: 145, engagement: 95, role: "Product Manager" },
    { id: 2, name: "Mike Chen", posts: 19, votes: 128, engagement: 87, role: "Designer" },
    { id: 3, name: "Lisa Rodriguez", posts: 17, votes: 112, engagement: 82, role: "Developer" },
    { id: 4, name: "David Kim", posts: 15, votes: 98, engagement: 78, role: "Marketing" },
    { id: 5, name: "Emily Davis", posts: 12, votes: 87, engagement: 74, role: "QA Engineer" },
  ];

  const topPosts = [
    {
      id: 1,
      title: "Dark mode implementation",
      author: "Mike Chen",
      votes: 42,
      comments: 18,
      board: "Product Roadmap",
      category: "Feature",
      createdAt: "2 days ago",
    },
    {
      id: 2,
      title: "Mobile app performance optimization",
      author: "Lisa Rodriguez",
      votes: 38,
      comments: 15,
      board: "Tech Improvements",
      category: "Enhancement",
      createdAt: "1 week ago",
    },
    {
      id: 3,
      title: "Better search filters",
      author: "Sarah Johnson",
      votes: 35,
      comments: 12,
      board: "UX Research",
      category: "Feature",
      createdAt: "3 days ago",
    },
    {
      id: 4,
      title: "Real-time notifications",
      author: "David Kim",
      votes: 29,
      comments: 9,
      board: "Product Roadmap",
      category: "Feature",
      createdAt: "5 days ago",
    },
    {
      id: 5,
      title: "API rate limiting improvements",
      author: "Emily Davis",
      votes: 24,
      comments: 7,
      board: "Tech Improvements",
      category: "Bug",
      createdAt: "1 week ago",
    },
  ];

  const trendingTags = [
    { tag: "ui-improvement", count: 45, growth: "+12%" },
    { tag: "performance", count: 38, growth: "+8%" },
    { tag: "mobile", count: 32, growth: "+15%" },
    { tag: "accessibility", count: 28, growth: "+5%" },
    { tag: "api", count: 24, growth: "+20%" },
    { tag: "security", count: 21, growth: "+3%" },
    { tag: "search", count: 19, growth: "+7%" },
    { tag: "notifications", count: 16, growth: "+25%" },
  ];

  const recentActivity = [
    { type: "post", user: "Sarah Johnson", action: "created a new post", target: "Dark mode toggle", time: "2 hours ago" },
    { type: "vote", user: "Mike Chen", action: "upvoted", target: "Mobile optimization", time: "3 hours ago" },
    { type: "comment", user: "Lisa Rodriguez", action: "commented on", target: "API improvements", time: "4 hours ago" },
    { type: "board", user: "David Kim", action: "created board", target: "Q1 Planning", time: "1 day ago" },
    { type: "vote", user: "Emily Davis", action: "upvoted", target: "Search filters", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Insights into your InsightBoard usage and engagement</p>
            </div>
            <div className="flex items-center space-x-2">
              <Select defaultValue="30days">
                <SelectTrigger className="w-40">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="1year">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.activeUsers}</p>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalPosts}</p>
                  <p className="text-sm text-muted-foreground">Total Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <ThumbsUp className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalVotes}</p>
                  <p className="text-sm text-muted-foreground">Total Votes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.avgEngagement}%</p>
                  <p className="text-sm text-muted-foreground">Engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.boardsCreated}</p>
                  <p className="text-sm text-muted-foreground">Boards Created</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Top Users</TabsTrigger>
            <TabsTrigger value="content">Top Content</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Most Active Users */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span>Most Active Users</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topUsers.slice(0, 5).map((user, index) => (
                      <div key={user.id} className="flex items-center space-x-4">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {index + 1}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">{user.posts} posts</p>
                          <p className="text-sm text-muted-foreground">{user.votes} votes</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span>{" "}
                            <span className="text-muted-foreground">{activity.action}</span>{" "}
                            <span className="font-medium">"{activity.target}"</span>
                          </p>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topUsers.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold">
                          {index + 1}
                        </div>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-foreground">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-center">
                        <div>
                          <p className="text-2xl font-bold text-foreground">{user.posts}</p>
                          <p className="text-xs text-muted-foreground">Posts</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{user.votes}</p>
                          <p className="text-xs text-muted-foreground">Votes</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{user.engagement}%</p>
                          <p className="text-xs text-muted-foreground">Engagement</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Voted Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPosts.map((post, index) => (
                    <div key={post.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{post.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-sm text-muted-foreground">by {post.author}</p>
                            <Badge variant="outline" className="text-xs">{post.category}</Badge>
                            <span className="text-sm text-muted-foreground">in {post.board}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-center">
                        <div>
                          <p className="text-xl font-bold text-foreground">{post.votes}</p>
                          <p className="text-xs text-muted-foreground">Votes</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-foreground">{post.comments}</p>
                          <p className="text-xs text-muted-foreground">Comments</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {post.createdAt}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tag className="h-5 w-5" />
                  <span>Trending Tags</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trendingTags.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary">#{item.tag}</Badge>
                        <span className="text-sm text-muted-foreground">{item.count} posts</span>
                      </div>
                      <Badge variant="outline" className="text-green-600">
                        {item.growth}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;