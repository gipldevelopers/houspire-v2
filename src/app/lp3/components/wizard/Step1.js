// // src\app\lp3\components\wizard\Step1.js
// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { 
//   Home, Building, Building2, LayoutGrid, Check, Upload, X, 
//   Loader2, FileImage, Ruler, DoorOpen, ChevronDown, Image,
//   Sofa, Bed, Crown, CookingPot, Bath, UtensilsCrossed, BookOpen,
//   Sunset, Square
// } from "lucide-react";
// import { uploadService } from '@/services/upload.service';

// export const Step1 = ({ selectedType, onSelectType, selectedPackage, uploadedImage, onImageUpload }) => {
//   const fileInputRef = useRef(null);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadError, setUploadError] = useState(null);
//   const [roomType, setRoomType] = useState('');
//   const [roomDimensions, setRoomDimensions] = useState('');
//   const [customDimensions, setCustomDimensions] = useState('');
//   const [roomTypeOpen, setRoomTypeOpen] = useState(false);
//   const [dimensionsOpen, setDimensionsOpen] = useState(false);
  
//   const showUploadSection = selectedPackage === 499;
  
//   // Get backend server URL from environment
//   const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

//   // Room type options with Lucide icons
//   const roomTypes = [
//     { value: 'LIVING_ROOM', label: 'Living Room', icon: Sofa, desc: 'Main sitting area', color: 'text-blue-500' },
//     { value: 'BEDROOM', label: 'Bedroom', icon: Bed, desc: 'Sleeping and relaxation', color: 'text-purple-500' },
//     { value: 'MASTER_BEDROOM', label: 'Master Bedroom', icon: Crown, desc: 'Primary bedroom with ensuite', color: 'text-amber-500' },
//     { value: 'KITCHEN', label: 'Kitchen', icon: CookingPot, desc: 'Cooking and dining area', color: 'text-orange-500' },
//     { value: 'BATHROOM', label: 'Bathroom', icon: Bath, desc: 'Bathing and toilet area', color: 'text-cyan-500' },
//     { value: 'DINING_ROOM', label: 'Dining Room', icon: UtensilsCrossed, desc: 'Formal dining space', color: 'text-emerald-500' },
//     { value: 'STUDY_ROOM', label: 'Study Room', icon: BookOpen, desc: 'Office or study area', color: 'text-indigo-500' },
//     { value: 'BALCONY', label: 'Balcony', icon: Sunset, desc: 'Outdoor/open space', color: 'text-pink-500' },
//     { value: 'OTHER', label: 'Other', icon: Square, desc: 'Custom room type', color: 'text-gray-500' }
//   ];

//   // Dimension options
//   const dimensions = [
//     { value: '10x12', label: '10x12 ft', area: '120 sq ft', desc: 'Small room' },
//     { value: '12x14', label: '12x14 ft', area: '168 sq ft', desc: 'Medium room' },
//     { value: '14x16', label: '14x16 ft', area: '224 sq ft', desc: 'Large room' },
//     { value: '16x20', label: '16x20 ft', area: '320 sq ft', desc: 'Extra large room' },
//     // { value: 'custom', label: 'Custom Size', area: 'Custom', desc: 'Enter specific dimensions' }
//   ];

//   // Sync preview image with prop - FIXED: Prepend backend URL
//   useEffect(() => {
//     if (uploadedImage && uploadedImage.url) {
//       // Check if URL is relative or absolute
//       let imageUrl = uploadedImage.url;
      
//       // If URL starts with /, prepend backend URL
//       if (imageUrl.startsWith('/')) {
//         imageUrl = `${BACKEND_URL}${imageUrl}`;
//       }
//       // If URL doesn't have http:// or https://, prepend backend URL
//       else if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
//         imageUrl = `${BACKEND_URL}/${imageUrl}`;
//       }
//       setPreviewImage(imageUrl);
//     } else {
//       setPreviewImage(null);
//     }
//   }, [uploadedImage, BACKEND_URL]);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (roomTypeOpen && !event.target.closest('.room-type-dropdown')) {
//         setRoomTypeOpen(false);
//       }
//       if (dimensionsOpen && !event.target.closest('.dimensions-dropdown')) {
//         setDimensionsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [roomTypeOpen, dimensionsOpen]);

//   const validateImage = (file) => {
//     // Validate file type
//     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
//     if (!allowedTypes.includes(file.type)) {
//       throw new Error('Please select a valid image file (JPEG, PNG, WEBP, HEIC)');
//     }

//     // Validate file size (max 20MB)
//     if (file.size > 20 * 1024 * 1024) {
//       throw new Error('Image size should be less than 20MB');
//     }

//     return true;
//   };

//   const handleImageUpload = async (file) => {
//     if (!file) return;

//     // Validate room type selection
//     if (!roomType) {
//       setUploadError('Please select a room type first');
//       return;
//     }

//     setIsUploading(true);
//     setUploadError(null);

//     try {
//       validateImage(file);

//       const formData = new FormData();
//       formData.append('file', file);
      
//       // Add room metadata
//       if (roomType) {
//         formData.append('roomType', roomType);
//       }
      
//       if (roomDimensions) {
//         const finalDimensions = roomDimensions === 'custom' ? customDimensions : roomDimensions;
//         formData.append('dimensions', finalDimensions);
//       }

//       // Use the public temporary upload endpoint
//       const response = await uploadService.uploadTemporaryFile(formData);

//       if (response.success) {
        
//         // Build proper image URL
//         let imageUrl = response.data.fileUrl;
        
//         // If URL is relative, prepend backend URL
//         if (imageUrl && imageUrl.startsWith('/')) {
//           imageUrl = `${BACKEND_URL}${imageUrl}`;
//         } else if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
//           imageUrl = `${BACKEND_URL}/${imageUrl}`;
//         }
        
//         const imageData = {
//           url: imageUrl, // Store the full URL
//           fileName: file.name,
//           temporaryId: response.data.temporaryId,
//           fileSize: file.size,
//           mimeType: file.type,
//           lastModified: file.lastModified,
//           roomType: roomType,
//           dimensions: roomDimensions === 'custom' ? customDimensions : roomDimensions
//         };
        
