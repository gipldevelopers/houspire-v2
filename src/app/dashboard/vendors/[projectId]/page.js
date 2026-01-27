// // src/app/dashboard/projects/[projectId]/vendors/page.js
// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { 
//   Building, 
//   MapPin, 
//   Star, 
//   Phone, 
//   Mail, 
//   CheckCircle, 
//   Users, 
//   ExternalLink,
//   Calendar,
//   MessageCircle,
//   ThumbsUp,
//   ThumbsDown,
//   Filter,
//   Search,
//   Shield,
//   Award,
//   Clock,
//   Eye,
//   UserCheck
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Progress } from "@/components/ui/progress";
// import { Separator } from "@/components/ui/separator";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import api from "@/lib/axios";

// export default function ProjectVendorsPage() {
//   const params = useParams();
//   const projectId = params.projectId;
  
//   const [projectData, setProjectData] = useState(null);
//   const [vendors, setVendors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [selectedStatus, setSelectedStatus] = useState("all");

//   useEffect(() => {
//     const loadVendors = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get(`/projects-vendor/user/projects/${projectId}`);
        
//         if (response.data.success) {
//           const projectData = response.data.data;
//           setProjectData(projectData);
          
//           // Flatten all vendors from different status groups with their status
//           const allVendors = [];
//           if (projectData.vendors) {
//             Object.entries(projectData.vendors).forEach(([status, statusGroup]) => {
//               if (Array.isArray(statusGroup)) {
//                 statusGroup.forEach(vendor => {
//                   allVendors.push({
//                     ...vendor,
//                     assignmentStatus: status
//                   });
//                 });
//               }
//             });
//           }
//           setVendors(allVendors);
//         }
//       } catch (err) {
//         console.error("Error loading vendors:", err);
//         setError(err.response?.data?.message || "Failed to load vendors");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (projectId) {
//       loadVendors();
//     }
//   }, [projectId]);

//   // Filter vendors based on search and filters
//   const filteredVendors = vendors.filter(vendor => {
//     const matchesSearch = 
//       vendor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       vendor.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       vendor.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       vendor.categories?.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
    
//     const matchesStatus = selectedStatus === "all" || vendor.assignmentStatus === selectedStatus;
    
//     return matchesSearch && matchesStatus;
//   });

//   // Get unique categories
//   const categories = [...new Set(vendors.flatMap(vendor => vendor.categories || []))];

//   if (loading) {
//     return <VendorsSkeleton />;
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-background p-6">
//         <div className="max-w-6xl mx-auto">
//           <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
//             <CardContent className="p-8 text-center">
//               <Users className="w-16 h-16 text-red-400 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
//                 Failed to Load Vendors
//               </h3>
//               <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
//               <Button 
//                 onClick={() => window.location.reload()} 
//                 variant="outline"
//                 className="border-red-300 text-red-700 hover:bg-red-50"
//               >
//                 Try Again
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <TooltipProvider>
//       <div className="min-h-screen bg-background p-6">
//         <div className="max-w-6xl mx-auto">
//           {/* Header */}
//           <div className="mb-8">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h1 className="text-3xl font-bold text-foreground mb-2">
//                   Project Vendors
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   {projectData?.title} • {vendors.length} professional vendor{vendors.length !== 1 ? 's' : ''}
//                 </p>
//               </div>
//               <Badge variant="outline" className="px-3 py-1 text-sm">
//                 <UserCheck className="w-4 h-4 mr-2" />
//                 Vendor List Sent
//               </Badge>
//             </div>

//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//               <StatCard
//                 title="Total Vendors"
//                 value={vendors.length}
//                 icon={<Users className="w-5 h-5" />}
//                 color="blue"
//               />
//               <StatCard
//                 title="Verified"
//                 value={vendors.filter(v => v.isVerified).length}
//                 icon={<Shield className="w-5 h-5" />}
//                 color="green"
//               />
//               {/* <StatCard
//                 title="Pending Response"
//                 value={vendors.filter(v => v.assignmentStatus === 'PENDING').length}
//                 icon={<Clock className="w-5 h-5" />}
//                 color="amber"
//               />
//               <StatCard
//                 title="Categories"
//                 value={categories.length}
//                 icon={<Award className="w-5 h-5" />}
//                 color="purple"
//               /> */}
//             </div>
//           </div>

