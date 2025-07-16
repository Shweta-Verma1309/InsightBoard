import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Users, MessageSquare, TrendingUp, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Boards = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBoard, setNewBoard] = useState({
    name: "",
    description: "",
    visibility: "public",
    category: "",
  });
  const { toast } = useToast();

  const boards = [
    {
      id: 1,
      name: "Product Roadmap 2024",
      description: "Strategic planning for our product development",
      posts: 23,
      participants: 8,
      category: "Product",
      visibility: "public",
      trending: true,
      lastActivity: "2 hours ago",
      owner: "Sarah Johnson",
      tags: ["roadmap", "strategy", "product"],
    },
    {
      id: 2,
      name: "UI/UX Improvements",
      description: "Collecting feedback on user experience enhancements",
      posts: 15,
      participants: 12,
      category: "Design",
      visibility: "private",
      trending: false,
      lastActivity: "1 day ago",
      owner: "Mike Chen",
      tags: ["ui", "ux", "design"],
    },
    {
      id: 3,
      name: "Marketing Strategy",
      description: "Brainstorming marketing campaigns and initiatives",
      posts: 31,
      participants: 6,
      category: "Marketing",
      visibility: "public",
      trending: true,
      lastActivity: "30 minutes ago",
      owner: "Lisa Rodriguez",
      tags: ["marketing", "campaigns", "growth"],
    },
    {
      id: 4,
      name: "Tech Stack Updates",
      description: "Evaluating new technologies and frameworks",
      posts: 18,
      participants: 15,
      category: "Engineering",
      visibility: "public",
      trending: false,
      lastActivity: "3 hours ago",
      owner: "David Kim",
      tags: ["tech", "development", "innovation"],
    },
  ];

  const filteredBoards = boards.filter(board => {
    const matchesSearch = board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         board.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         board.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterBy === "all") return matchesSearch;
    if (filterBy === "trending") return matchesSearch && board.trending;
    if (filterBy === "recent") return matchesSearch;
    return matchesSearch && board.category.toLowerCase() === filterBy.toLowerCase();
  });

  const handleCreateBoard = () => {
    if (!newBoard.name.trim()) {
      toast({
        title: "Error",
        description: "Board name is required",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Board Created",
      description: `"${newBoard.name}" has been created successfully!`,
    });

    setNewBoard({ name: "", description: "", visibility: "public", category: "" });
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Insight Boards</h1>
              <p className="text-muted-foreground">Manage and explore collaboration boards</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Board
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Board</DialogTitle>
                  <DialogDescription>
                    Start a new insight board for your team to collaborate on.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="boardName">Board Name</Label>
                    <Input
                      id="boardName"
                      placeholder="Enter board name"
                      value={newBoard.name}
                      onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="boardDescription">Description</Label>
                    <Textarea
                      id="boardDescription"
                      placeholder="Describe what this board is for"
                      value={newBoard.description}
                      onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={newBoard.category} onValueChange={(value) => setNewBoard({ ...newBoard, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visibility">Visibility</Label>
                      <Select value={newBoard.visibility} onValueChange={(value) => setNewBoard({ ...newBoard, visibility: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateBoard}>Create Board</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search boards, descriptions, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Boards</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="recent">Recently Active</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBoards.map((board) => (
            <Link key={board.id} to={`/boards/${board.id}`}>
              <Card className="hover:shadow-lg transition-all duration-200 hover:border-primary/20 cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg">{board.name}</CardTitle>
                        {board.trending && <Badge variant="secondary" className="text-xs">Trending</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{board.description}</p>
                    </div>
                    <Badge variant={board.visibility === "public" ? "default" : "secondary"} className="ml-2">
                      {board.visibility}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span>{board.posts}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{board.participants}</span>
                        </div>
                      </div>
                      {board.trending && (
                        <div className="flex items-center space-x-1 text-primary">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-xs">Hot</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {board.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {board.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{board.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Owner and Last Activity */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="" />
                          <AvatarFallback className="text-xs">
                            {board.owner.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{board.owner}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{board.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredBoards.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No boards found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Create your first board to get started"}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Board
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Boards;