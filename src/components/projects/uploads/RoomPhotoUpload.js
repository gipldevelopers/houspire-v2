'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Camera, CheckCircle2, QrCode, Smartphone, Loader2, Plus, X, Image, Home, Bed, Kitchen, Bath, Heart, BookOpen, Sofa } from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';
import { uploadService } from '@/services/upload.service';
import { toast } from 'sonner';

const roomTypes = [
  { value: 'LIVING_ROOM', label: 'Living Room', icon: Home, required: true },
  { value: 'MASTER_BEDROOM', label: 'Master Bedroom', icon: Heart, required: true },
  { value: 'KITCHEN', label: 'Kitchen', icon: Kitchen, required: true },
  { value: 'BEDROOM', label: 'Bedroom', icon: Bed, required: false },
  { value: 'BATHROOM', label: 'Bathroom', icon: Bath, required: false },
  { value: 'DINING_ROOM', label: 'Dining Room', icon: Sofa, required: false },
  { value: 'STUDY_ROOM', label: 'Study Room', icon: BookOpen, required: false },
  { value: 'BALCONY', label: 'Balcony', icon: null, required: false },
];

const dimensions = ['10x12', '12x14', '14x16', '16x20', 'Custom'];

// --- Room Card Component ---
const RoomCard = ({ room, index, onUpload, onRemove, onTypeChange, onDimensionsChange, projectId, parentRefresh }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [customDimensions, setCustomDimensions] = useState(room.customDimensions || '');
  
  // Logic: Prefer server URL, then local preview, then thumbnail
  const [imagePreview, setImagePreview] = useState(room.fileUrl || room.previewUrl || room.thumbnailUrl || null);

  // Sync preview if room prop changes (e.g. server update)
  useEffect(() => {
    setImagePreview(room.fileUrl || room.previewUrl || room.thumbnailUrl || null);
  }, [room]);

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast.error('File size must be less than 20MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => (prev >= 90 ? 90 : prev + 10));
      }, 200);

      const formData = new FormData();
      formData.append('file', file);
      if (room.dimensions) {
        formData.append('dimensions', room.dimensions === 'Custom' ? customDimensions : room.dimensions);
      }
      formData.append('roomType', room.type);

      // Perform Upload
      const result = await uploadService.uploadRoomPhoto(projectId, formData);
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        toast.success(`${room.name} photo uploaded!`);
        
        // Notify parent immediately to refresh
        if (parentRefresh) parentRefresh(result.data, "roomPhotos");
        
        // Local state update (optional, as parent refresh will sync it back)
        onUpload({
          ...room,
          isUploaded: true,
          uploadedAt: new Date().toISOString(),
          serverId: result.data?.id,
          fileUrl: result.data?.fileUrl
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to upload ${room.name}`);
      setImagePreview(null);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleRemoveImage = async () => {
    // If it's on the server, delete it via API
    if (room.isUploaded && (room.serverId || room.fileId)) {
      try {
        const idToDelete = room.serverId || room.fileId;
        const result = await uploadService.deleteFile(idToDelete, "ROOM_PHOTO");
        if(result.success) {
           toast.success("Image removed");
           // Trigger parent refresh to update Gallery and this card
           if(parentRefresh) parentRefresh(null, "roomPhotos");
        }
      } catch(e) {
        console.error("Delete failed", e);
        toast.error("Failed to remove image");
        return; // Don't clear local if server delete failed
      }
    }

    setImagePreview(null);
    onUpload({
      ...room,
      imageFile: null,
      previewUrl: null,
      isUploaded: false,
      serverId: null,
      fileId: null,
      fileUrl: null,
      status: 'pending',
    });
  };

  const isRequired = room.required;
  const IconComponent = roomTypes.find(r => r.value === room.type)?.icon || Image;
  // Determine if we show image: room says uploaded OR we have a local preview
  const showImage = room.isUploaded || !!imagePreview;

  return (
    <Card className={`border ${room.isUploaded ? 'border-green-300 bg-green-50/30' : 'border-gray-200'} rounded-xl transition-all hover:shadow-md`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${room.isUploaded ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-900">Room {index + 1}: {room.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                {isRequired ? <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5">Required</Badge> : <Badge variant="outline" className="text-xs">Optional</Badge>}
                {room.isUploaded && <Badge className="bg-green-100 text-green-700 text-xs">Uploaded</Badge>}
              </div>
            </div>
          </div>
          {!isRequired && (
            <button onClick={() => onRemove(room.id)} className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Room Type</Label>
              <Select value={room.type} onValueChange={(v) => onTypeChange(room.id, v)} disabled={room.isUploaded}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {roomTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Dimensions</Label>
              <Select value={room.dimensions || ''} onValueChange={(v) => onDimensionsChange(room.id, 'dimensions', v)} disabled={room.isUploaded}>
                <SelectTrigger><SelectValue placeholder="Size" /></SelectTrigger>
                <SelectContent>
                  {dimensions.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Room Photo</Label>
            {(showImage || isUploading) ? (
              <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img src={imagePreview} alt={room.name} className="w-full h-48 object-cover" onError={(e) => e.target.style.display='none'} />
                {room.isUploaded && !isUploading && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
                {/* Remove Button inside Image */}
                {!isUploading && (
                   <Button
                      variant="destructive"
                      size="sm"
                      className="absolute bottom-2 right-2 h-8 px-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="w-4 h-4 mr-1"/> Retake
                    </Button>
                )}
              </div>
            ) : (
              <div
                className={`border-2 rounded-lg p-4 text-center cursor-pointer border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50/30 transition-all`}
                onClick={() => room.type && fileInputRef.current?.click()}
              >
                <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0])} className="hidden" disabled={!room.type} />
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-6 h-6 text-gray-500" />
                </div>
                <p className="font-medium text-gray-900">Click to Upload</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Main Component ---
export default function RoomPhotoUpload({ projectId, onUploadComplete, mobileView = false, existingFiles = [] }) {
  const [rooms, setRooms] = useState([]);
  const [uploadMethod, setUploadMethod] = useState('multi');
  const [isInitialized, setIsInitialized] = useState(false);
  const storageKey = `room_uploads_${projectId}`;

  // 1. Initialize Rooms (Merge LocalStorage with Server Data)
  useEffect(() => {
    if (isInitialized) return;

    const saved = localStorage.getItem(storageKey);
    let initialRooms = [];

    if (saved) {
      initialRooms = Object.values(JSON.parse(saved));
    } else {
      // Default required rooms
      initialRooms = roomTypes.filter(r => r.required).slice(0, 3).map((r, i) => ({
        id: `room_${Date.now()}_${i}`,
        projectId,
        type: r.value,
        name: r.label,
        required: true,
        isUploaded: false,
        status: 'pending'
      }));
    }
    setRooms(initialRooms);
    setIsInitialized(true);
  }, [projectId, storageKey, isInitialized]);

  // 2. CRITICAL SYNC: Watch 'existingFiles' from parent (Server Data)
  // If a file is deleted in Gallery, this effect updates the room card status
  useEffect(() => {
    if (!isInitialized) return;

    setRooms(prevRooms => {
      return prevRooms.map(room => {
        // Find if this room type has a corresponding file on server
        // Logic: Match by exact room ID if saved, or fall back to Room Type for loose matching
        const serverFile = existingFiles.find(f => 
          (room.serverId && f.id === room.serverId) || 
          (f.roomType === room.type && !f.isAssignedToOtherRoom) // Simple matching strategy
        );

        if (serverFile) {
          // File exists on server -> Mark as uploaded
          return {
            ...room,
            isUploaded: true,
            serverId: serverFile.id,
            fileUrl: serverFile.fileUrl || serverFile.thumbnailUrl, // Use server URL
            fileName: serverFile.fileName
          };
        } else {
          // File NOT on server -> If it WAS uploaded, it means it was deleted in gallery
          if (room.isUploaded) {
            return {
              ...room,
              isUploaded: false,
              serverId: null,
              fileUrl: null,
              imageFile: null,
              previewUrl: null
            };
          }
          return room;
        }
      });
    });
  }, [existingFiles, isInitialized]);

  // 3. Save to LocalStorage whenever rooms change
  useEffect(() => {
    if (!isInitialized) return;
    const roomObject = {};
    rooms.forEach(r => { roomObject[r.id] = r; });
    localStorage.setItem(storageKey, JSON.stringify(roomObject));
  }, [rooms, storageKey, isInitialized]);

  // Callbacks
  const addRoom = () => {
    const available = roomTypes.find(r => !r.required && !rooms.some(existing => existing.type === r.value));
    if (available) {
      setRooms([...rooms, {
        id: `room_${Date.now()}`,
        projectId,
        type: available.value,
        name: available.label,
        required: false,
        isUploaded: false,
        status: 'pending'
      }]);
    } else {
      toast.info('All room types added');
    }
  };

  const removeRoom = (id) => setRooms(rooms.filter(r => r.id !== id));
  
  const updateRoom = (id, updates) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const handleClearAll = async () => {
    if (confirm('Delete ALL photos for this project?')) {
      try {
        // 1. Identify uploaded files
        const uploadedIds = existingFiles.map(f => f.id);
        
        // 2. Delete from server one by one (or use a bulk API if available)
        const deletePromises = uploadedIds.map(id => uploadService.deleteFile(id, "ROOM_PHOTO"));
        await Promise.all(deletePromises);

        // 3. Clear Local Storage
        localStorage.removeItem(storageKey);
        
        // 4. Reset Local State
        setRooms(prev => prev.map(r => ({
           ...r, isUploaded: false, serverId: null, fileUrl: null, previewUrl: null
        })));

        // 5. Refresh Parent
        if (onUploadComplete) onUploadComplete();
        
        toast.success('All uploads cleared');
      } catch (err) {
        console.error(err);
        toast.error('Failed to clear all files');
      }
    }
  };

  const uploadedCount = rooms.filter(r => r.isUploaded).length;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border border-blue-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Camera className="w-5 h-5 text-blue-600" />
          <div>
            <h1 className="text-lg font-bold">Upload Room Photos</h1>
            <p className="text-sm text-gray-600">{uploadedCount} photos uploaded</p>
          </div>
        </div>
        {uploadedCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearAll} className="text-red-600 hover:bg-red-50">
            <X className="w-4 h-4 mr-1" /> Clear All
          </Button>
        )}
      </div>

      <Tabs value={uploadMethod} onValueChange={setUploadMethod} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="multi">Multi-Room Upload</TabsTrigger>
          <TabsTrigger value="qr">QR Code Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="multi" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room, i) => (
              <RoomCard 
                key={room.id} 
                room={room} 
                index={i} 
                onUpload={(updated) => updateRoom(room.id, updated)} 
                onRemove={removeRoom}
                onTypeChange={(id, v) => updateRoom(id, { type: v, name: roomTypes.find(t=>t.value===v).label })}
                onDimensionsChange={(id, k, v) => updateRoom(id, { [k]: v })}
                projectId={projectId}
                parentRefresh={onUploadComplete} // Pass the refresh function down
              />
            ))}
          </div>
          {rooms.length < 8 && (
            <Button onClick={addRoom} variant="outline" className="w-full h-12 border-dashed">
              <Plus className="w-4 h-4 mr-2" /> Add Another Room
            </Button>
          )}
        </TabsContent>

        <TabsContent value="qr">
          <QRCodeGenerator projectId={projectId} mobileView={mobileView} />
        </TabsContent>
      </Tabs>
    </div>
  );
}