'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Image, 
  Download, 
  ZoomIn,
  CheckCircle2,
  ArrowLeft,
  Filter,
  X,
  Share2,
  Building,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { renderService } from '@/services/render.service';
import { projectService } from '@/services/project.service';
import { toast } from 'sonner';

const roomTypeLabels = {
  LIVING_ROOM: 'Living Room',
  BEDROOM: 'Bedroom', 
  MASTER_BEDROOM: 'Master Bedroom',
  KITCHEN: 'Kitchen',
  BATHROOM: 'Bathroom',
  DINING_ROOM: 'Dining Room',
  STUDY_ROOM: 'Study Room',
  BALCONY: 'Balcony',
  OTHER: 'Other'
};

export default function ProjectRendersPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId;
  
  const [renders, setRenders] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load project details
      const projectResult = await projectService.getProject(projectId);
      if (projectResult.success) {
        setProject(projectResult.data.project);
      }

      // Load renders for this project
      const rendersResult = await renderService.getRendersByProject(projectId);
      
      if (rendersResult.success) {
        setRenders(rendersResult.data.renders || []);
        
        // Clear render notifications for this project
        const currentRenders = JSON.parse(localStorage.getItem('new_renders') || '[]');
        const updatedRenders = currentRenders.filter(render => render.projectId !== projectId);
        localStorage.setItem('new_renders', JSON.stringify(updatedRenders));
        localStorage.setItem('new_renders_count', updatedRenders.length.toString());
      } else {
        toast.error(rendersResult.message || 'Failed to load renders');
        setRenders([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
      setRenders([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRenders = filter === 'all' 
    ? renders 
    : renders.filter(render => render.roomType === filter);

  const roomTypes = [...new Set(renders.map(render => render.roomType))];

  const handleDownload = async (renderId, renderName) => {
    try {
      const blob = await renderService.downloadRender(renderId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${renderName}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Downloaded "${renderName}"`);
    } catch (error) {
      toast.error('Failed to download render');
    }
  };

  const handleShareProject = () => {
    const shareUrl = `${window.location.origin}/share/renders/${projectId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Project link copied to clipboard!');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <ProjectRendersSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/renders">
              <Button variant="outline" size="sm" className="border-border">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Renders
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {project?.title || 'Project Renders'}
              </h1>
              <p className="text-muted-foreground text-lg">3D Design Renders</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={handleShareProject}
              className="border-border"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Project Info Card */}
        {project && (
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Project Type</div>
                  <div className="font-semibold text-foreground capitalize">
                    {project.projectType?.toLowerCase().replace('_', ' ') || 'Residential'}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Area</div>
                  <div className="font-semibold text-foreground">
                    {project.areaSqFt ? `${project.areaSqFt} sq ft` : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total Renders</div>
                  <div className="font-semibold text-foreground">{renders.length} images</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Last Updated</div>
                  <div className="font-semibold text-foreground">
                    {formatDate(project.updatedAt)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Filter by room:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All Rooms
                </Button>
                {roomTypes.map(roomType => (
                  <Button
                    key={roomType}
                    variant={filter === roomType ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(roomType)}
                  >
                    {roomTypeLabels[roomType]}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Renders Grid */}
        {filteredRenders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRenders.map((render) => (
              <RenderDetailCard 
                key={render.publicId} 
                render={render} 
                onDownload={handleDownload}
                onView={(render) => setSelectedImage(render)}
              />
            ))}
          </div>
        ) : (
          <Card className="border-border bg-card">
            <CardContent className="p-12 text-center">
              <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Renders Available</h3>
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? "No renders found for this project." 
                  : `No ${roomTypeLabels[filter]} renders found.`
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl max-h-full">
            <img
              src={selectedImage.imageUrl}
              alt={`${roomTypeLabels[selectedImage.roomType]} - ${selectedImage.angle || 'View'}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg">
              <div className="font-semibold">{roomTypeLabels[selectedImage.roomType]}</div>
              <div className="text-sm opacity-90">{selectedImage.angle || 'Main View'}</div>
              {selectedImage.styleApplied && (
                <div className="text-xs opacity-75">{selectedImage.styleApplied}</div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
              <Button
                variant="secondary"
                onClick={() => handleDownload(selectedImage.publicId, 
                  `${roomTypeLabels[selectedImage.roomType]}_${selectedImage.angle || 'view'}`)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Render Detail Card Component
function RenderDetailCard({ render, onDownload, onView }) {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border bg-card">
      <CardContent className="p-0">
        <div className="relative aspect-video overflow-hidden rounded-t-lg cursor-zoom-in">
          {imageLoading && (
            <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
              <Image className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          <img
            src={render.imageUrl || render.thumbnailUrl}
            alt={`${roomTypeLabels[render.roomType]} - ${render.angle || 'View'}`}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            onClick={() => onView(render)}
          />
          
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-black/70 text-white text-xs">
              {roomTypeLabels[render.roomType]}
            </Badge>
            {render.isFinal && (
              <Badge className="bg-green-500 text-white text-xs">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Final
              </Badge>
            )}
          </div>
          
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white shadow-sm"
              onClick={() => onView(render)}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground capitalize">
              {render.angle?.toLowerCase() || 'main view'}
            </h3>
            <Badge variant="outline" className="text-xs">
              {render.styleApplied || 'Standard'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(render.createdAt).toLocaleDateString()}</span>
            </div>
            {render.fileSize && (
              <span>{render.fileSize}</span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 text-xs"
              onClick={() => onView(render)}
            >
              <ZoomIn className="w-3 h-3 mr-1" />
              View
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs"
              onClick={() => onDownload(render.publicId, 
                `${roomTypeLabels[render.roomType]}_${render.angle || 'view'}`)}
            >
              <Download className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton Loader
function ProjectRendersSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-32 bg-muted" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 bg-muted" />
              <Skeleton className="h-4 w-48 bg-muted" />
            </div>
          </div>
          <Skeleton className="h-10 w-24 bg-muted" />
        </div>
        
        <Skeleton className="h-20 w-full bg-muted rounded-lg" />
        <Skeleton className="h-16 w-full bg-muted rounded-lg" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-border bg-card">
              <Skeleton className="aspect-video bg-muted rounded-t-lg" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4 bg-muted" />
                <Skeleton className="h-3 w-1/2 bg-muted" />
                <Skeleton className="h-8 w-full bg-muted mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}