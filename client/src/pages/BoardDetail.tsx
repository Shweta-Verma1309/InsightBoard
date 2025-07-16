import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Filter, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Share2, 
  MoreVertical,
  Clock,
  User,
  ArrowLeft,
  Star,
  Settings,
  Users,
  TrendingUp
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const BoardDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
  });

  // Mock data for the board
  const board = {
    id: parseInt(id || "1"),
    name: "Product Roadmap 2024",
    description: "Strategic planning for our product development and feature prioritization",
    posts: 23,
    participants: 8,
    category: "Product",
    visibility: "public",
    trending: true,
    owner: "Sarah Johnson",
    tags: ["roadmap", "strategy", "product"],
    members: [
      { id: 1, name: "Sarah Johnson", role: "Owner", avatar: "" },
      { id: 2, name: "Mike Chen", role: "Admin", avatar: "" },
      { id: 3, name: "Lisa Rodriguez", role: "Member", avatar: "" },
      { id: 4, name: "David Kim", role: "Member", avatar: "" },
    ]
  };

  const posts = [
    {
      id: 1,
      title: "Dark mode implementation",
      description: "Users are requesting a dark mode option for better usability during night hours. This would improve user experience and reduce eye strain.",
      author: "Mike Chen",
      authorRole: "Designer",
      createdAt: "2 hours ago",
      category: "Feature",
      priority: "high",
      status: "Under Review",
      votes: { up: 15, down: 2 },
      comments: 8,
      tags: ["ui", "accessibility", "user-experience"],
      hasVoted: false,
      voteType: null,
    },
    {
      id: 2,
      title: "Mobile app optimization",
      description: "Performance improvements needed for mobile devices, especially on older Android models. Load times are currently too slow.",
      author: "Lisa Rodriguez",
      authorRole: "Developer",
      createdAt: "1 day ago",
      category: "Bug",
      priority: "medium",
      status: "In Progress",
      votes: { up: 12, down: 1 },
      comments: 5,
      tags: ["mobile", "performance", "android"],
      hasVoted: true,
      voteType: "up",
    },
    {
      id: 3,
      title: "Advanced search filters",
      description: "Add more granular search options including date ranges, user filters, and content type filtering to improve content discovery.",
      author: "David Kim",
      authorRole: "Product Manager",
      createdAt: "3 days ago",
      category: "Enhancement",
      priority: "low",
      status: "Pending",
      votes: { up: 8, down: 0 },
      comments: 12,
      tags: ["search", "filters", "discovery"],
      hasVoted: false,
      voteType: null,
    },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterBy === "all") return matchesSearch;
    if (filterBy === "feature") return matchesSearch && post.category.toLowerCase() === "feature";
    if (filterBy === "bug") return matchesSearch && post.category.toLowerCase() === "bug";
    if (filterBy === "enhancement") return matchesSearch && post.category.toLowerCase() === "enhancement";
    return matchesSearch;
  });

  const handleCreatePost = () => {
    if (!newPost.title.trim()) {
      toast({
        title: "Error",
        description: "Post title is required",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Post Created",
      description: `"${newPost.title}" has been posted successfully!`,
    });

    setNewPost({ title: "", description: "", category: "", priority: "medium" });
    setIsCreatePostOpen(false);
  };

  const handleVote = (postId: number, voteType: 'up' | 'down') => {
    toast({
      title: "Vote Recorded",
      description: `Your ${voteType}vote has been recorded.`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under Review": return "default";
      case "In Progress": return "secondary";
      case "Pending": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/boards">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Boards
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-foreground">{board.name}</h1>
                  {board.trending && <Badge variant="secondary">Trending</Badge>}
                  <Badge variant={board.visibility === "public" ? "default" : "secondary"}>
                    {board.visibility}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{board.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Post</DialogTitle>
                    <DialogDescription>
                      Share your feedback or suggestion with the team.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="postTitle">Title</Label>
                      <Input
                        id="postTitle"
                        placeholder="Enter a clear, descriptive title"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postDescription">Description</Label>
                      <Textarea
                        id="postDescription"
                        placeholder="Provide details about your feedback or suggestion"
                        rows={4}
                        value={newPost.description}
                        onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="feature">Feature Request</SelectItem>
                            <SelectItem value="bug">Bug Report</SelectItem>
                            <SelectItem value="enhancement">Enhancement</SelectItem>
                            <SelectItem value="feedback">General Feedback</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={newPost.priority} onValueChange={(value) => setNewPost({ ...newPost, priority: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setIsCreatePostOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreatePost}>Create Post</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="posts" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                
                {/* Search and Filter Controls */}
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger className="w-32">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="feature">Features</SelectItem>
                      <SelectItem value="bug">Bugs</SelectItem>
                      <SelectItem value="enhancement">Enhancements</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Recent</SelectItem>
                      <SelectItem value="popular">Popular</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="posts" className="space-y-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{post.title}</h3>
                            <Badge variant={getPriorityColor(post.priority)}>{post.priority}</Badge>
                            <Badge variant={getStatusColor(post.status)}>{post.status}</Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">{post.description}</p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mb-4">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Post Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center space-x-4">
                          {/* Voting */}
                          <div className="flex items-center space-x-2">
                            <Button
                              variant={post.voteType === "up" ? "default" : "ghost"}
                              size="sm"
                              onClick={() => handleVote(post.id, "up")}
                              className="h-8"
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {post.votes.up}
                            </Button>
                            <Button
                              variant={post.voteType === "down" ? "destructive" : "ghost"}
                              size="sm"
                              onClick={() => handleVote(post.id, "down")}
                              className="h-8"
                            >
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              {post.votes.down}
                            </Button>
                          </div>

                          {/* Comments */}
                          <Button variant="ghost" size="sm" className="h-8">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {post.comments}
                          </Button>
                        </div>

                        {/* Author and Time */}
                        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="" />
                              <AvatarFallback className="text-xs">
                                {post.author.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span>{post.author}</span>
                            <Badge variant="outline" className="text-xs">{post.authorRole}</Badge>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{post.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredPosts.length === 0 && (
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No posts found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm ? "Try adjusting your search terms" : "Be the first to share your feedback"}
                    </p>
                    <Button onClick={() => setIsCreatePostOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Post
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analytics">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5" />
                        <span>Engagement Overview</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Total Votes:</span>
                          <span className="font-medium">45</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Comments:</span>
                          <span className="font-medium">25</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Members:</span>
                          <span className="font-medium">8</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Contributors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {board.members.slice(0, 3).map((member, index) => (
                          <div key={member.id} className="flex items-center space-x-3">
                            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-xs">
                              {index + 1}
                            </div>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="text-xs">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Board Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Board Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Posts</span>
                  <span className="font-medium">{board.posts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Members</span>
                  <span className="font-medium">{board.participants}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <Badge variant="secondary">{board.category}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Members
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Invite
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {board.members.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{member.name}</p>
                        <Badge variant="outline" className="text-xs">{member.role}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;