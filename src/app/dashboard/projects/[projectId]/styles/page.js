// src\app\dashboard\projects\[projectId]\styles\page.js
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Search, Filter, Heart, Eye, Palette, Star, Users, TrendingUp, Grid3X3, List, ArrowRight, Sparkles, CreditCard, X, CheckCircle, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import NextStepCard from '@/components/ui/NextStepCard'

const StylesPage = () => {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRoom, setSelectedRoom] = useState('all')
  const [sortBy, setSortBy] = useState('popularity')
  const [viewMode, setViewMode] = useState('grid')
  const [favorites, setFavorites] = useState(new Set([1, 5, 8]))
  const [selectedStyles, setSelectedStyles] = useState(new Set([2, 6]))
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const styleCategories = [
    { id: 'all', name: 'All Styles', count: 24 },
    { id: 'MODERN', name: 'Modern', count: 8 },
    { id: 'CONTEMPORARY', name: 'Contemporary', count: 6 },
    { id: 'TRADITIONAL', name: 'Traditional', count: 4 },
    { id: 'MINIMALIST', name: 'Minimalist', count: 6 },
    { id: 'INDUSTRIAL', name: 'Industrial', count: 3 },
    { id: 'SCANDINAVIAN', name: 'Scandinavian', count: 5 },
    { id: 'BOHEMIAN', name: 'Bohemian', count: 4 },
    { id: 'COASTAL', name: 'Coastal', count: 3 },
    { id: 'FARMHOUSE', name: 'Farmhouse', count: 4 },
    { id: 'MID_CENTURY', name: 'Mid-Century', count: 3 }
  ]

  const roomTypes = [
    { id: 'all', name: 'All Rooms', count: 24 },
    { id: 'LIVING_ROOM', name: 'Living Room', count: 12 },
    { id: 'BEDROOM', name: 'Bedroom', count: 8 },
    { id: 'MASTER_BEDROOM', name: 'Master Bedroom', count: 6 },
    { id: 'KITCHEN', name: 'Kitchen', count: 6 },
    { id: 'BATHROOM', name: 'Bathroom', count: 4 },
    { id: 'DINING_ROOM', name: 'Dining Room', count: 3 },
    { id: 'STUDY_ROOM', name: 'Study Room', count: 2 }
  ]

  const sortOptions = [
    { id: 'popularity', name: 'Most Popular' },
    { id: 'newest', name: 'Newest First' },
    { id: 'name', name: 'Alphabetical' },
    { id: 'projects', name: 'Most Used' }
  ]

  const styles = [
    {
      id: 1,
      publicId: 'style-001',
      name: 'Modern Minimalist',
      description: 'Clean lines, neutral colors, and functional furniture with a focus on simplicity and elegance.',
      imageUrl: '/styles/interior1.jpg',
      thumbnailUrl: '/api/placeholder/150/100',
      category: 'MODERN',
      roomType: 'LIVING_ROOM',
      tags: ['Clean', 'Simple', 'Functional', 'Elegant', 'Neutral'],
      popularity: 95,
      projectCount: 142,
      isActive: true,
      sortOrder: 1,
      colorPalette: ['#FFFFFF', '#F5F5F5', '#2C3E50', '#E74C3C'],
      materials: ['Glass', 'Steel', 'Light Wood', 'Concrete'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      // isFeatured: true,
      styleCharacteristics: ['Minimal Decor', 'Open Spaces', 'Natural Light', 'Geometric Shapes']
    },
    {
      id: 2,
      publicId: 'style-002',
      name: 'Contemporary Luxury',
      description: 'Sophisticated elegance with premium materials and bespoke furniture pieces.',
      imageUrl: '/styles/interior2.jpg',
      thumbnailUrl: '/api/placeholder/150/100',
      category: 'CONTEMPORARY',
      roomType: 'MASTER_BEDROOM',
      tags: ['Luxury', 'Elegant', 'Premium', 'Sophisticated', 'Bespoke'],
      popularity: 88,
      projectCount: 98,
      isActive: true,
      sortOrder: 2,
      colorPalette: ['#2C3E50', '#ECF0F1', '#E67E22', '#16A085'],
      materials: ['Marble', 'Brass', 'Velvet', 'Dark Wood'],
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-14T00:00:00Z',
      // isFeatured: true,
      styleCharacteristics: ['High-end Finishes', 'Statement Lighting', 'Art Pieces', 'Layered Textures']
    },
    {
      id: 3,
      publicId: 'style-003',
      name: 'Traditional Comfort',
      description: 'Warm tones, classic furniture pieces, and timeless elegance for cozy living.',
      imageUrl: '/styles/interior3.jpg',
      thumbnailUrl: '/api/placeholder/150/100',
      category: 'TRADITIONAL',
      roomType: 'LIVING_ROOM',
      tags: ['Warm', 'Classic', 'Comfortable', 'Timeless', 'Elegant'],
      popularity: 76,
      projectCount: 67,
      isActive: true,
      sortOrder: 3,
      colorPalette: ['#8B4513', '#F5DEB3', '#556B2F', '#CD853F'],
      materials: ['Wood', 'Leather', 'Brass', 'Wool'],
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-13T00:00:00Z',
      // isFeatured: false,
      styleCharacteristics: ['Rich Woods', 'Classic Patterns', 'Warm Lighting', 'Antique Pieces']
    },
    {
      id: 4,
      publicId: 'style-004',
      name: 'Industrial Chic',
      description: 'Raw materials, exposed structures, and urban aesthetics with modern comfort.',
      imageUrl: '/styles/interior4.jpg',
      thumbnailUrl: '/api/placeholder/150/100',
      category: 'INDUSTRIAL',
      roomType: 'KITCHEN',
      tags: ['Urban', 'Raw', 'Edgy', 'Modern', 'Urban'],
      popularity: 82,
      projectCount: 54,
      isActive: true,
      sortOrder: 4,
      colorPalette: ['#2F4F4F', '#696969', '#DAA520', '#F5F5F5'],
      materials: ['Brick', 'Concrete', 'Metal', 'Reclaimed Wood'],
      createdAt: '2024-01-04T00:00:00Z',
      updatedAt: '2024-01-12T00:00:00Z',
      // isFeatured: true,
      styleCharacteristics: ['Exposed Elements', 'Open Layout', 'Vintage Pieces', 'Mixed Materials']
    },
    {
      id: 5,
      publicId: 'style-005',
      name: 'Scandinavian Style',
      description: 'Light woods, cozy textures, and functional design with a focus on hygge.',
      imageUrl: '/styles/interior5.jpg',
      thumbnailUrl: '/api/placeholder/150/100',
      category: 'SCANDINAVIAN',
      roomType: 'BEDROOM',
      tags: ['Cozy', 'Natural', 'Light', 'Functional', 'Hygge'],
      popularity: 91,
      projectCount: 113,
      isActive: true,
      sortOrder: 5,
      colorPalette: ['#FFFFFF', '#F0F8FF', '#2F4F4F', '#FFE4E1'],
      materials: ['Light Wood', 'Wool', 'Linen', 'Ceramic'],
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-11T00:00:00Z',
      // isFeatured: true,
      styleCharacteristics: ['Minimal Decor', 'Natural Light', 'Functional Furniture', 'Warm Textiles']
    },
    {
      id: 6,
      publicId: 'style-006',
      name: 'Bohemian Vibes',
      description: 'Eclectic mix of colors, patterns, and global influences for artistic spaces.',
      imageUrl: '/styles/interior6.jpg',
      thumbnailUrl: '/api/placeholder/150/100',
      category: 'BOHEMIAN',
      roomType: 'LIVING_ROOM',
      tags: ['Colorful', 'Eclectic', 'Artistic', 'Global', 'Patterned'],
      popularity: 73,
      projectCount: 45,
      isActive: true,
      sortOrder: 6,
      colorPalette: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C'],
      materials: ['Macrame', 'Rattan', 'Textiles', 'Plants'],
      createdAt: '2024-01-06T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z',
      // isFeatured: false,
      styleCharacteristics: ['Mixed Patterns', 'Plants', 'Vintage Finds', 'Personal Collections']
    },
    {
      id: 7,
      publicId: 'style-007',
      name: 'Coastal Retreat',
      description: 'Ocean-inspired colors, natural textures, and relaxed beachside living.',
      imageUrl: '/styles/interior7.jpg',
      thumbnailUrl: '/api/placeholder/150/100',
      category: 'COASTAL',
      roomType: 'BATHROOM',
      tags: ['Ocean', 'Natural', 'Relaxing', 'Beach', 'Airy'],
      popularity: 85,
      projectCount: 78,
      isActive: true,
      sortOrder: 7,
      colorPalette: ['#87CEEB', '#F0F8FF', '#2E8B57', '#FFD700'],
      materials: ['Driftwood', 'Seagrass', 'Cotton', 'Glass'],
      createdAt: '2024-01-07T00:00:00Z',
      updatedAt: '2024-01-09T00:00:00Z',
      // isFeatured: true,
      styleCharacteristics: ['Nautical Elements', 'Light Colors', 'Natural Fibers', 'Open Spaces']
    },
    {
      id: 8,
      publicId: 'style-008',
      name: 'Mid-Century Modern',
      description: 'Retro furniture, bold geometric patterns, and organic modernism.',
      imageUrl: '/styles/interior7.jpg',
      thumbnailUrl: '/api/placeholder/150/100',
      category: 'MID_CENTURY',
      roomType: 'DINING_ROOM',
      tags: ['Retro', 'Geometric', 'Bold', 'Organic', 'Modern'],
      popularity: 79,
      projectCount: 62,
      isActive: true,
      sortOrder: 8,
      colorPalette: ['#8B0000', '#FFD700', '#2F4F4F', '#F5F5F5'],
      materials: ['Teak', 'Plastic', 'Metal', 'Upholstery'],
      createdAt: '2024-01-08T00:00:00Z',
      updatedAt: '2024-01-08T00:00:00Z',
      // isFeatured: false,
      styleCharacteristics: ['Clean Lines', 'Organic Shapes', 'Bold Colors', 'Mixed Materials']
    }
  ]

  const toggleFavorite = (styleId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(styleId)) {
      newFavorites.delete(styleId)
    } else {
      newFavorites.add(styleId)
    }
    setFavorites(newFavorites)
  }

  const toggleSelection = (styleId) => {
    const newSelections = new Set(selectedStyles)
    if (newSelections.has(styleId)) {
      newSelections.delete(styleId)
    } else {
      newSelections.add(styleId)
    }
    setSelectedStyles(newSelections)
  }

  const handleGenerateRenders = () => {
    setShowPaymentModal(true)
  }

  const handlePayment = async () => {
    setIsProcessingPayment(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessingPayment(false)
    setShowPaymentModal(false)
    
    // Redirect to renders page after successful "payment"
    router.push(`/dashboard/projects/${projectId}/renders`)
  }

  const filteredStyles = styles.filter(style => {
    const matchesSearch = style.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         style.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         style.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || style.category === selectedCategory
    const matchesRoom = selectedRoom === 'all' || style.roomType === selectedRoom
    return matchesSearch && matchesCategory && matchesRoom
  })

  const sortedStyles = [...filteredStyles].sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.popularity - a.popularity
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'name':
        return a.name.localeCompare(b.name)
      case 'projects':
        return b.projectCount - a.projectCount
      default:
        return b.popularity - a.popularity
    }
  })

  const stats = {
    total: styles.length,
    // featured: styles.filter(s => s.isFeatured).length,
    favorites: favorites.size,
    selected: selectedStyles.size
  }

  const formatRoomType = (roomType) => {
    return roomType.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="space-y-6 p-6">
      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-foreground">
                <CreditCard className="h-5 w-5 text-primary" />
                Complete Payment to Generate Renders
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowPaymentModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription className="text-muted-foreground">
              Secure payment required to generate powered renders
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Project Summary */}
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">Order Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground"> Render Generation</span>
                  <span className="font-medium">₹20,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Selected Styles</span>
                  <span className="font-medium">{selectedStyles.size} styles</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-foreground font-semibold">Total Amount</span>
                  <span className="text-lg font-bold text-primary">₹20,000</span>
                </div>
              </div>
            </div>

            {/* Payment Features */}
            <div className="space-y-2">
              <h5 className="font-medium text-foreground">What you'll get:</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-primary" />
                  powered high-quality renders
                </li>
                <li className="flex items-center gap-2">
                  <Palette className="h-3 w-3 text-primary" />
                  Multiple style variations
                </li>
                <li className="flex items-center gap-2">
                  <Eye className="h-3 w-3 text-primary" />
                  Unlimited revisions for 7 days
                </li>
                <li className="flex items-center gap-2">
                  <CreditCard className="h-3 w-3 text-primary" />
                  Secure payment processing
                </li>
              </ul>
            </div>

            {/* Security Features */}
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-green-600" />
                <span>SSL Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-blue-600" />
                <span>Razorpay</span>
              </div>
            </div>

            {/* Payment Button */}
            <Button 
              onClick={handlePayment}
              disabled={isProcessingPayment}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12"
            >
              {isProcessingPayment ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay ₹20,000 & Generate Renders
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Secure payment powered by Razorpay • 100% satisfaction guarantee
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Design Styles</h1>
          <p className="text-muted-foreground">Discover and select the perfect interior design styles for your space.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" className="border-border hover:bg-accent">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-slate-600">Total Styles</p>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-slate-600">Featured</p>
            <p className="text-2xl font-bold text-blue-600">{stats.featured}</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-slate-600">My Favorites</p>
            <p className="text-2xl font-bold text-amber-600">{stats.favorites}</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-slate-600">Selected</p>
            <p className="text-2xl font-bold text-green-600">{stats.selected}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white shadow-sm border-slate-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search styles, tags, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-slate-300 focus:border-amber-500"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <Palette className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {styleCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Room Filter */}
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger>
                <Users className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by room" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name} ({room.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Options */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <TrendingUp className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* View Mode Toggle */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-slate-600">
          Showing {sortedStyles.length} of {styles.length} styles
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="border-slate-300"
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="border-slate-300"
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>
      </div>

      {/* Styles Grid */}
      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
        {sortedStyles.map((style) => (
          <Card key={style.id} className="bg-white shadow-sm border-slate-200 hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer">
            <div className="relative">
              <img
                src={style.imageUrl}
                alt={style.name}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge className="bg-slate-900/80 text-white border-0 shadow-sm">
                  {formatRoomType(style.roomType)}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(style.id)
                  }}
                >
                  <Heart 
                    className={`h-4 w-4 ${favorites.has(style.id) ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} 
                  />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                >
                  <Eye className="h-4 w-4 text-slate-600" />
                </Button>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                    {style.name}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mt-1">
                    {style.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {style.tags.slice(0, 3).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs border-slate-200 text-slate-600"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {style.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs border-slate-200 text-slate-500">
                      +{style.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Stats and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Users className="h-3 w-3" />
                    <span>{style.projectCount} projects</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant={selectedStyles.has(style.id) ? "default" : "outline"}
                    className={selectedStyles.has(style.id) 
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm" 
                      : "border-slate-300 hover:shadow-md"
                    }
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSelection(style.id)
                    }}
                  >
                    {selectedStyles.has(style.id) ? 'Selected' : 'Select Style'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {sortedStyles.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <Palette className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No styles found</h3>
          <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Updated NextStepCard with payment integration */}
      {/* <NextStepCard
        title="Ready to See Your Designs?"
        description="You've selected your preferred styles. Complete payment to generate powered renders."
        buttonText="Generate Renders"
        onButtonClick={handleGenerateRenders}
      /> */}
      {/* <button onClick={handleGenerateRenders}>next page</button> */}

        {/* Next Steps Card */}
          <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Ready to See Your Designs?
                  </h3>
                  <p className="text-slate-200">
                    You've selected your preferred styles. Complete payment to generate powered renders.
                  </p>
                </div>
                {/* <Link href={`/dashboard/projects/${projectId}/questionnaire`}> */}
                    <Button 
                    variant="secondary" 
                    size="lg"
                    className="bg-white text-slate-900 hover:bg-slate-100 transition-all duration-200 hover:scale-105"
                    onClick={handleGenerateRenders}
                    >
                    Generate Renders
                    <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                {/* </Link> */}
              </div>
            </CardContent>
          </Card>

    </div>
  )
}

export default StylesPage