//         setPreviewImage(imageUrl);
//         onImageUpload(imageData);
//       } else {
//         throw new Error(response.message || 'Upload failed');
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       setUploadError(error.message || 'Failed to upload image. Please try again.');
//       // Clear any existing preview on error
//       setPreviewImage(null);
//       onImageUpload(null);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//     } finally {
//       setIsUploading(false);
//     }
//   };
  
//   const handleFileInputChange = (event) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       handleImageUpload(file);
//     }
//   };
  
//   const handleRemoveImage = () => {
//     setPreviewImage(null);
//     setUploadError(null);
//     onImageUpload(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };
  
//   const handleUploadClick = () => {
//     if (!isUploading && roomType && fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (isUploading || !roomType) return;

//     const files = e.dataTransfer.files;
//     if (files.length > 0) {
//       const file = files[0];
//       handleImageUpload(file);
//     }
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   const getFileExtension = (fileName) => {
//     return fileName?.split('.').pop()?.toUpperCase() || 'FILE';
//   };

//   const getRoomTypeLabel = (value) => {
//     const room = roomTypes.find(rt => rt.value === value);
//     return room ? room.label : '';
//   };

//   const getRoomTypeIcon = (value) => {
//     const room = roomTypes.find(rt => rt.value === value);
//     return room ? room.icon : Square;
//   };

//   const getSelectedRoomType = () => {
//     return roomTypes.find(rt => rt.value === roomType);
//   };

//   const getSelectedDimension = () => {
//     return dimensions.find(dim => dim.value === roomDimensions);
//   };

//   // Handle custom dimension input
//   const handleCustomDimensionInput = (e) => {
//     const value = e.target.value;
//     setCustomDimensions(value);
//     if (value.trim()) {
//       setRoomDimensions('custom');
//     }
//   };
  
//   const propertyTypes = [
//     {
//       id: "2bhk",
//       icon: Home,
//       title: "2BHK Interiors",
//       description: "Perfect for small families",
//       area: "900–1100 sq ft",
//       rooms: "2 Bedrooms + Living",
//       color: "from-blue-500/10 to-blue-500/5",
//       iconColor: "text-blue-500",
//       borderColor: "border-blue-500/20 hover:border-blue-500/50",
//     },
//     {
//       id: "3bhk",
//       icon: Building,
//       title: "3BHK Interiors",
//       description: "Ideal for growing families",
//       area: "1200–1500 sq ft",
//       rooms: "3 Bedrooms + Living",
//       color: "from-[#e48b53]/10 to-[#e48b53]/5",
//       iconColor: "text-[#e48b53]",
//       borderColor: "border-[#e48b53]/20 hover:border-[#e48b53]/50",
//     },
//     {
//       id: "4bhk",
//       icon: Building2,
//       title: "4BHK Interiors",
//       description: "Designed for premium living",
//       area: "1800+ sq ft",
//       rooms: "4 Bedrooms + Living",
//       color: "from-purple-500/10 to-purple-500/5",
//       iconColor: "text-purple-500",
//       borderColor: "border-purple-500/20 hover:border-purple-500/50",
//     },
//     {
//       id: "other",
//       icon: LayoutGrid,
//       title: "Other Configuration",
//       description: "Villa, Studio, or custom needs",
//       area: "Variable",
//       rooms: "Custom Layout",
//       color: "from-orange-500/10 to-orange-500/5",
//       iconColor: "text-orange-500",
//       borderColor: "border-orange-500/20 hover:border-orange-500/50",
//     },
//   ];

//   return (
//     <div className="space-y-4 animate-fade-in">
//       {/* For ₹499 package: Show compact room details + image upload */}
//       {showUploadSection ? (
//         <div className="space-y-4">
//           {/* Header Section - Compact */}
//           <div className="text-center">
//             <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[#e48b53] to-orange-500 rounded-xl flex items-center justify-center shadow-md mb-3">
//               <Image className="w-6 h-6 text-white" />
//             </div>
//             <h2 className="text-xl font-bold text-[#042939]">
//               Upload Room Image
//             </h2>
//             <p className="text-[#042939]/70 text-sm mt-1">
//               Add room details and upload a photo
//             </p>
//           </div>

//           {/* Compact Room Details - Horizontal layout */}
//           <div className="space-y-3">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               {/* Room Type Dropdown */}
//               <div className="room-type-dropdown relative">
//                 <label className="block text-xs font-semibold text-[#042939] mb-1 ml-1">
//                   Room Type *
//                 </label>
//                 <button
//                   onClick={() => {
//                     setRoomTypeOpen(!roomTypeOpen);
//                     setDimensionsOpen(false);
//                   }}
//                   className={`w-full p-3 rounded-xl border transition-all duration-200 flex items-center justify-between ${
//                     roomType
//                       ? 'border-[#e48b53] bg-[#e48b53]/5'
//                       : 'border-gray-200 hover:border-[#e48b53]'
//                   } ${roomTypeOpen ? 'border-[#e48b53] shadow-sm' : ''}`}
//                 >
//                   <div className="flex items-center gap-2">
//                     {roomType ? (
//                       <>
//                         <div className="p-1.5 bg-white rounded-lg border border-gray-200">
//                           {(() => {
//                             const Icon = getRoomTypeIcon(roomType);
//                             const room = getSelectedRoomType();
//                             return <Icon className={`w-4 h-4 ${room?.color}`} />;
//                           })()}
//                         </div>
//                         <span className="font-medium text-sm text-[#042939]">
//                           {getRoomTypeLabel(roomType)}
//                         </span>
//                       </>
//                     ) : (
//                       <span className="text-[#042939]/60 text-sm">Select room type</span>
//                     )}
//                   </div>
//                   <ChevronDown 
//                     className={`w-4 h-4 text-[#042939]/40 transition-transform duration-200 ${
//                       roomTypeOpen ? 'rotate-180' : ''
//                     }`}
//                   />
//                 </button>

//                 {roomTypeOpen && (
//                   <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto">
//                     {roomTypes.map((type) => {
//                       const Icon = type.icon;
//                       return (
//                         <button
//                           key={type.value}
//                           onClick={() => {
//                             setRoomType(type.value);
//                             setRoomTypeOpen(false);
//                           }}
//                           className={`w-full p-3 text-left transition-colors duration-150 flex items-center gap-3 hover:bg-gray-50 ${
//                             roomType === type.value
//                               ? 'bg-[#e48b53]/5'
//                               : 'text-[#042939]'
//                           } first:rounded-t-xl last:rounded-b-xl`}
//                         >
//                           <div className={`p-2 rounded-lg border ${roomType === type.value ? 'border-[#e48b53] bg-white' : 'border-gray-200 bg-gray-50'}`}>
//                             <Icon className={`w-4 h-4 ${type.color}`} />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <div className="font-medium text-sm">{type.label}</div>
//                             <div className="text-xs text-[#042939]/60 truncate">{type.desc}</div>
//                           </div>
//                           {roomType === type.value && (
//                             <Check className="w-4 h-4 text-[#e48b53] flex-shrink-0" />
//                           )}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>

//               {/* Room Dimensions Dropdown */}
//               <div className="dimensions-dropdown relative">
//                 <label className="block text-xs font-semibold text-[#042939] mb-1 ml-1">
//                   Room Dimensions
//                 </label>
//                 <button
//                   onClick={() => {
//                     setDimensionsOpen(!dimensionsOpen);
//                     setRoomTypeOpen(false);
//                   }}
//                   className={`w-full p-3 rounded-xl border transition-all duration-200 flex items-center justify-between ${
//                     roomDimensions
//                       ? 'border-[#e48b53] bg-[#e48b53]/5'
//                       : 'border-gray-200 hover:border-[#e48b53]'
//                   } ${dimensionsOpen ? 'border-[#e48b53] shadow-sm' : ''}`}
//                 >
//                   <div className="flex items-center gap-2">
//                     {roomDimensions ? (
//                       <>
//                         <div className="p-1.5 bg-white rounded-lg border border-gray-200">
//                           <Ruler className="w-4 h-4 text-[#e48b53]" />
//                         </div>
//                         <span className="font-medium text-sm text-[#042939]">
//                           {roomDimensions === 'custom' && customDimensions 
//                             ? `${customDimensions} ft`
//                             : getSelectedDimension()?.label || 'Select dimensions'
//                           }
//                         </span>
//                       </>
//                     ) : (
//                       <span className="text-[#042939]/60 text-sm">Dimensions (optional)</span>
//                     )}
//                   </div>
//                   <ChevronDown 
//                     className={`w-4 h-4 text-[#042939]/40 transition-transform duration-200 ${
//                       dimensionsOpen ? 'rotate-180' : ''
//                     }`}
//                   />
//                 </button>

//                 {dimensionsOpen && (
//                   <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-56 overflow-y-auto">
//                     {/* Predefined dimensions */}
//                     {dimensions.map((dim) => (
//                       <button
//                         key={dim.value}
//                         onClick={() => {
//                           if (dim.value === 'custom') {
//                             setRoomDimensions('custom');
//                             setDimensionsOpen(false);
//                           } else {
//                             setRoomDimensions(dim.value);
//                             setDimensionsOpen(false);
//                           }
//                         }}
//                         className={`w-full p-3 text-left transition-colors duration-150 flex items-center justify-between hover:bg-gray-50 ${
//                           roomDimensions === dim.value
//                             ? 'bg-[#e48b53]/5'
//                             : 'text-[#042939]'
//                         } first:rounded-t-xl`}
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className={`p-2 rounded-lg border ${roomDimensions === dim.value ? 'border-[#e48b53] bg-white' : 'border-gray-200 bg-gray-50'}`}>
//                             <Ruler className="w-4 h-4 text-[#e48b53]" />
//                           </div>
//                           <div>
//                             <div className="font-medium text-sm">{dim.label}</div>
//                             <div className="text-xs text-[#042939]/60">{dim.desc}</div>
//                           </div>
//                         </div>
//                         {roomDimensions === dim.value && (
//                           <Check className="w-4 h-4 text-[#e48b53]" />
//                         )}
//                       </button>
//                     ))}
                    
//                     {/* Custom dimension input */}
//                     <div className="p-3 border-t border-gray-100">
//                       <div className="flex items-center gap-2">
//                         <Ruler className="w-4 h-4 text-[#e48b53]" />
//                         <div className="flex-1">
//                           <label className="block text-xs font-medium text-[#042939] mb-1">
//                             Enter custom dimensions
//                           </label>
//                           <div className="flex gap-2">
//                             <input
//                               type="text"
//                               placeholder="e.g., 15x20"
//                               value={customDimensions}
//                               onChange={handleCustomDimensionInput}
//                               className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#e48b53]"
//                               onClick={(e) => e.stopPropagation()}
//                             />
//                             <span className="px-2 py-2 bg-gray-100 text-gray-600 text-xs rounded-lg whitespace-nowrap">
//                               ft
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Selected Details Summary - Compact */}
//             {(roomType || roomDimensions) && (
//               <div className="p-3 bg-[#e48b53]/5 rounded-xl border border-[#e48b53]/20">
//                 <div className="flex flex-wrap items-center gap-2">
//                   <span className="text-xs font-medium text-[#042939]">Selected:</span>
//                   {roomType && (
//                     <span className="inline-flex items-center gap-2 px-2 py-1.5 bg-white rounded-lg border border-[#e48b53]/30 text-xs font-medium text-[#042939]">
//                       {(() => {
//                         const Icon = getRoomTypeIcon(roomType);
//                         const room = getSelectedRoomType();
//                         return <Icon className={`w-3 h-3 ${room?.color}`} />;
//                       })()}
//                       {getRoomTypeLabel(roomType)}
//                     </span>
//                   )}
//                   {roomDimensions && roomDimensions !== 'custom' && (
//                     <span className="inline-flex items-center gap-2 px-2 py-1.5 bg-white rounded-lg border border-[#e48b53]/30 text-xs font-medium text-[#042939]">
//                       <Ruler className="w-3 h-3 text-[#e48b53]" />
//                       {getSelectedDimension()?.label}
//                     </span>
//                   )}
//                   {roomDimensions === 'custom' && customDimensions && (
//                     <span className="inline-flex items-center gap-2 px-2 py-1.5 bg-white rounded-lg border border-[#e48b53]/30 text-xs font-medium text-[#042939]">
//                       <Ruler className="w-3 h-3 text-[#e48b53]" />
//                       {customDimensions} ft
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Image Upload Section - Always visible */}
//           <div className="space-y-3">
//             {/* Upload Error Display */}
//             {uploadError && (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//                 <div className="flex items-center gap-2">
//                   <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
//                     <X className="w-3 h-3 text-white" />
//                   </div>
//                   <p className="text-red-700 text-sm">{uploadError}</p>
//                 </div>
//               </div>
//             )}

