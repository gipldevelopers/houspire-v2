// src\components\mobile-upload\MobileUploadInterface.js
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  X,
  Home,
  Plus,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';

const roomTypes = [
  { value: 'LIVING_ROOM', label: 'Living Room' },
  { value: 'BEDROOM', label: 'Bedroom' },
  { value: 'MASTER_BEDROOM', label: 'Master Bedroom' },
  { value: 'KITCHEN', label: 'Kitchen' },
  { value: 'BATHROOM', label: 'Bathroom' },
  { value: 'DINING_ROOM', label: 'Dining Room' },
  { value: 'STUDY_ROOM', label: 'Study Room' },
  { value: 'BALCONY', label: 'Balcony' },
  { value: 'OTHER', label: 'Other' }
];

export default function MobileUploadInterface({ token, project }) {
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // ⭐⭐⭐ ADD URL VALIDATION ⭐⭐⭐
  useEffect(() => {
    // Check if we're on the correct domain to prevent redirects
    const currentUrl = window.location.href;
    const expectedDomain = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    if (!currentUrl.includes(expectedDomain.replace('http://', '').replace('https://', ''))) {
      console.warn('⚠️ Unexpected domain detected:', currentUrl);
    }
  }, []);

  const handleTakePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    
    if (!selectedRoomType) {
      toast.error('Please select a room type first');
      return;
    }

    // ⭐⭐⭐ VALIDATE FILE SIZE ⭐⭐⭐
    const validFiles = files.filter(file => {
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large (max 20MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newPhotos = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      roomType: selectedRoomType,
      previewUrl: URL.createObjectURL(file),
      uploadDate: new Date()
    }));

    setUploadedPhotos(prev => [...prev, ...newPhotos]);
    event.target.value = '';
  };

  const removePhoto = (photoId) => {
    setUploadedPhotos(prev => {
      const photoToRemove = prev.find(p => p.id === photoId);
      if (photoToRemove?.previewUrl) {
        URL.revokeObjectURL(photoToRemove.previewUrl);
      }
      return prev.filter(photo => photo.id !== photoId);
    });
  };

  const uploadPhotos = async () => {
    if (uploadedPhotos.length === 0) {
      toast.error('Please add at least one photo');
      return;
    }

    if (!selectedRoomType) {
      toast.error('Please select a room type');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('roomType', selectedRoomType);

      // Add all photos to form data
      uploadedPhotos.forEach(photo => {
        formData.append('photos', photo.file);
      });

      // ⭐⭐⭐ IMPROVED ERROR HANDLING ⭐⭐⭐
      const response = await api.post(`/mobile-upload/upload/${token}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000 // 60 second timeout
      });

      const data = response.data;

      if (data.success) {
        toast.success(`Successfully uploaded ${data.data.totalUploaded} photos!`);
        setUploadedPhotos([]);
        setSelectedRoomType('');
        
        // Don't auto-close, let user decide
        toast.info('You can now close this window or upload more photos');
        
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      
      let errorMessage = 'Failed to upload photos';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Upload timeout. Please try again.';
      } else if (error.response?.status === 413) {
        errorMessage = 'File too large. Maximum size is 20MB per file.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">Upload Room Photos</h1>
                <p className="text-sm text-gray-600">{project?.title}</p>
                <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 text-xs">
                  QR Code Upload
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="mb-4 border-amber-200 bg-amber-50">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">Secure Connection</p>
                <p className="text-amber-700 text-xs">
                  Make sure you're on {process.env.NEXT_PUBLIC_BASE_URL || 'houspire.ai'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Room Type Selection */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-3">Select Room Type</h2>
            <div className="grid grid-cols-2 gap-2">
              {roomTypes.map(room => (
                <Button
                  key={room.value}
                  variant={selectedRoomType === room.value ? "default" : "outline"}
                  onClick={() => setSelectedRoomType(room.value)}
                  className="h-12 text-sm"
                >
                  {room.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Photo Upload Section */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-3">Add Photos</h2>
            
            {/* Upload Button */}
            <div className="mb-4">
              <Button
                onClick={handleTakePhoto}
                disabled={!selectedRoomType}
                className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Camera className="w-5 h-5 mr-2" />
                {selectedRoomType ? 'Take or Select Photos' : 'Select Room Type First'}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                multiple
                capture="environment"
                className="hidden"
              />
            </div>

            {/* Uploaded Photos Preview */}
            {uploadedPhotos.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">
                  Photos to upload ({uploadedPhotos.length})
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {uploadedPhotos.map(photo => (
                    <div key={photo.id} className="relative">
                      <img
                        src={photo.previewUrl}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-1 left-1 right-1">
                        <Badge className="bg-black/70 text-white text-xs w-full justify-center">
                          {roomTypes.find(r => r.value === photo.roomType)?.label}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {/* Add more button */}
                  <button
                    onClick={handleTakePhoto}
                    className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600"
                  >
                    <Plus className="w-6 h-6 mb-1" />
                    <span className="text-xs">Add More</span>
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload Button */}
        {uploadedPhotos.length > 0 && (
          <Button
            onClick={uploadPhotos}
            disabled={isUploading}
            className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 mb-4"
          >
            {isUploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Uploading {uploadedPhotos.length} photos...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload {uploadedPhotos.length} Photos
              </>
            )}
          </Button>
        )}

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Tips for Best Results
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Take photos in good lighting</li>
              <li>• Capture multiple angles of each room</li>
              <li>• Include walls, floors, and key features</li>
              <li>• Avoid blurry or dark photos</li>
              <li>• You can upload multiple times with the same QR code</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}