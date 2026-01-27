// src\app\admin\styles\page.js
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Plus,
  Palette,
  Image,
  Tag,
  TrendingUp,
  X,
  ArrowUpDown,
  Grid3X3,
  List,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

// Mock data matching your user styles selection
const mockStyles = [
  {
    id: 1,
    name: "Scandinavian",
    description:
      "Simple, functional, and timeless design with light, natural elements and cozy comfort.",
    imageUrl: "/styles/interior1.jpg",
    category: "MODERN",
    tags: ["Minimal", "Natural", "Cozy", "Functional", "Light"],
    // popularity: 95,
    characteristics: [
      "Light & Neutral Palette",
      "Natural Materials",
      "Clean Lines",
      "Cozy Textures",
      "Connection to Nature",
    ],
    status: "ACTIVE",
    createdAt: new Date("2024-01-15"),
    featured: true,
  },
  {
    id: 2,
    name: "Modern",
    description:
      "Sleek, bold, and uncluttered design focusing on clean forms and open spaces.",
    imageUrl: "/styles/interior2.jpg",
    category: "MODERN",
    tags: ["Sleek", "Bold", "Clean", "Open", "Functional"],
    // popularity: 92,
    characteristics: [
      "Clean Lines & Minimalism",
      "Neutral Base with Accents",
      "Industrial Materials",
      "Open Spaces",
      "Functional Elegance",
    ],
    status: "ACTIVE",
    createdAt: new Date("2024-01-10"),
    featured: true,
  },
  {
    id: 3,
    name: "Minimalist",
    description:
      "Less is more - clarity, simplicity, and balance with essential elements only.",
    imageUrl: "/styles/interior3.jpg",
    category: "MODERN",
    tags: ["Simple", "Clean", "Decluttered", "Calm", "Essential"],
    // popularity: 88,
    characteristics: [
      "Neutral Palette",
      "Simplicity in Form",
      "Decluttered Spaces",
      "Light & Airy",
      "Quality Over Quantity",
    ],
    status: "ACTIVE",
    createdAt: new Date("2024-01-08"),
    featured: false,
  },
  {
    id: 4,
    name: "Japandi",
    description:
      "Fusion of Japanese simplicity and Scandinavian coziness - calm and intentional.",
    imageUrl: "/styles/interior4.jpg",
    category: "FUSION",
    tags: ["Calm", "Warm", "Intentional", "Natural", "Balanced"],
    // popularity: 85,
    characteristics: [
      "Neutral & Earthy Palette",
      "Natural Materials",
      "Clean Lines",
      "Function & Comfort",
      "Wabi-Sabi Aesthetic",
    ],
    status: "ACTIVE",
    createdAt: new Date("2024-01-05"),
    featured: true,
  },
  {
    id: 5,
    name: "Bohemian",
    description:
      "Free-spirited, eclectic design with layers of color, texture, and personality.",
    imageUrl: "/styles/interior5.jpg",
    category: "CLASSIC",
    tags: ["Eclectic", "Colorful", "Layered", "Artistic", "Personal"],
    // popularity: 82,
    characteristics: [
      "Rich & Layered Palette",
      "Mix of Textures",
      "Handcrafted Materials",
      "Eclectic Decor",
      "Relaxed Vibe",
    ],
    status: "ACTIVE",
    createdAt: new Date("2024-01-03"),
    featured: false,
  },
  {
    id: 6,
    name: "Contemporary",
    description:
      "Fresh, current design reflecting todays trends with clean forms and sophistication.",
    imageUrl: "/styles/interior6.jpg",
    category: "MODERN",
    tags: ["Fresh", "Dynamic", "Clean", "Sophisticated", "Adaptable"],
    // popularity: 90,
    characteristics: [
      "Neutral Base with Accents",
      "Clean Lines",
      "Mix of Materials",
      "Open Spaces",
      "Statement Pieces",
    ],
    status: "DRAFT",
    createdAt: new Date("2024-01-12"),
    featured: false,
  },
];

const categoryConfig = {
  MODERN: { label: "Modern", color: "bg-blue-100 text-blue-800" },
  FUSION: { label: "Fusion", color: "bg-purple-100 text-purple-800" },
  CLASSIC: { label: "Classic", color: "bg-amber-100 text-amber-800" },
  INDIAN: { label: "Indian", color: "bg-orange-100 text-orange-800" },
};

const statusConfig = {
  ACTIVE: { label: "Active", color: "bg-green-100 text-green-800" },
  DRAFT: { label: "Draft", color: "bg-yellow-100 text-yellow-800" },
  ARCHIVED: { label: "Archived", color: "bg-gray-100 text-gray-800" },
};