//             {/* Upload Area - Shows upload UI or preview based on state */}
//             <div className="space-y-3">
//               {!previewImage ? (
//                 // Upload Interface (when no image uploaded)
//                 <div 
//                   onClick={handleUploadClick}
//                   onDragOver={handleDragOver}
//                   onDrop={handleDrop}
//                   className={`border-2 border-dashed rounded-xl p-4 transition-all duration-200 ${
//                     isUploading 
//                       ? 'opacity-50 cursor-not-allowed border-gray-300 bg-gray-50' 
//                       : !roomType
//                       ? 'opacity-50 cursor-not-allowed border-gray-300 bg-gray-50'
//                       : 'border-gray-300 cursor-pointer bg-white hover:border-[#e48b53] hover:bg-[#e48b53]/3'
//                   }`}
//                 >
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
//                     onChange={handleFileInputChange}
//                     disabled={isUploading || !roomType}
//                     className="hidden"
//                   />
//                   <div className="flex flex-col items-center justify-center space-y-2">
//                     {isUploading ? (
//                       <div className="w-12 h-12 bg-[#e48b53]/10 rounded-full flex items-center justify-center">
//                         <Loader2 className="w-6 h-6 text-[#e48b53] animate-spin" />
//                       </div>
//                     ) : (
//                       <div className="w-12 h-12 bg-gradient-to-br from-[#e48b53]/20 to-orange-500/20 rounded-full flex items-center justify-center">
//                         <Upload className="w-6 h-6 text-[#e48b53]" />
//                       </div>
//                     )}
//                     <div className="text-center">
//                       <p className="text-sm font-medium text-[#042939]">
//                         {isUploading 
//                           ? 'Uploading...' 
//                           : !roomType
//                           ? 'Select room type to upload'
//                           : 'Click to upload or drag image here'
//                         }
//                       </p>
//                       <p className="text-xs text-[#042939]/60 mt-1">
//                         {isUploading 
//                           ? 'Processing your image' 
//                           : !roomType
//                           ? 'Choose a room type first'
//                           : 'JPEG, PNG, WEBP, HEIC • Max 20MB'
//                         }
//                       </p>
//                     </div>
//                     {!isUploading && roomType && (
//                       <div className="flex items-center gap-1 text-xs text-[#042939]/60">
//                         <span className="px-2 py-1 bg-gray-100 rounded">Supported formats</span>
//                         <span className="px-2 py-1 bg-gray-100 rounded">Max 20MB</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 // Image Preview (when image is uploaded)
//                 <div className="border-2 border-[#e48b53] rounded-xl overflow-hidden bg-white shadow-sm">
//                   {/* File Info Section */}
//                   <div className="p-3 border-b border-gray-200">
//                     <div className="flex items-start gap-3">
//                       <div className="w-10 h-10 bg-[#e48b53]/10 rounded-lg flex items-center justify-center flex-shrink-0">
//                         <FileImage className="w-5 h-5 text-[#e48b53]" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 mb-1">
//                           <span className="font-medium text-[#042939] text-sm truncate">
//                             {uploadedImage?.fileName}
//                           </span>
//                           <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-medium">
//                             {getFileExtension(uploadedImage?.fileName)}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
//                           <span>{formatFileSize(uploadedImage?.fileSize)}</span>
//                           <span>•</span>
//                           <span className="text-green-600 font-medium">Uploaded</span>
//                         </div>
//                         {(uploadedImage?.roomType || uploadedImage?.dimensions) && (
//                           <div className="flex items-center gap-1">
//                             {uploadedImage?.roomType && (
//                               <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200">
//                                 {(() => {
//                                   const Icon = getRoomTypeIcon(uploadedImage.roomType);
//                                   const room = roomTypes.find(rt => rt.value === uploadedImage.roomType);
//                                   return <Icon className={`w-3 h-3 ${room?.color}`} />;
//                                 })()}
//                                 {getRoomTypeLabel(uploadedImage.roomType)}
//                               </span>
//                             )}
//                             {uploadedImage?.dimensions && (
//                               <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded border border-green-200">
//                                 <Ruler className="w-3 h-3" />
//                                 {uploadedImage.dimensions}
//                               </span>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Image Preview - Now shows the actual image */}
//                   <div className="relative bg-gray-50">
//                     <div className="w-full h-48 flex items-center justify-center p-4">
//                       {previewImage ? (
//                         <img
//                           src={previewImage}
//                           alt="Uploaded room preview"
//                           className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
//                           onLoad={() => console.log('Image loaded successfully:', previewImage)}
//                           onError={(e) => {
//                             console.error('Failed to load image from:', previewImage);
//                             console.error('Image error details:', {
//                               src: e.target.src,
//                               naturalWidth: e.target.naturalWidth,
//                               naturalHeight: e.target.naturalHeight
//                             });
//                             e.target.style.display = 'none';
//                             const fallback = e.target.nextSibling;
//                             if (fallback) fallback.style.display = 'flex';
//                           }}
//                         />
//                       ) : null}
//                       {/* Fallback when image fails to load */}
//                       <div 
//                         className="hidden flex-col items-center justify-center text-center p-4"
//                         style={{ display: 'none' }}
//                       >
//                         <FileImage className="w-12 h-12 text-gray-400 mb-2" />
//                         <p className="text-sm text-gray-600 mb-1">Image preview not available</p>
//                         <p className="text-xs text-gray-500">File: {uploadedImage?.fileName}</p>
//                         <p className="text-xs text-gray-500 mt-1">URL: {previewImage}</p>
//                       </div>
//                     </div>
                    
