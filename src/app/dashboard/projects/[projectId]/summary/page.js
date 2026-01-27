// src/app/dashboard/projects/[projectId]/summary/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  FileText, 
  Camera, 
  Home, 
  MapPin, 
  IndianRupee, 
  Calendar,
  Sparkles,
  ArrowLeft,
  CreditCard,
  User,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { projectService } from '@/services/project.service';
import { uploadService } from '@/services/upload.service';

const budgetConfig = {
  ECONOMY: { label: 'Economy', range: '₹5-10 Lakhs' },
  STANDARD: { label: 'Standard', range: '₹10-25 Lakhs' },
  PREMIUM: { label: 'Premium', range: '₹25-50 Lakhs' },
  LUXURY: { label: 'Luxury', range: '₹50 Lakhs +' }
};

const timelineConfig = {
  URGENT: { label: 'Urgent', duration: '2-4 weeks' },
  STANDARD: { label: 'Standard', duration: '1-2 months' },
  FLEXIBLE: { label: 'Flexible', duration: '2+ months' }
};

const projectTypeConfig = {
  TWO_BHK: { label: '2 BHK', description: '2 Bedroom, Hall, Kitchen' },
  THREE_BHK: { label: '3 BHK', description: '3 Bedroom, Hall, Kitchen' },
  FOUR_BHK: { label: '4 BHK', description: '4 Bedroom, Hall, Kitchen' },
  CUSTOM: { label: 'Custom', description: 'Villa, Penthouse, Duplex, etc.' }
};

