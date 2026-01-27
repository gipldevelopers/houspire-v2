'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, Trash2, Grid3X3, List, Search, Image, FileText, 
  Ruler, Box, File, RefreshCw, Loader2, AlertCircle 
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const fileTypeConfig = {
  image: { label: 'Image', color: 'bg-green-100', icon: Image },
  pdf: { label: 'PDF', color: 'bg-red-100', icon: FileText },
  cad: { label: 'CAD', color: 'bg-blue-100', icon: Ruler },
  other: { label: 'File', color: 'bg-gray-100', icon: File }
};

// Sub-component to handle individual image error states independently
const FileThumbnail = ({ file, url, config, viewMode }) => {
  const [imgError, setImgError] = useState(false);
  const isImage = config === fileTypeConfig.image;

  if (isImage && url && !imgError) {
    return (
      <img 
        src={url} 
        alt={file.fileName} 
        className="w-full h-full object-cover"
        onError={(e) => {
          console.error("Image failed to load:", url);
          setImgError(true);
        }} 
      />
    );
  }

  // Fallback for non-images or broken images
  return (
    <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <config.icon className="w-10 h-10 text-slate-400 mb-2" />
      <span className="text-xs font-medium text-slate-600 truncate max-w-full px-2">
        {imgError ? 'Preview Failed' : config.label}
      </span>
    </div>
  );
};

export default function UploadGallery({ 
  files = [], 
  type, 
  onDelete, 
  onRefresh,
  showFilters = false 
}) {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredFiles = files.filter(file => {
    if (!searchQuery) return true;
    return file.fileName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           file.roomName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) await onRefresh();
    setIsRefreshing(false);
  };

  const getFileIcon = (file) => {
    const ext = file.fileName?.split('.').pop()?.toLowerCase();
    if (['jpg','png','jpeg','webp','heic','gif','bmp'].includes(ext)) return fileTypeConfig.image;
    if (ext === 'pdf') return fileTypeConfig.pdf;
    if (['dwg','dxf'].includes(ext)) return fileTypeConfig.cad;
    return fileTypeConfig.other;
  };

  // --- IMPROVED URL GENERATOR ---
  const getFileUrl = (file) => {
    // 1. Priority: Local Preview (Blob from new upload)
    if (file.previewUrl) return file.previewUrl;

    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';
    
    // 2. Identify the path from the file object
    // It might be stored in fileUrl, url, or thumbnailUrl depending on your API
    const path = file.fileUrl || file.url || file.thumbnailUrl;

    if (!path) return null;

    // 3. Check if it is already a full URL (External link or Cloudinary/S3)
    if (path.startsWith('http') || path.startsWith('blob:')) {
      return path;
    }

    // 4. Handle paths that already include '/uploads/' to prevent double nesting
    if (path.startsWith('/uploads') || path.startsWith('/')) {
      return `${baseUrl}${path}`;
    }

    // 5. Fallback: Construct standard path
    // Ensure we don't put 'undefined' in the URL if projectId is missing
    const projectPath = file.projectId ? `/${file.projectId}` : '';
    return `${baseUrl}/uploads${projectPath}/${path}`;
  };

  if (files.length === 0) {
    return (
      <Card className="bg-card border-border mt-6">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Image className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No uploads yet</h3>
          {onRefresh && (
            <Button variant="ghost" size="sm" onClick={handleManualRefresh} className="mt-2">
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border mt-6">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-lg">
              {type === 'floorplan' ? 'Floor Plans' : 'Gallery'}
              <Badge variant="secondary" className="ml-2">{files.length}</Badge>
            </h3>
          </div>
          
          <div className="flex gap-2">
            {showFilters && (
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-40"
                />
              </div>
            )}
            <div className="flex bg-muted rounded-md p-1">
              <Button variant={viewMode==='grid'?'default':'ghost'} size="icon" className="h-8 w-8" onClick={()=>setViewMode('grid')}>
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant={viewMode==='list'?'default':'ghost'} size="icon" className="h-8 w-8" onClick={()=>setViewMode('list')}>
                <List className="h-4 w-4" />
              </Button>
            </div>
            {onRefresh && (
              <Button variant="outline" size="icon" onClick={handleManualRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </div>

        {/* Grid/List View */}
        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
          {filteredFiles.map((file) => {
            const config = getFileIcon(file);
            const url = getFileUrl(file);

            return (
              <Card key={file.id || Math.random()} className="group hover:shadow-lg transition-all overflow-hidden">
                <CardContent className="p-3">
                  <div className={`relative rounded-lg overflow-hidden mb-3 border bg-slate-50 ${viewMode === 'grid' ? 'aspect-video' : 'h-48 w-full'}`}>
                    
                    {/* Use the new sub-component for safe rendering */}
                    <FileThumbnail 
                      file={file} 
                      url={url} 
                      config={config} 
                      viewMode={viewMode} 
                    />

                    <div className="absolute top-2 left-2">
                       <Badge className="bg-black/60 text-white backdrop-blur-md border-none">{config.label}</Badge>
                    </div>
                  </div>

                  <div className="flex justify-between items-start">
                    <div className="truncate pr-2 w-full">
                      <p className="font-medium text-sm truncate" title={file.fileName || 'Untitled'}>
                        {file.fileName || 'Untitled'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {file.fileSize ? (file.fileSize / (1024*1024)).toFixed(2) + ' MB' : 'Unknown size'} 
                        {' • '} 
                        {file.createdAt || file.uploadDate ? new Date(file.createdAt || file.uploadDate).toLocaleDateString() : 'Just now'}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => url && window.open(url, '_blank')} disabled={!url}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(file.id, type)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}