//           {/* Search and Filters */}
//           <Card className="mb-6">
//             <CardContent className="p-4">
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <div className="flex-1 relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//                   <Input
//                     placeholder="Search vendors by name, business, or category..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="pl-9"
//                   />
//                 </div>
//                 {/* <div className="flex gap-2">
//                   <select
//                     value={selectedStatus}
//                     onChange={(e) => setSelectedStatus(e.target.value)}
//                     className="px-3 py-2 border border-border rounded-md bg-background text-sm"
//                   >
//                     <option value="all">All Status</option>
//                     <option value="PENDING">Pending</option>
//                     <option value="SENT">Sent</option>
//                     <option value="VIEWED">Viewed</option>
//                     <option value="CONTACTED">Contacted</option>
//                     <option value="ACCEPTED">Accepted</option>
//                     <option value="REJECTED">Rejected</option>
//                     <option value="SHORTLISTED">Shortlisted</option>
//                     <option value="HIRED">Hired</option>
//                   </select>
//                 </div> */}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Vendors List */}
//           <div className="space-y-4">
//             {filteredVendors.length > 0 ? (
//               filteredVendors.map((vendor) => (
//                 <VendorCard key={vendor.id} vendor={vendor} />
//               ))
//             ) : (
//               <Card className="border-border text-center py-12">
//                 <CardContent>
//                   <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
//                   <h3 className="text-lg font-semibold text-foreground mb-2">
//                     No Vendors Found
//                   </h3>
//                   <p className="text-muted-foreground">
//                     {searchQuery || selectedStatus !== "all" 
//                       ? "Try adjusting your search or filters" 
//                       : "No vendors have been assigned to this project yet."}
//                   </p>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>
//     </TooltipProvider>
//   );
// }

// function StatCard({ title, value, icon, color }) {
//   const colorClasses = {
//     blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
//     green: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300 border-green-200 dark:border-green-800",
//     amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
//     purple: "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300 border-purple-200 dark:border-purple-800",
//   };

//   return (
//     <Card className={`border ${colorClasses[color]}`}>
//       <CardContent className="p-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm font-medium opacity-80">{title}</p>
//             <p className="text-2xl font-bold">{value}</p>
//           </div>
//           <div className={`p-2 rounded-lg ${colorClasses[color].split(' ')[0]} opacity-80`}>
//             {icon}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function VendorCard({ vendor }) {
//   const [expanded, setExpanded] = useState(false);

//   const statusConfig = {
//     PENDING: {
//       label: "Pending Response",
//       color: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-300 dark:border-yellow-800",
//       icon: <Clock className="w-3 h-3" />
//     },
//     SENT: {
//       label: "Invitation Sent",
//       color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800",
//       icon: <Mail className="w-3 h-3" />
//     },
//     VIEWED: {
//       label: "Profile Viewed",
//       color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800",
//       icon: <Eye className="w-3 h-3" />
//     },
//     CONTACTED: {
//       label: "Contacted",
//       color: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-300 dark:border-cyan-800",
//       icon: <MessageCircle className="w-3 h-3" />
//     },
//     ACCEPTED: {
//       label: "Accepted",
//       color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800",
//       icon: <ThumbsUp className="w-3 h-3" />
//     },
//     REJECTED: {
//       label: "Declined",
//       color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800",
//       icon: <ThumbsDown className="w-3 h-3" />
//     },
//     SHORTLISTED: {
//       label: "Shortlisted",
//       color: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800",
//       icon: <Award className="w-3 h-3" />
//     },
//     HIRED: {
//       label: "Hired",
//       color: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800",
//       icon: <CheckCircle className="w-3 h-3" />
//     },
//   };