export default function AdminStylesPage() {
  const [styles, setStyles] = useState([]);
  const [filteredStyles, setFilteredStyles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStyles = async () => {
      setLoading(true);
      try {
        const response = await api.get("/styles/"); // call your helper API

        // Assuming response has a 'styles' field like { styles: [...] }
        setStyles(response.data.data.styles || []);
        setFilteredStyles(response.data.data.styles || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch styles");
      } finally {
        setLoading(false);
      }
    };

    fetchStyles();
  }, []);
  // Calculate stats
  const stats = {
    total: styles.length,
    active: styles.filter((s) => s.status === "ACTIVE").length,
    featured: styles.filter((s) => s.featured).length,
    modern: styles.filter((s) => s.category === "MODERN").length,
    fusion: styles.filter((s) => s.category === "FUSION").length,
    classic: styles.filter((s) => s.category === "CLASSIC").length,
  };

  // Filter and sort styles
  useEffect(() => {
    let filtered = styles;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (style) =>
          style.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          style.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          style.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((style) => style.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((style) => style.status === statusFilter);
    }

    // Sort
    // filtered = [...filtered].sort((a, b) => {
    //   switch (sortBy) {
    //     case 'popularity':
    //       return b.popularity - a.popularity;
    //     case 'name':
    //       return a.name.localeCompare(b.name);
    //     case 'newest':
    //       return new Date(b.createdAt) - new Date(a.createdAt);
    //     case 'oldest':
    //       return new Date(a.createdAt) - new Date(b.createdAt);
    //     default:
    //       return 0;
    //   }
    // });

    setFilteredStyles(filtered);
  }, [styles, searchQuery, categoryFilter, statusFilter, sortBy]);

  const handleToggleFeatured = (styleId) => {
    setStyles((prev) =>
      prev.map((style) =>
        style.id === styleId ? { ...style, featured: !style.featured } : style
      )
    );
  };

  const handleToggleStatus = (styleId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "DRAFT" : "ACTIVE";
    setStyles((prev) =>
      prev.map((style) =>
        style.id === styleId ? { ...style, status: newStatus } : style
      )
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
    // setSortBy('popularity');
  };

  const hasActiveFilters =
    searchQuery || categoryFilter !== "all" || statusFilter !== "all";
  sortBy !== "createdAt";

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  if (loading) return <p>Loading styles...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Design Styles</h1>
          <p className="text-muted-foreground mt-1">
            Manage design styles available for user selection
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/styles/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Style
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Styles</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.total}
                </p>
              </div>
              <Palette className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.active}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">Live</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Featured</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.featured}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Modern</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.modern}
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">M</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-1 gap-4 items-center w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial sm:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search styles, tags, descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-border"
                  />
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-border"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 flex h-2 w-2 rounded-full bg-primary" />
                  )}
                </Button>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                >
                  {/* <option value="popularity">Popularity</option> */}
                  <option value="name">Name A-Z</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>

                {/* View Mode */}
                <div className="flex gap-1 bg-muted p-1 rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg border border-border">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="all">All Categories</option>
                    <option value="MODERN">Modern</option>
                    <option value="FUSION">Fusion</option>
                    <option value="CLASSIC">Classic</option>
                    <option value="INDIAN">Indian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Styles Grid/List */}
      {filteredStyles.length === 0 ? (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <Palette className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No styles found
            </h3>
            <p className="text-muted-foreground mb-4">
              {hasActiveFilters
                ? "No styles match your current filters."
                : "No design styles have been added yet."}
            </p>
            <Link href="/admin/styles/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Style
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStyles.map((style) => (
            <StyleCard
              key={style.id}
              style={style}
              onToggleFeatured={handleToggleFeatured}
              onToggleStatus={handleToggleStatus}
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStyles.map((style) => (
            <StyleCard
              key={style.id}
              style={style}
              onToggleFeatured={handleToggleFeatured}
              onToggleStatus={handleToggleStatus}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

 const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Style Card Component
const StyleCard = ({ style, onToggleFeatured, onToggleStatus, viewMode }) => {
  const categoryInfo = categoryConfig[style.category] || {
    label: style.category,
    color: "bg-gray-100 text-gray-800",
  };
  const statusInfo = statusConfig[style.status] || {
    label: style.status,
    color: "bg-gray-100 text-gray-800",
  };
  if (viewMode === "grid") {
  return (
    <Card className="border-border hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-0">
        {/* Image - Direct display without thumbnail */}
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            // src={style.imageUrl}
            src={`${SERVER_URL}${style.imageUrl}`}
            alt={style.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={categoryInfo.color}>{categoryInfo.label}</Badge>
            {style.featured && (
              <Badge className="bg-amber-100 text-amber-800">Featured</Badge>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-foreground text-lg group-hover:text-blue-600 transition-colors">
              {style.name}
            </h3>
          </div>

          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {style.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {style.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {style.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{style.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Characteristics */}
          <div className="space-y-1 mb-4">
            {style.characteristics.slice(0, 2).map((char, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                <span className="line-clamp-1">{char}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground">
              Added {formatDate(style.createdAt)}
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/styles/edit/${style.id}`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              </Link>
              {/* <Button
                variant={style.featured ? "default" : "outline"}
                size="sm"
                onClick={() => onToggleFeatured(style.id)}
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                {style.featured ? "Featured" : "Feature"}
              </Button> */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

  // List View
  return (
    <Card className="border-border hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Image */}
          <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
            <img
              src={style.imageUrl}
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/600x400?text=Fail%20to%20Load";
              }}
              alt={style.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-foreground text-lg mb-1">
                  {style.name}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {style.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                {style.featured && (
                  <Badge className="bg-amber-100 text-amber-800">
                    Featured
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-2">
              <Badge className={categoryInfo.color}>{categoryInfo.label}</Badge>
              {/* <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                <span>{style.popularity}% Popular</span>
              </div> */}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-2">
              {style.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Characteristics */}
            <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground mb-3">
              {style.characteristics.slice(0, 4).map((char, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                  <span className="line-clamp-1">{char}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Added {formatDate(style.createdAt)}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleStatus(style.id, style.status)}
                >
                  {style.status === "ACTIVE" ? "Deactivate" : "Activate"}
                </Button>
                <Link href={`/admin/styles/edit/${style.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant={style.featured ? "default" : "outline"}
                  size="sm"
                  onClick={() => onToggleFeatured(style.id)}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {style.featured ? "Featured" : "Feature"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