//                     {/* Remove button */}
//                     <button
//                       onClick={handleRemoveImage}
//                       disabled={isUploading}
//                       className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow"
//                       aria-label="Remove image"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>

//                   {/* Action buttons */}
//                   <div className="p-3 bg-gray-50 border-t border-gray-200">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">
//                         Ready for AI analysis
//                       </span>
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={handleUploadClick}
//                           disabled={isUploading}
//                           className="text-sm text-[#e48b53] hover:text-[#d47b43] font-medium px-3 py-1.5 rounded-lg hover:bg-[#e48b53]/5"
//                         >
//                           Change Image
//                         </button>
//                       </div>
//                     </div>
//                     <input
//                       ref={fileInputRef}
//                       type="file"
//                       accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
//                       onChange={handleFileInputChange}
//                       disabled={isUploading}
//                       className="hidden"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       ) : (
//         /* For other packages: Show ONLY property type cards */
//         <>
//           <div className="text-center space-y-2">
//             <h2 className="text-xl font-bold text-[#042939]">
//               What type of home are we planning for?
//             </h2>
//             <p className="text-[#042939]/70 text-sm">
//               Choose the closest option — you can always adjust later.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             {propertyTypes.map((type) => {
//               const Icon = type.icon;
//               const isSelected = selectedType === type.id;

