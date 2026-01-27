// src/components/projects/uploads/FloorPlanUpload.js
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Home, CheckCircle2, AlertCircle, Camera, Loader2 } from 'lucide-react';
import { uploadService } from '@/services/upload.service';
import { toast } from 'sonner';

export default function FloorPlanUpload({ projectId, onUploadComplete, onSwitchToPhotos, mobileView = false }) {
  const [isUploading, setIsUploading] = useState(false);
  const [roomCount, setRoomCount] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (file) => {
    if (!file) return;

    // UPDATED: Allow floor plan formats AND all image files including HEIC
    const validTypes = [
      '.dwg', '.dxf', '.pdf', '.skp', 
      '.heic', '.heif',
      '.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'
    ];
    
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
      toast.error('Please upload DWG, DXF, PDF, SKP, or image files (JPG, PNG, HEIC, WEBP, etc.) only');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'FLOOR_PLAN');
      
      if (roomCount) {
        formData.append('roomCount', roomCount);
      }

      const result = await uploadService.uploadFloorPlan(projectId, formData);
      if (result.success) {
        toast.success('Floor plan uploaded successfully!');
        if (onUploadComplete) {
          onUploadComplete(result.data.file);
        }
        
        setRoomCount('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(result.message || 'Upload failed');
      }
      
    } catch (error) {
      console.error('❌ Floor plan upload failed:', error);
      toast.error(error.message || 'Failed to upload floor plan');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (isUploading) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      handleFileUpload(file);
    }
  };

  const handleDropZoneClick = () => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-foreground text-lg sm:text-xl">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            {mobileView ? 'Upload Plans' : 'Upload Floor Plans'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="roomCount" className="text-foreground text-sm sm:text-base">
              Number of Rooms (Optional)
            </Label>
            <Input
              id="roomCount"
              type="number"
              placeholder="e.g., 5"
              value={roomCount}
              onChange={(e) => setRoomCount(e.target.value)}
              className="border-border text-sm sm:text-base"
            />
            <p className="text-xs sm:text-sm text-muted-foreground">
              Helps understand your space better
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground text-sm sm:text-base">Supported Formats</Label>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs">
                DWG
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs">
                DXF
              </Badge>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-300 text-xs">
                PDF
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300 text-xs">
                SKP
              </Badge>
              <Badge variant="outline" className="bg-pink-50 text-pink-700 dark:bg-pink-900 dark:text-pink-300 text-xs">
                HEIC
              </Badge>
              {/* NEW: Image format badges */}
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-xs">
                JPG
              </Badge>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-xs">
                PNG
              </Badge>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 dark:bg-orange-900 dark:text-orange-300 text-xs">
                WEBP
              </Badge>
            </div>
          </div>
        </div>

        {/* Enhanced Drag & Drop Zone */}
        <div 
          className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-all duration-200 ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-lg scale-105' 
              : isUploading 
              ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' 
              : 'border-border bg-background hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleDropZoneClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            id="floorplan-upload"
            // UPDATED: Accept floor plan formats AND all image files
            accept=".dwg,.dxf,.pdf,.skp,.heic,.heif,.jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,image/*"
            onChange={handleFileInputChange}
            disabled={isUploading}
            className="hidden"
          />
          <div className="space-y-2 sm:space-y-3">
            <div className={`mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors ${
              isDragOver 
                ? 'bg-blue-500' 
                : isUploading 
                ? 'bg-yellow-500' 
                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
            }`}>
              {isUploading ? (
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-spin" />
              ) : isDragOver ? (
                <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-bounce" />
              ) : (
                <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground text-sm sm:text-base">
                {isUploading 
                  ? 'Uploading Floor Plan...' 
                  : isDragOver 
                  ? 'Drop your floor plan here' 
                  : 'Upload Floor Plans'
                }
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {isUploading 
                  ? 'Please wait while we upload your floor plan...' 
                  : isDragOver
                  ? 'Release to upload your floor plan'
                  : 'Click or drag & drop to upload DWG, DXF, PDF, SKP, or image files'
                }
              </p>
            </div>
            {!isUploading && (
              <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  DWG
                </Badge>
                <Badge variant="outline" className="text-xs">
                  DXF
                </Badge>
                <Badge variant="outline" className="text-xs">
                  PDF
                </Badge>
                <Badge variant="outline" className="text-xs">
                  SKP
                </Badge>
                <Badge variant="outline" className="text-xs">
                  HEIC
                </Badge>
                {/* NEW: Image format indicators */}
                <Badge variant="outline" className="text-xs">
                  JPG
                </Badge>
                <Badge variant="outline" className="text-xs">
                  PNG
                </Badge>
                <Badge variant="outline" className="text-xs">
                  WEBP
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* UPDATED: Upload Instructions */}
        {!isUploading && (
          <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Floor Plan Upload Tips
              </p>
              <ul className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• <strong>Click</strong> the area above or <strong>drag & drop</strong> your floor plans</li>
                <li>• Supported formats: DWG, DXF, PDF, SKP, and all image files (JPG, PNG, HEIC, WEBP, etc.)</li>
                <li>• Include room dimensions and labels for best results</li>
                <li>• Upload multiple floor plans for different levels</li>
                <li>• Image files are perfect for scanned floor plans or photos of architectural drawings</li>
                <li>• HEIC files (iPhone photos) are fully supported</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}