//   const status = statusConfig[vendor.assignmentStatus] || statusConfig.PENDING;

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   return (
//     <Card className="border-border hover:shadow-lg transition-all duration-300 group">
//       <CardContent className="p-6">
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex items-start gap-4 flex-1">
//             {/* Vendor Logo/Icon */}
//             <div className="relative">
//               <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
//                 <Building className="w-6 h-6 text-primary" />
//               </div>
//               {vendor.isVerified && (
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
//                       <Shield className="w-3 h-3 text-white" />
//                     </div>
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     <p>Verified Vendor</p>
//                   </TooltipContent>
//                 </Tooltip>
//               )}
//             </div>
            
//             {/* Vendor Info */}
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2 mb-1">
//                 <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
//                   {vendor.businessName || vendor.name}
//                 </h3>
//                 {vendor.isVerified && (
//                   <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
//                 )}
//               </div>
              
//               {vendor.specialization && (
//                 <p className="text-muted-foreground mb-3 font-medium">
//                   {vendor.specialization}
//                 </p>
//               )}
              
//               <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
//                 {vendor.city && (
//                   <div className="flex items-center gap-1.5">
//                     <MapPin className="w-4 h-4" />
//                     <span>{vendor.city}{vendor.state && `, ${vendor.state}`}</span>
//                   </div>
//                 )}
                
//                 {vendor.rating > 0 && (
//                   <div className="flex items-center gap-1.5">
//                     <Star className="w-4 h-4 text-yellow-500 fill-current" />
//                     <span className="font-medium">{vendor.rating}</span>
//                     <span>({vendor.reviewCount || 0} reviews)</span>
//                   </div>
//                 )}

//                 {vendor.assignedAt && (
//                   <div className="flex items-center gap-1.5">
//                     <Calendar className="w-4 h-4" />
//                     <span>Assigned {formatDate(vendor.assignedAt)}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
          
//           {/* Status Badge */}
//           {/* <Badge className={`px-3 py-1.5 border ${status.color} flex items-center gap-1.5`}>
//             {status.icon}
//             {status.label}
//           </Badge> */}
//         </div>

//         {/* Address */}
//         {vendor.address && (
//           <div className="mb-4">
//             <p className="text-sm text-muted-foreground flex items-start gap-2">
//               <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
//               <span>{vendor.address}</span>
//             </p>
//           </div>
//         )}

//         {/* Categories */}
//         {vendor.categories && vendor.categories.length > 0 && (
//           <div className="flex flex-wrap gap-2 mb-4">
//             {vendor.categories.map((category, index) => (
//               <Badge 
//                 key={category} 
//                 variant="secondary" 
//                 className="text-xs px-2 py-1 bg-secondary/50 hover:bg-secondary/70 transition-colors"
//               >
//                 {category}
//               </Badge>
//             ))}
//           </div>
//         )}

//         {/* Expandable Details */}
//         {expanded && (
//           <div className="mt-4 space-y-4 animate-in fade-in">
//             <Separator />
            
//             {/* Contact Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {(vendor.email || vendor.phone) && (
//                 <div>
//                   <h4 className="font-semibold text-sm mb-2 text-foreground">Contact Information</h4>
//                   <div className="space-y-2">
//                     {vendor.email && (
//                       <div className="flex items-center gap-2 text-sm">
//                         <Mail className="w-4 h-4 text-muted-foreground" />
//                         <a 
//                           href={`mailto:${vendor.email}`}
//                           className="text-primary hover:underline"
//                         >
//                           {vendor.email}
//                         </a>
//                       </div>
//                     )}
//                     {vendor.phone && (
//                       <div className="flex items-center gap-2 text-sm">
//                         <Phone className="w-4 h-4 text-muted-foreground" />
//                         <a 
//                           href={`tel:${vendor.phone}`}
//                           className="text-primary hover:underline"
//                         >
//                           {vendor.phone}
//                         </a>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Assignment Details */}
//               <div>
//                 <h4 className="font-semibold text-sm mb-2 text-foreground">Assignment Details</h4>
//                 <div className="space-y-2 text-sm text-muted-foreground">
//                   {/* <div>Status: <span className="font-medium text-foreground">{status.label}</span></div> */}
//                   {vendor.assignedAt && (
//                     <div>Assigned: {formatDate(vendor.assignedAt)}</div>
//                   )}
//                   {/* {vendor.respondedAt && (
//                     <div>Responded: {formatDate(vendor.respondedAt)}</div>
//                   )} */}
//                 </div>
//               </div>
//             </div>

//             {/* Client Feedback */}
//             {(vendor.clientFeedback || vendor.clientRating) && (
//               <div>
//                 <h4 className="font-semibold text-sm mb-2 text-foreground">Your Feedback</h4>
//                 <div className="flex items-center gap-4">
//                   {vendor.clientRating && (
//                     <div className="flex items-center gap-1">
//                       <Star className="w-4 h-4 text-yellow-500 fill-current" />
//                       <span className="font-medium">{vendor.clientRating}/5</span>
//                     </div>
//                   )}
//                   {vendor.clientFeedback && (
//                     <p className="text-sm text-muted-foreground italic">"{vendor.clientFeedback}"</p>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Actions */}
//         <div className="flex items-center justify-between pt-4 border-t border-border">
//           <div className="flex items-center gap-4 text-sm text-muted-foreground">
//             {vendor.website && (
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <a 
//                     href={vendor.website} 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-1 hover:text-primary transition-colors"
//                   >
//                     <ExternalLink className="w-4 h-4" />
//                     Website
//                   </a>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>Visit vendor website</p>
//                 </TooltipContent>
//               </Tooltip>
//             )}
//           </div>
          
//           <div className="flex gap-2">
//             <Button 
//               variant="ghost" 
//               size="sm"
//               onClick={() => setExpanded(!expanded)}
//             >
//               {expanded ? "Show Less" : "View Details"}
//             </Button>
            
//             {vendor.phone && (
//               <Button variant="outline" size="sm" asChild>
//                 <a href={`tel:${vendor.phone}`}>
//                   <Phone className="w-4 h-4 mr-2" />
//                   Call
//                 </a>
//               </Button>
//             )}
            
//             {vendor.email && (
//               <Button size="sm" asChild>
//                 <a href={`mailto:${vendor.email}`}>
//                   <Mail className="w-4 h-4 mr-2" />
//                   Contact
//                 </a>
//               </Button>
//             )}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function VendorsSkeleton() {
//   return (
//     <div className="min-h-screen bg-background p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header Skeleton */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <Skeleton className="h-8 w-64 bg-muted mb-2" />
//               <Skeleton className="h-4 w-48 bg-muted" />
//             </div>
//             <Skeleton className="h-6 w-32 bg-muted rounded-full" />
//           </div>

//           {/* Stats Skeleton */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//             {[...Array(4)].map((_, i) => (
//               <Card key={i}>
//                 <CardContent className="p-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Skeleton className="h-4 w-20 bg-muted mb-2" />
//                       <Skeleton className="h-6 w-12 bg-muted" />
//                     </div>
//                     <Skeleton className="w-10 h-10 bg-muted rounded-lg" />
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>

//         {/* Search Skeleton */}
//         <Card className="mb-6">
//           <CardContent className="p-4">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <Skeleton className="h-10 flex-1 bg-muted" />
//               <Skeleton className="h-10 w-32 bg-muted" />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Vendor Cards Skeleton */}
//         <div className="space-y-4">
//           {[...Array(3)].map((_, i) => (
//             <Card key={i}>
//               <CardContent className="p-6">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex items-start gap-4 flex-1">
//                     <Skeleton className="w-14 h-14 bg-muted rounded-xl" />
//                     <div className="flex-1 space-y-2">
//                       <Skeleton className="h-6 w-48 bg-muted" />
//                       <Skeleton className="h-4 w-32 bg-muted" />
//                       <div className="flex gap-4">
//                         <Skeleton className="h-4 w-24 bg-muted" />
//                         <Skeleton className="h-4 w-20 bg-muted" />
//                         <Skeleton className="h-4 w-28 bg-muted" />
//                       </div>
//                     </div>
//                   </div>
//                   <Skeleton className="h-6 w-32 bg-muted rounded-full" />
//                 </div>
//                 <Skeleton className="h-4 w-full bg-muted mb-4" />
//                 <div className="flex gap-2 mb-4">
//                   <Skeleton className="h-6 w-16 bg-muted rounded-full" />
//                   <Skeleton className="h-6 w-20 bg-muted rounded-full" />
//                   <Skeleton className="h-6 w-14 bg-muted rounded-full" />
//                 </div>
//                 <div className="flex items-center justify-between pt-4 border-t border-border">
//                   <Skeleton className="h-4 w-24 bg-muted" />
//                   <div className="flex gap-2">
//                     <Skeleton className="h-9 w-24 bg-muted" />
//                     <Skeleton className="h-9 w-20 bg-muted" />
//                     <Skeleton className="h-9 w-20 bg-muted" />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// src/app/dashboard/projects/[projectId]/vendors/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Building, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  CheckCircle, 
  Users, 
  ExternalLink,
  Calendar,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Search,
  Shield,
  Award,
  Clock,
  Eye,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Menu,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import api from "@/lib/axios";

export default function ProjectVendorsPage() {
  const params = useParams();
  const projectId = params.projectId;
  
  const [projectData, setProjectData] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const loadVendors = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/projects-vendor/user/projects/${projectId}`);
        
        if (response.data.success) {
          const projectData = response.data.data;
          setProjectData(projectData);
          
          // Flatten all vendors from different status groups with their status
          const allVendors = [];
          if (projectData.vendors) {
            Object.entries(projectData.vendors).forEach(([status, statusGroup]) => {
              if (Array.isArray(statusGroup)) {
                statusGroup.forEach(vendor => {
                  allVendors.push({
                    ...vendor,
                    assignmentStatus: status
                  });
                });
              }
            });
          }
          setVendors(allVendors);
        }
      } catch (err) {
        console.error("Error loading vendors:", err);
        setError(err.response?.data?.message || "Failed to load vendors");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadVendors();
    }
  }, [projectId]);

  // Filter vendors based on search and filters
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = 
      vendor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.categories?.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = selectedStatus === "all" || vendor.assignmentStatus === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get unique categories
  const categories = [...new Set(vendors.flatMap(vendor => vendor.categories || []))];

  // Status options for dropdown
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "PENDING", label: "Pending" },
    { value: "SENT", label: "Sent" },
    { value: "VIEWED", label: "Viewed" },
    { value: "CONTACTED", label: "Contacted" },
    { value: "ACCEPTED", label: "Accepted" },
    { value: "REJECTED", label: "Rejected" },
    { value: "SHORTLISTED", label: "Shortlisted" },
    { value: "HIRED", label: "Hired" },
  ];

  if (loading) {
    return <VendorsSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <CardContent className="p-6 sm:p-8 text-center">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
                Failed to Load Vendors
              </h3>
              <p className="text-sm sm:text-base text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50 text-sm sm:text-base"
                size="sm"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                  Project Vendors
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {projectData?.title} • {vendors.length} professional vendor{vendors.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm self-start sm:self-auto">
                <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Vendor List Sent
              </Badge>
            </div>

            {/* Stats Cards - Mobile horizontal scroll */}
            <div className="overflow-x-auto pb-2 -mx-4 sm:mx-0 sm:overflow-visible">
              <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 min-w-max sm:min-w-0 px-4 sm:px-0">
                <StatCard
                  title="Total Vendors"
                  value={vendors.length}
                  icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
                  color="blue"
                  compact
                />
                <StatCard
                  title="Verified"
                  value={vendors.filter(v => v.isVerified).length}
                  icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5" />}
                  color="green"
                  compact
                />
                <StatCard
                  title="Categories"
                  value={categories.length}
                  icon={<Award className="w-4 h-4 sm:w-5 sm:h-5" />}
                  color="purple"
                  compact
                />
                <StatCard
                  title="Avg. Rating"
                  value={vendors.length > 0 
                    ? (vendors.reduce((sum, v) => sum + (v.rating || 0), 0) / vendors.length).toFixed(1)
                    : "0.0"
                  }
                  icon={<Star className="w-4 h-4 sm:w-5 sm:h-5" />}
                  color="amber"
                  compact
                />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="mb-4 sm:mb-6">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3 sm:w-4 sm:h-4" />
                  <Input
                    placeholder="Search vendors by name, business, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 sm:pl-9 text-sm sm:text-base h-9 sm:h-10"
                  />
                </div>
                
                {/* Mobile Filters Button */}
                <div className="sm:hidden">
                  <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                        {selectedStatus !== "all" && (
                          <span className="ml-2 flex h-2 w-2 rounded-full bg-primary" />
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[70vh]">
                      <SheetHeader>
                        <SheetTitle>Filter Vendors</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Status</label>
                          <div className="grid grid-cols-2 gap-2">
                            {statusOptions.map((option) => (
                              <Button
                                key={option.value}
                                variant={selectedStatus === option.value ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  setSelectedStatus(option.value);
                                  setMobileFiltersOpen(false);
                                }}
                                className="justify-start"
                              >
                                {option.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          className="w-full mt-4"
                          onClick={() => {
                            setSelectedStatus("all");
                            setMobileFiltersOpen(false);
                          }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Desktop Status Filter */}
                <div className="hidden sm:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="min-w-[120px] sm:min-w-[140px]">
                        <Filter className="w-4 h-4 mr-2" />
                        {statusOptions.find(opt => opt.value === selectedStatus)?.label || "All Status"}
                        <ChevronDown className="ml-2 w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {statusOptions.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => setSelectedStatus(option.value)}
                          className={selectedStatus === option.value ? "bg-accent" : ""}
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSelectedStatus("all")}>
                        Clear Filter
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredVendors.length} of {vendors.length} vendors
              {selectedStatus !== "all" && ` (filtered)`}
            </p>
            {selectedStatus !== "all" && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedStatus("all")}
                className="text-xs"
              >
                Clear Filter
              </Button>
            )}
          </div>

          {/* Vendors List */}
          <div className="space-y-3 sm:space-y-4">
            {filteredVendors.length > 0 ? (
              filteredVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))
            ) : (
              <Card className="border-border text-center py-8 sm:py-12">
                <CardContent className="p-4 sm:p-6">
                  <Users className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4 opacity-50" />
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">
                    No Vendors Found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || selectedStatus !== "all" 
                      ? "Try adjusting your search or filters" 
                      : "No vendors have been assigned to this project yet."}
                  </p>
                  {(searchQuery || selectedStatus !== "all") && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedStatus("all");
                      }}
                    >
                      Clear Search & Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

function StatCard({ title, value, icon, color, compact = false }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    green: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300 border-green-200 dark:border-green-800",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    purple: "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  };

  return (
    <Card className={`border ${colorClasses[color]} ${compact ? 'min-w-[150px] sm:min-w-0' : ''}`}>
      <CardContent className={compact ? 'p-3' : 'p-4'}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`${compact ? 'text-xs' : 'text-sm'} font-medium opacity-80`}>{title}</p>
            <p className={`${compact ? 'text-xl' : 'text-2xl'} font-bold`}>{value}</p>
          </div>
          <div className={`p-1.5 sm:p-2 rounded-lg ${colorClasses[color].split(' ')[0]} opacity-80`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function VendorCard({ vendor }) {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const statusConfig = {
    PENDING: {
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-300 dark:border-yellow-800",
      icon: <Clock className="w-3 h-3" />
    },
    SENT: {
      label: "Sent",
      color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800",
      icon: <Mail className="w-3 h-3" />
    },
    VIEWED: {
      label: "Viewed",
      color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800",
      icon: <Eye className="w-3 h-3" />
    },
    CONTACTED: {
      label: "Contacted",
      color: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-300 dark:border-cyan-800",
      icon: <MessageCircle className="w-3 h-3" />
    },
    ACCEPTED: {
      label: "Accepted",
      color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800",
      icon: <ThumbsUp className="w-3 h-3" />
    },
    REJECTED: {
      label: "Declined",
      color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800",
      icon: <ThumbsDown className="w-3 h-3" />
    },
    SHORTLISTED: {
      label: "Shortlisted",
      color: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800",
      icon: <Award className="w-3 h-3" />
    },
    HIRED: {
      label: "Hired",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800",
      icon: <CheckCircle className="w-3 h-3" />
    },
  };

  const status = statusConfig[vendor.assignmentStatus] || statusConfig.PENDING;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="border-border hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
          {/* Vendor Logo/Icon and Info */}
          <div className="flex items-start gap-3 sm:gap-4 flex-1">
            {/* Vendor Logo/Icon */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Building className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
              </div>
              {vendor.isVerified && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 sm:p-1">
                      <Shield className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Verified Vendor</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            
            {/* Vendor Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start sm:items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                <h3 className="text-base sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {vendor.businessName || vendor.name}
                </h3>
                {vendor.isVerified && (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                )}
              </div>
              
              {vendor.specialization && (
                <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 font-medium line-clamp-1">
                  {vendor.specialization}
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                {vendor.city && (
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{vendor.city}{vendor.state && `, ${vendor.state}`}</span>
                  </div>
                )}
                
                {vendor.rating > 0 && (
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current flex-shrink-0" />
                    <span className="font-medium">{vendor.rating}</span>
                    <span>({vendor.reviewCount || 0} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Status Badge - Only show on desktop */}
          {/* <Badge className={`px-2 py-1 sm:px-3 sm:py-1.5 border ${status.color} hidden sm:flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm`}>
            {status.icon}
            <span className="hidden sm:inline">{status.label}</span>
          </Badge> */}
        </div>

        {/* Address - Show on mobile if exists */}
        {vendor.address && isMobile && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground flex items-start gap-1.5 line-clamp-2">
              <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>{vendor.address}</span>
            </p>
          </div>
        )}

        {/* Categories */}
        {vendor.categories && vendor.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {vendor.categories.slice(0, isMobile ? 2 : 3).map((category) => (
              <Badge 
                key={category} 
                variant="secondary" 
                className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 bg-secondary/50 hover:bg-secondary/70 transition-colors"
              >
                {category}
              </Badge>
            ))}
            {vendor.categories.length > (isMobile ? 2 : 3) && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                +{vendor.categories.length - (isMobile ? 2 : 3)} more
              </Badge>
            )}
          </div>
        )}

        {/* Expandable Details */}
        {expanded && (
          <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4 animate-in fade-in">
            <Separator />
            
            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {(vendor.email || vendor.phone) && (
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-foreground">Contact Information</h4>
                  <div className="space-y-1.5 sm:space-y-2">
                    {vendor.email && (
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                        <a 
                          href={`mailto:${vendor.email}`}
                          className="text-primary hover:underline truncate"
                          title={vendor.email}
                        >
                          {isMobile && vendor.email.length > 25 
                            ? `${vendor.email.substring(0, 22)}...`
                            : vendor.email
                          }
                        </a>
                      </div>
                    )}
                    {vendor.phone && (
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                        <a 
                          href={`tel:${vendor.phone}`}
                          className="text-primary hover:underline"
                        >
                          {vendor.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Assignment Details */}
              <div>
                <h4 className="text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-foreground">Assignment Details</h4>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                  {/* Status info */}
                  {vendor.assignedAt && (
                    <div>Assigned: {formatDate(vendor.assignedAt)}</div>
                  )}
                  {vendor.respondedAt && (
                    <div>Responded: {formatDate(vendor.respondedAt)}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Address - Show in expanded view if exists */}
            {vendor.address && (
              <div>
                <h4 className="text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-foreground">Address</h4>
                <p className="text-xs sm:text-sm text-muted-foreground flex items-start gap-1.5 sm:gap-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                  <span>{vendor.address}</span>
                </p>
              </div>
            )}

            {/* Client Feedback */}
            {(vendor.clientFeedback || vendor.clientRating) && (
              <div>
                <h4 className="text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-foreground">Your Feedback</h4>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  {vendor.clientRating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{vendor.clientRating}/5</span>
                    </div>
                  )}
                  {vendor.clientFeedback && (
                    <p className="text-xs sm:text-sm text-muted-foreground italic">
                      "{isMobile && vendor.clientFeedback.length > 60 
                        ? `${vendor.clientFeedback.substring(0, 57)}...`
                        : vendor.clientFeedback
                      }"
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Website link in expanded view */}
            {vendor.website && (
              <div>
                <a 
                  href={vendor.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary hover:underline"
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  Visit Website
                </a>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 pt-3 sm:pt-4 border-t border-border">
          {/* Mobile Status and Quick Actions */}
          <div className="sm:hidden flex items-center justify-between w-full mb-2">
            <Badge className={`px-2 py-1 border ${status.color} flex items-center gap-1 text-xs`}>
              {status.icon}
              {status.label}
            </Badge>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {vendor.website && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href={vendor.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1 hover:text-primary"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Visit website</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Desktop Website Link */}
          <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
            {vendor.website && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href={vendor.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Website
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Visit vendor website</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="w-full sm:w-auto justify-center sm:justify-start text-xs sm:text-sm"
            >
              {expanded ? (
                <>
                  Show Less
                  <ChevronUp className="ml-1.5 w-3 h-3 sm:w-4 sm:h-4" />
                </>
              ) : (
                <>
                  View Details
                  <ChevronDown className="ml-1.5 w-3 h-3 sm:w-4 sm:h-4" />
                </>
              )}
            </Button>
            
            <div className="flex gap-2">
              {vendor.phone && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="flex-1 sm:flex-none text-xs sm:text-sm"
                >
                  <a href={`tel:${vendor.phone}`}>
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    {isMobile ? "Call" : "Call"}
                  </a>
                </Button>
              )}
              
              {vendor.email && (
                <Button 
                  size="sm" 
                  asChild
                  className="flex-1 sm:flex-none text-xs sm:text-sm"
                >
                  <a href={`mailto:${vendor.email}`}>
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    {isMobile ? "Email" : "Contact"}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function VendorsSkeleton() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <Skeleton className="h-7 sm:h-8 w-48 sm:w-64 bg-muted mb-1 sm:mb-2" />
              <Skeleton className="h-4 w-32 sm:w-48 bg-muted" />
            </div>
            <Skeleton className="h-5 sm:h-6 w-24 sm:w-32 bg-muted rounded-full self-start sm:self-auto" />
          </div>

          {/* Stats Skeleton */}
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 overflow-x-auto pb-2 -mx-4 sm:mx-0 sm:overflow-visible">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[150px] sm:min-w-0">
                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 bg-muted mb-1 sm:mb-2" />
                        <Skeleton className="h-5 sm:h-6 w-8 sm:w-12 bg-muted" />
                      </div>
                      <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-lg" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Search Skeleton */}
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Skeleton className="h-9 sm:h-10 flex-1 bg-muted rounded-md" />
              <Skeleton className="h-9 sm:h-10 w-full sm:w-32 bg-muted rounded-md" />
            </div>
          </CardContent>
        </Card>

        {/* Results Count Skeleton */}
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <Skeleton className="h-4 w-32 bg-muted" />
          <Skeleton className="h-4 w-16 bg-muted" />
        </div>

        {/* Vendor Cards Skeleton */}
        <div className="space-y-3 sm:space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1">
                    <Skeleton className="w-10 h-10 sm:w-14 sm:h-14 bg-muted rounded-lg sm:rounded-xl" />
                    <div className="flex-1 space-y-1.5 sm:space-y-2">
                      <Skeleton className="h-5 sm:h-6 w-32 sm:w-48 bg-muted" />
                      <Skeleton className="h-3 sm:h-4 w-24 sm:w-32 bg-muted" />
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                        <Skeleton className="h-3 sm:h-4 w-20 bg-muted" />
                        <Skeleton className="h-3 sm:h-4 w-16 bg-muted" />
                      </div>
                    </div>
                  </div>
                  <Skeleton className="hidden sm:block h-6 w-24 bg-muted rounded-full" />
                </div>
                <Skeleton className="h-3 sm:h-4 w-full bg-muted mb-3 sm:mb-4" />
                <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  <Skeleton className="h-5 sm:h-6 w-12 bg-muted rounded-full" />
                  <Skeleton className="h-5 sm:h-6 w-16 bg-muted rounded-full" />
                  <Skeleton className="h-5 sm:h-6 w-10 bg-muted rounded-full" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 pt-3 sm:pt-4 border-t border-border">
                  <Skeleton className="h-4 w-20 bg-muted" />
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Skeleton className="h-9 w-full sm:w-24 bg-muted rounded-md" />
                    <div className="flex gap-2">
                      <Skeleton className="h-9 flex-1 sm:flex-none sm:w-20 bg-muted rounded-md" />
                      <Skeleton className="h-9 flex-1 sm:flex-none sm:w-20 bg-muted rounded-md" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}