export default function ProjectSummaryPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId;
  const [project, setProject] = useState(null);
  const [uploads, setUploads] = useState({ floorPlans: [], roomPhotos: [], fileUploads: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  // Check mobile view on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadProjectSummary();
  }, [projectId]);

  const loadProjectSummary = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load project details
      const projectResponse = await projectService.getProject(projectId);
      
      if (!projectResponse.success) {
        throw new Error(projectResponse.message || 'Failed to load project details');
      }

      setProject(projectResponse.data.project);

      // Load uploads
      const uploadsResponse = await uploadService.getProjectUploads(projectId);
      
      if (!uploadsResponse.success) {
        console.warn('Failed to load uploads:', uploadsResponse.message);
        // Continue without uploads - set empty arrays
        setUploads({ floorPlans: [], roomPhotos: [], fileUploads: [] });
      } else {
        setUploads(uploadsResponse.data.files || { floorPlans: [], roomPhotos: [], fileUploads: [] });
      }

    } catch (error) {
      console.error('Error loading project summary:', error);
      setError(error.message || 'Failed to load project summary');
      toast.error('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = async () => {
    // Prevent multiple clicks
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Validate that we have required data
      if (!project) {
        throw new Error('Project data not loaded');
      }

      // Check if user has uploaded files
      const totalFiles = (uploads.floorPlans?.length || 0) + (uploads.roomPhotos?.length || 0);
      
      if (totalFiles === 0) {
        toast.error("Upload Required", {
          description: "Please upload at least one floor plan or room photo before proceeding.",
        });
        setIsProcessing(false);
        return;
      }

      // Store project data for payment page
      const paymentData = {
        projectId: projectId,
        projectTitle: project.title,
        projectType: project.projectType,
        budgetRange: project.budgetRange,
        selectedStyle: project.selectedStyle,
        totalFiles: totalFiles,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('projectPaymentData', JSON.stringify(paymentData));

      // Add a small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 1000));

      // ✅ Check localStorage for selected plan from landing page
      let typeParam = "new-project"; // Default type
      const storedPlan = localStorage.getItem('selectedPlanFromLanding');
      
      if (storedPlan) {
        try {
          const planData = JSON.parse(storedPlan);
          const planPrice = planData.price;
          
          // If user came from landing page with 4999, 9999, or 14999, use that as type
          // Keep 499 as "499-only" (already working)
          if (planPrice === 4999 || planPrice === 9999 || planPrice === 14999) {
            typeParam = planPrice.toString();
            console.log(`✅ Using plan from landing page: ${planPrice}`);
          } else if (planPrice === 499) {
            // Keep 499 plan as it is (uses "499-only" type)
            typeParam = "499-only";
          }
        } catch (error) {
          console.error('Error parsing stored plan:', error);
          // Fall back to default type
        }
      }

      // Redirect to packages page with type and projectId
      router.push(`/packages?type=${typeParam}&projectId=${projectId}`);

    } catch (error) {
      console.error('Failed to proceed to payment:', error);
      toast.error("Payment Error", {
        description: error.message || "Failed to initiate payment. Please try again.",
      });
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 sm:h-8 bg-muted rounded w-1/3 sm:w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2 sm:w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4 sm:p-6">
                    <div className="h-4 bg-muted rounded w-3/4 mb-3 sm:mb-4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <Card className="border-destructive/20 bg-destructive/10">
            <CardContent className="p-4 sm:p-6 text-center">
              <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-destructive mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-destructive mb-2">
                Failed to Load Project
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base mb-3 sm:mb-4">{error}</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <Button onClick={loadProjectSummary} variant="outline" size={mobileView ? "sm" : "default"}>
                  <Loader2 className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Link href="/dashboard/projects">
                  <Button variant="ghost" size={mobileView ? "sm" : "default"}>
                    Back to Projects
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-4xl mx-auto text-center">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Project Not Found</h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-3 sm:mb-4">The project you're looking for doesn't exist.</p>
          <Link href="/dashboard/projects">
            <Button size={mobileView ? "sm" : "default"}>Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalFiles = (uploads.floorPlans?.length || 0) + (uploads.roomPhotos?.length || 0);
  const totalSize = [...(uploads.floorPlans || []), ...(uploads.roomPhotos || [])]
    .reduce((acc, file) => acc + (file.fileSize || 0), 0);

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <Link href={`/dashboard/projects/${projectId}/uploads`} className="w-full sm:w-auto">
            <Button variant="outline" className="border-border hover:bg-accent w-full sm:w-auto justify-center sm:justify-start" size={mobileView ? "sm" : "default"}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Uploads
            </Button>
          </Link>
          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs sm:text-sm w-full sm:w-auto justify-center sm:justify-start">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Ready for Payment
          </Badge>
        </div>

        {/* Main Title */}
        <div className="text-center space-y-2 sm:space-y-3">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Project Summary</h1>
          <p className="text-muted-foreground text-sm sm:text-lg">
            Review your project details before proceeding to payment
          </p>
        </div>

        {/* Progress Indicator */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-foreground text-base sm:text-lg">Almost There!</h3>
                <p className="text-muted-foreground text-sm sm:text-base">Complete your payment to start your design journey</p>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-xl sm:text-2xl font-bold text-foreground">90%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
            <Progress value={90} className="h-2 mt-3 sm:mt-4 bg-blue-100 dark:bg-blue-900/30" />
          </CardContent>
        </Card>

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Project Information */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-foreground text-base sm:text-lg">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <p className="font-semibold text-foreground text-sm sm:text-base">{project.title}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{project.description || 'No description provided'}</p>
                </div>
                
                {project.address && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{project.address}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {projectTypeConfig[project.projectType]?.label || project.projectType}
                    {project.areaSqFt && ` • ${project.areaSqFt} sq ft`}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground">
                  Created: {formatDate(project.createdAt)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget & Timeline */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-foreground text-base sm:text-lg">
                <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                Budget & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="space-y-2 sm:space-y-3">
                {project.budgetRange && (
                  <div>
                    <p className="font-semibold text-foreground text-sm sm:text-base">
                      {budgetConfig[project.budgetRange]?.label || project.budgetRange}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {budgetConfig[project.budgetRange]?.range || 'Budget range not specified'}
                    </p>
                  </div>
                )}
                
                {project.timeline && (
                  <div>
                    <p className="font-semibold text-foreground text-sm sm:text-base">
                      {timelineConfig[project.timeline]?.label || project.timeline}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {timelineConfig[project.timeline]?.duration || 'Timeline not specified'}
                    </p>
                  </div>
                )}

                {(!project.budgetRange && !project.timeline) && (
                  <p className="text-xs sm:text-sm text-muted-foreground italic">
                    Budget and timeline not specified
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upload Summary */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-foreground text-base sm:text-lg">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Upload Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Floor Plans</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs">
                    {uploads.floorPlans?.length || 0} files
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Room Photos</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs">
                    {uploads.roomPhotos?.length || 0} files
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="font-semibold text-foreground text-sm sm:text-base">Total</span>
                  <Badge variant="secondary" className="text-xs">
                    {totalFiles} files • {formatFileSize(totalSize)}
                  </Badge>
                </div>

                {totalFiles === 0 && (
                  <p className="text-xs sm:text-sm text-amber-600 italic">
                    No files uploaded yet. Please add floor plans or room photos.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Design Style */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-foreground text-base sm:text-lg">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                Selected Style
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {project.selectedStyle ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm sm:text-base truncate">
                      {project.selectedStyle.name || 'Selected Style'}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      {project.selectedStyle.description || 'Your preferred design style'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-muted-foreground italic">No style selected yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Section */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
              <div className="space-y-1 text-center lg:text-left">
                <h3 className="font-semibold text-foreground text-base sm:text-lg">
                  {totalFiles > 0 ? 'Ready to Begin Your Design Journey?' : 'Complete Your Uploads'}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {totalFiles > 0 
                    ? "Complete your payment and we'll start working on your dream space immediately"
                    : "Please upload at least one floor plan or room photo before proceeding to payment"
                  }
                </p>
              </div>
              
              <Button 
                onClick={handleProceedToPayment}
                disabled={isProcessing || totalFiles === 0}
                className={`w-full lg:w-auto ${
                  isProcessing 
                    ? 'bg-green-700 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                } text-white px-6 sm:px-8 py-2 h-10 sm:h-12 text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                size={mobileView ? "default" : "lg"}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    {mobileView ? 'Processing...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {totalFiles > 0 
                      ? (mobileView ? 'Proceed to Payment' : 'Proceed to Payment')
                      : (mobileView ? 'Upload Files First' : 'Upload Files First')
                    }
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Need to make changes?{' '}
            <Link 
              href={`/dashboard/projects/${projectId}/uploads`} 
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Go back to uploads
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}