//               return (
//                 <div
//                   key={type.id}
//                   onClick={() => onSelectType(type.id)}
//                   className={`relative cursor-pointer transition-all duration-200 p-4 rounded-xl border-2 ${
//                     isSelected
//                       ? "border-[#e48b53] bg-[#e48b53]/5 shadow-sm"
//                       : "border-gray-200 hover:border-[#e48b53]/30"
//                   }`}
//                 >
//                   {isSelected && (
//                     <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#e48b53] rounded-full flex items-center justify-center shadow">
//                       <Check className="w-3 h-3 text-white" />
//                     </div>
//                   )}

//                   <div className={`p-3 rounded-lg bg-gradient-to-br ${type.color}`}>
//                     <div className="flex items-start gap-3">
//                       <div className={`p-2 rounded-lg bg-white/80 flex-shrink-0 ${
//                         isSelected ? "ring-2 ring-[#e48b53]" : ""
//                       }`}>
//                         <Icon className={`w-5 h-5 ${type.iconColor}`} />
//                       </div>
                      
//                       <div className="flex-1 space-y-1 min-w-0">
//                         <div>
//                           <h3 className="text-sm font-bold text-[#042939]">
//                             {type.title}
//                           </h3>
//                           <p className="text-xs text-[#042939]/70">
//                             {type.description}
//                           </p>
//                         </div>
                        
//                         <div className="space-y-1 pt-1">
//                           <div className="flex items-center gap-1">
//                             <div className="w-1 h-1 rounded-full bg-[#e48b53] flex-shrink-0" />
//                             <span className="text-xs font-medium text-[#042939]">
//                               {type.area}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <div className="w-1 h-1 rounded-full bg-[#e48b53] flex-shrink-0" />
//                             <span className="text-xs font-medium text-[#042939]">
//                               {type.rooms}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };


// src\app\lp3\components\wizard\Step1.js
'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Home, Building, Building2, LayoutGrid, Check, Upload, X, 
  Loader2, FileImage, Ruler, ChevronDown, Image,
  Sofa, Bed, Crown, CookingPot, Bath, UtensilsCrossed, BookOpen,
  Sunset, Square
} from "lucide-react";
import { uploadService } from '@/services/upload.service';

export const Step1 = ({ selectedType, onSelectType, selectedPackage, uploadedImage, onImageUpload }) => {
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [roomType, setRoomType] = useState('');
  const [roomDimensions, setRoomDimensions] = useState('');
  const [customDimensions, setCustomDimensions] = useState('');
  const [roomTypeOpen, setRoomTypeOpen] = useState(false);
  const [dimensionsOpen, setDimensionsOpen] = useState(false);
  
  const showUploadSection = selectedPackage === 499;
  
  // Get backend server URL from environment
  const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  // Room type options with Lucide icons
  const roomTypes = [
    { value: 'LIVING_ROOM', label: 'Living Room', icon: Sofa, desc: 'Main sitting area', color: 'text-blue-500' },
    { value: 'BEDROOM', label: 'Bedroom', icon: Bed, desc: 'Sleeping and relaxation', color: 'text-purple-500' },
    { value: 'MASTER_BEDROOM', label: 'Master Bedroom', icon: Crown, desc: 'Primary bedroom with ensuite', color: 'text-amber-500' },
    { value: 'KITCHEN', label: 'Kitchen', icon: CookingPot, desc: 'Cooking and dining area', color: 'text-orange-500' },
    { value: 'BATHROOM', label: 'Bathroom', icon: Bath, desc: 'Bathing and toilet area', color: 'text-cyan-500' },
    { value: 'DINING_ROOM', label: 'Dining Room', icon: UtensilsCrossed, desc: 'Formal dining space', color: 'text-emerald-500' },
    { value: 'STUDY_ROOM', label: 'Study Room', icon: BookOpen, desc: 'Office or study area', color: 'text-indigo-500' },
    { value: 'BALCONY', label: 'Balcony', icon: Sunset, desc: 'Outdoor/open space', color: 'text-pink-500' },
    { value: 'OTHER', label: 'Other', icon: Square, desc: 'Custom room type', color: 'text-gray-500' }
  ];

  // Dimension options
  const dimensions = [
    { value: '10x12', label: '10x12 ft', area: '120 sq ft', desc: 'Small room' },
    { value: '12x14', label: '12x14 ft', area: '168 sq ft', desc: 'Medium room' },
    { value: '14x16', label: '14x16 ft', area: '224 sq ft', desc: 'Large room' },
    { value: '16x20', label: '16x20 ft', area: '320 sq ft', desc: 'Extra large room' },
  ];

  // Sync preview image with prop - FIXED: Prepend backend URL
  useEffect(() => {
    if (uploadedImage && uploadedImage.url) {
      // Check if URL is relative or absolute
      let imageUrl = uploadedImage.url;
      
      // If URL starts with /, prepend backend URL
      if (imageUrl.startsWith('/')) {
        imageUrl = `${BACKEND_URL}${imageUrl}`;
      }
      // If URL doesn't have http:// or https://, prepend backend URL
      else if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        imageUrl = `${BACKEND_URL}/${imageUrl}`;
      }
      setPreviewImage(imageUrl);
    } else {
      setPreviewImage(null);
    }
  }, [uploadedImage, BACKEND_URL]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roomTypeOpen && !event.target.closest('.room-type-dropdown')) {
        setRoomTypeOpen(false);
      }
      if (dimensionsOpen && !event.target.closest('.dimensions-dropdown')) {
        setDimensionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [roomTypeOpen, dimensionsOpen]);

  const validateImage = (file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Please select a valid image file (JPEG, PNG, WEBP, HEIC)');
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      throw new Error('Image size should be less than 20MB');
    }

    return true;
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    // Validate room type selection
    if (!roomType) {
      setUploadError('Please select a room type first');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      validateImage(file);

      const formData = new FormData();
      formData.append('file', file);
      
      // Add room metadata
      if (roomType) {
        formData.append('roomType', roomType);
      }
      
      if (roomDimensions) {
        const finalDimensions = roomDimensions === 'custom' ? customDimensions : roomDimensions;
        formData.append('dimensions', finalDimensions);
      }

      // Use the public temporary upload endpoint
      const response = await uploadService.uploadTemporaryFile(formData);

      if (response.success) {
        
        // Build proper image URL
        let imageUrl = response.data.fileUrl;
        
        // If URL is relative, prepend backend URL
        if (imageUrl && imageUrl.startsWith('/')) {
          imageUrl = `${BACKEND_URL}${imageUrl}`;
        } else if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
          imageUrl = `${BACKEND_URL}/${imageUrl}`;
        }
        
        const imageData = {
          url: imageUrl, // Store the full URL
          fileName: file.name,
          temporaryId: response.data.temporaryId,
          fileSize: file.size,
          mimeType: file.type,
          lastModified: file.lastModified,
          roomType: roomType,
          dimensions: roomDimensions === 'custom' ? customDimensions : roomDimensions
        };
        
        setPreviewImage(imageUrl);
        onImageUpload(imageData);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload image. Please try again.');
      // Clear any existing preview on error
      setPreviewImage(null);
      onImageUpload(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };
  
  const handleRemoveImage = () => {
    setPreviewImage(null);
    setUploadError(null);
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleUploadClick = () => {
    if (!isUploading && roomType && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isUploading || !roomType) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      handleImageUpload(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileExtension = (fileName) => {
    return fileName?.split('.').pop()?.toUpperCase() || 'FILE';
  };

  const getRoomTypeLabel = (value) => {
    const room = roomTypes.find(rt => rt.value === value);
    return room ? room.label : '';
  };

  const getRoomTypeIcon = (value) => {
    const room = roomTypes.find(rt => rt.value === value);
    return room ? room.icon : Square;
  };

  const getSelectedRoomType = () => {
    return roomTypes.find(rt => rt.value === roomType);
  };

  const getSelectedDimension = () => {
    return dimensions.find(dim => dim.value === roomDimensions);
  };

  // Handle custom dimension input
  const handleCustomDimensionInput = (e) => {
    const value = e.target.value;
    setCustomDimensions(value);
    if (value.trim()) {
      setRoomDimensions('custom');
    }
  };
  
  const propertyTypes = [
    {
      id: "2bhk",
      icon: Home,
      title: "2BHK Interiors",
      description: "Perfect for small families",
      area: "900–1100 sq ft",
      rooms: "2 Bedrooms + Living",
      color: "from-blue-500/10 to-blue-500/5",
      iconColor: "text-blue-500",
      borderColor: "border-blue-500/20 hover:border-blue-500/50",
    },
    {
      id: "3bhk",
      icon: Building,
      title: "3BHK Interiors",
      description: "Ideal for growing families",
      area: "1200–1500 sq ft",
      rooms: "3 Bedrooms + Living",
      color: "from-[#e48b53]/10 to-[#e48b53]/5",
      iconColor: "text-[#e48b53]",
      borderColor: "border-[#e48b53]/20 hover:border-[#e48b53]/50",
    },
    {
      id: "4bhk",
      icon: Building2,
      title: "4BHK Interiors",
      description: "Designed for premium living",
      area: "1800+ sq ft",
      rooms: "4 Bedrooms + Living",
      color: "from-purple-500/10 to-purple-500/5",
      iconColor: "text-purple-500",
      borderColor: "border-purple-500/20 hover:border-purple-500/50",
    },
    {
      id: "other",
      icon: LayoutGrid,
      title: "Other Configuration",
      description: "Villa, Studio, or custom needs",
      area: "Variable",
      rooms: "Custom Layout",
      color: "from-orange-500/10 to-orange-500/5",
      iconColor: "text-orange-500",
      borderColor: "border-orange-500/20 hover:border-orange-500/50",
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-2">
      {/* For ₹499 package: Show compact room details + image upload */}
      {showUploadSection ? (
        <div className="space-y-4">
          {/* Header Section - More compact for mobile */}
          <div className="text-center pb-2">
            <div className="w-10 h-10 mx-auto bg-gradient-to-br from-[#e48b53] to-orange-500 rounded-xl flex items-center justify-center shadow-sm mb-2">
              <Image className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-[#042939]">
              Upload Room Image
            </h2>
            <p className="text-[#042939]/70 text-xs mt-1">
              Add room details and upload a photo
            </p>
          </div>

          {/* Compact Room Details - Vertical layout on mobile */}
          <div className="space-y-3">
            <div className="space-y-3">
              {/* Room Type Dropdown */}
              <div className="room-type-dropdown relative">
                <label className="block text-xs font-semibold text-[#042939] mb-1 ml-1">
                  Room Type *
                </label>
                <button
                  onClick={() => {
                    setRoomTypeOpen(!roomTypeOpen);
                    setDimensionsOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                    roomType
                      ? 'border-[#e48b53] bg-[#e48b53]/5'
                      : 'border-gray-200 hover:border-[#e48b53]'
                  } ${roomTypeOpen ? 'border-[#e48b53] shadow-sm' : ''}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {roomType ? (
                      <>
                        <div className="p-1.5 bg-white rounded-lg border border-gray-200 flex-shrink-0">
                          {(() => {
                            const Icon = getRoomTypeIcon(roomType);
                            const room = getSelectedRoomType();
                            return <Icon className={`w-4 h-4 ${room?.color}`} />;
                          })()}
                        </div>
                        <span className="font-medium text-sm text-[#042939] truncate">
                          {getRoomTypeLabel(roomType)}
                        </span>
                      </>
                    ) : (
                      <span className="text-[#042939]/60 text-sm">Select room type</span>
                    )}
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 text-[#042939]/40 transition-transform duration-200 flex-shrink-0 ${
                      roomTypeOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {roomTypeOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                    {roomTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          onClick={() => {
                            setRoomType(type.value);
                            setRoomTypeOpen(false);
                          }}
                          className={`w-full p-3 text-left transition-colors duration-150 flex items-center gap-3 hover:bg-gray-50 ${
                            roomType === type.value
                              ? 'bg-[#e48b53]/5'
                              : 'text-[#042939]'
                          } first:rounded-t-xl last:rounded-b-xl`}
                        >
                          <div className={`p-2 rounded-lg border ${roomType === type.value ? 'border-[#e48b53] bg-white' : 'border-gray-200 bg-gray-50'}`}>
                            <Icon className={`w-4 h-4 ${type.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{type.label}</div>
                            <div className="text-xs text-[#042939]/60 truncate">{type.desc}</div>
                          </div>
                          {roomType === type.value && (
                            <Check className="w-4 h-4 text-[#e48b53] flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Room Dimensions Dropdown */}
              <div className="dimensions-dropdown relative">
                <label className="block text-xs font-semibold text-[#042939] mb-1 ml-1">
                  Room Dimensions
                </label>
                <button
                  onClick={() => {
                    setDimensionsOpen(!dimensionsOpen);
                    setRoomTypeOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                    roomDimensions
                      ? 'border-[#e48b53] bg-[#e48b53]/5'
                      : 'border-gray-200 hover:border-[#e48b53]'
                  } ${dimensionsOpen ? 'border-[#e48b53] shadow-sm' : ''}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {roomDimensions ? (
                      <>
                        <div className="p-1.5 bg-white rounded-lg border border-gray-200 flex-shrink-0">
                          <Ruler className="w-4 h-4 text-[#e48b53]" />
                        </div>
                        <span className="font-medium text-sm text-[#042939] truncate">
                          {roomDimensions === 'custom' && customDimensions 
                            ? `${customDimensions} ft`
                            : getSelectedDimension()?.label || 'Select dimensions'
                          }
                        </span>
                      </>
                    ) : (
                      <span className="text-[#042939]/60 text-sm">Dimensions (optional)</span>
                    )}
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 text-[#042939]/40 transition-transform duration-200 flex-shrink-0 ${
                      dimensionsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {dimensionsOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-56 overflow-y-auto">
                    {/* Predefined dimensions */}
                    {dimensions.map((dim) => (
                      <button
                        key={dim.value}
                        onClick={() => {
                          if (dim.value === 'custom') {
                            setRoomDimensions('custom');
                            setDimensionsOpen(false);
                          } else {
                            setRoomDimensions(dim.value);
                            setDimensionsOpen(false);
                          }
                        }}
                        className={`w-full p-3 text-left transition-colors duration-150 flex items-center justify-between hover:bg-gray-50 ${
                          roomDimensions === dim.value
                            ? 'bg-[#e48b53]/5'
                            : 'text-[#042939]'
                        } first:rounded-t-xl`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-2 rounded-lg border ${roomDimensions === dim.value ? 'border-[#e48b53] bg-white' : 'border-gray-200 bg-gray-50'}`}>
                            <Ruler className="w-4 h-4 text-[#e48b53]" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate">{dim.label}</div>
                            <div className="text-xs text-[#042939]/60 truncate">{dim.desc}</div>
                          </div>
                        </div>
                        {roomDimensions === dim.value && (
                          <Check className="w-4 h-4 text-[#e48b53] flex-shrink-0" />
                        )}
                      </button>
                    ))}
                    
                    {/* Custom dimension input */}
                    <div className="p-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-[#e48b53] flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <label className="block text-xs font-medium text-[#042939] mb-1">
                            Enter custom dimensions
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="e.g., 15x20"
                              value={customDimensions}
                              onChange={handleCustomDimensionInput}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#e48b53] min-w-0"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="px-2 py-2 bg-gray-100 text-gray-600 text-xs rounded-lg whitespace-nowrap flex-shrink-0">
                              ft
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Selected Details Summary - Even more compact */}
            {(roomType || roomDimensions) && (
              <div className="p-2.5 bg-[#e48b53]/5 rounded-xl border border-[#e48b53]/20">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-medium text-[#042939] text-nowrap">Selected:</span>
                  {roomType && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-[#e48b53]/30 text-xs font-medium text-[#042939] max-w-[45%] truncate">
                      {(() => {
                        const Icon = getRoomTypeIcon(roomType);
                        const room = getSelectedRoomType();
                        return <Icon className={`w-3 h-3 flex-shrink-0 ${room?.color}`} />;
                      })()}
                      <span className="truncate">{getRoomTypeLabel(roomType)}</span>
                    </span>
                  )}
                  {roomDimensions && roomDimensions !== 'custom' && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-[#e48b53]/30 text-xs font-medium text-[#042939] max-w-[45%] truncate">
                      <Ruler className="w-3 h-3 flex-shrink-0 text-[#e48b53]" />
                      <span className="truncate">{getSelectedDimension()?.label}</span>
                    </span>
                  )}
                  {roomDimensions === 'custom' && customDimensions && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-[#e48b53]/30 text-xs font-medium text-[#042939] max-w-[45%] truncate">
                      <Ruler className="w-3 h-3 flex-shrink-0 text-[#e48b53]" />
                      <span className="truncate">{customDimensions} ft</span>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Image Upload Section - Optimized for mobile */}
          <div className="space-y-3 pt-1">
            {/* Upload Error Display */}
            {uploadError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-red-700 text-sm flex-1">{uploadError}</p>
                </div>
              </div>
            )}

            {/* Upload Area - Shows upload UI or preview based on state */}
            <div className="space-y-3">
              {!previewImage ? (
                // Upload Interface (when no image uploaded)
                <div 
                  onClick={handleUploadClick}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-3 transition-all duration-200 ${
                    isUploading 
                      ? 'opacity-50 cursor-not-allowed border-gray-300 bg-gray-50' 
                      : !roomType
                      ? 'opacity-50 cursor-not-allowed border-gray-300 bg-gray-50'
                      : 'border-gray-300 cursor-pointer bg-white hover:border-[#e48b53] hover:bg-[#e48b53]/3'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
                    onChange={handleFileInputChange}
                    disabled={isUploading || !roomType}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    {isUploading ? (
                      <div className="w-10 h-10 bg-[#e48b53]/10 rounded-full flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-[#e48b53] animate-spin" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-[#e48b53]/20 to-orange-500/20 rounded-full flex items-center justify-center">
                        <Upload className="w-5 h-5 text-[#e48b53]" />
                      </div>
                    )}
                    <div className="text-center">
                      <p className="text-sm font-medium text-[#042939]">
                        {isUploading 
                          ? 'Uploading...' 
                          : !roomType
                          ? 'Select room type to upload'
                          : 'Click to upload or drag image here'
                        }
                      </p>
                      <p className="text-xs text-[#042939]/60 mt-1">
                        {isUploading 
                          ? 'Processing your image' 
                          : !roomType
                          ? 'Choose a room type first'
                          : 'JPEG, PNG, WEBP, HEIC • Max 20MB'
                        }
                      </p>
                    </div>
                    {!isUploading && roomType && (
                      <div className="flex flex-wrap items-center justify-center gap-1 text-xs text-[#042939]/60">
                        <span className="px-2 py-1 bg-gray-100 rounded">Supported formats</span>
                        <span className="px-2 py-1 bg-gray-100 rounded">Max 20MB</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Image Preview (when image is uploaded) - More compact
                <div className="border-2 border-[#e48b53] rounded-xl overflow-hidden bg-white shadow-sm">
                  {/* File Info Section */}
                  <div className="p-3 border-b border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[#e48b53]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileImage className="w-4 h-4 text-[#e48b53]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="font-medium text-[#042939] text-sm truncate">
                            {uploadedImage?.fileName}
                          </span>
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-medium flex-shrink-0">
                            {getFileExtension(uploadedImage?.fileName)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 flex-wrap">
                          <span>{formatFileSize(uploadedImage?.fileSize)}</span>
                          <span>•</span>
                          <span className="text-green-600 font-medium">Uploaded</span>
                        </div>
                        {(uploadedImage?.roomType || uploadedImage?.dimensions) && (
                          <div className="flex flex-wrap items-center gap-1">
                            {uploadedImage?.roomType && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200 max-w-[45%] truncate">
                                {(() => {
                                  const Icon = getRoomTypeIcon(uploadedImage.roomType);
                                  const room = roomTypes.find(rt => rt.value === uploadedImage.roomType);
                                  return <Icon className={`w-3 h-3 flex-shrink-0 ${room?.color}`} />;
                                })()}
                                <span className="truncate">{getRoomTypeLabel(uploadedImage.roomType)}</span>
                              </span>
                            )}
                            {uploadedImage?.dimensions && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded border border-green-200 max-w-[45%] truncate">
                                <Ruler className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{uploadedImage.dimensions}</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Image Preview - Compact for mobile */}
                  <div className="relative bg-gray-50">
                    <div className="w-full h-40 flex items-center justify-center p-3">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Uploaded room preview"
                          className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                          onLoad={() => console.log('Image loaded successfully:', previewImage)}
                          onError={(e) => {
                            console.error('Failed to load image from:', previewImage);
                            e.target.style.display = 'none';
                            const fallback = e.target.nextSibling;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      {/* Fallback when image fails to load */}
                      <div 
                        className="hidden flex-col items-center justify-center text-center p-3"
                        style={{ display: 'none' }}
                      >
                        <FileImage className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-600">Image preview not available</p>
                      </div>
                    </div>
                    
                    {/* Remove button */}
                    <button
                      onClick={handleRemoveImage}
                      disabled={isUploading}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow"
                      aria-label="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Action buttons - More compact */}
                  <div className="p-2.5 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">
                        Ready for analysis
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={handleUploadClick}
                          disabled={isUploading}
                          className="text-sm text-[#e48b53] hover:text-[#d47b43] font-medium px-2.5 py-1 rounded-lg hover:bg-[#e48b53]/5"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
                      onChange={handleFileInputChange}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* For other packages: Show ONLY property type cards - Optimized for mobile */
        <>
          <div className="text-center space-y-2 pb-2">
            <h2 className="text-lg font-bold text-[#042939]">
              What type of home are we planning for?
            </h2>
            <p className="text-[#042939]/70 text-xs">
              Choose the closest option — you can always adjust later.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {propertyTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;

              return (
                <div
                  key={type.id}
                  onClick={() => onSelectType(type.id)}
                  className={`relative cursor-pointer transition-all duration-200 p-3 rounded-xl border-2 ${
                    isSelected
                      ? "border-[#e48b53] bg-[#e48b53]/5 shadow-sm"
                      : "border-gray-200 hover:border-[#e48b53]/30"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#e48b53] rounded-full flex items-center justify-center shadow">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}

                  <div className={`p-2.5 rounded-lg bg-gradient-to-br ${type.color}`}>
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1.5 rounded-lg bg-white/80 flex-shrink-0 ${
                        isSelected ? "ring-1 ring-[#e48b53]" : ""
                      }`}>
                        <Icon className={`w-4 h-4 ${type.iconColor}`} />
                      </div>
                      
                      <div className="flex-1 space-y-1 min-w-0">
                        <div>
                          <h3 className="text-sm font-bold text-[#042939] truncate">
                            {type.title}
                          </h3>
                          <p className="text-xs text-[#042939]/70 line-clamp-1">
                            {type.description}
                          </p>
                        </div>
                        
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-[#e48b53] flex-shrink-0" />
                            <span className="text-xs font-medium text-[#042939] truncate">
                              {type.area}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-[#e48b53] flex-shrink-0" />
                            <span className="text-xs font-medium text-[#042939] truncate">
                              {type.rooms}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};