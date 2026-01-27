'use client';

import { useState } from 'react';
import { Plus, Upload, MapPin, Square, Home, Building, Store, Coffee, Briefcase } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const projectTypes = [
  {
    id: 'RESIDENTIAL',
    name: 'Residential',
    description: 'Homes, apartments, villas',
    icon: Home,
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'COMMERCIAL',
    name: 'Commercial',
    description: 'Offices, coworking spaces',
    icon: Building,
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 'RETAIL',
    name: 'Retail',
    description: 'Shops, showrooms, malls',
    icon: Store,
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 'HOSPITALITY',
    name: 'Hospitality',
    description: 'Hotels, restaurants, cafes',
    icon: Coffee,
    gradient: 'from-orange-500 to-orange-600'
  },
  {
    id: 'OFFICE',
    name: 'Office',
    description: 'Corporate offices, studios',
    icon: Briefcase,
    gradient: 'from-slate-500 to-slate-600'
  }
];

export default function ProjectCreateDialog({ open, onOpenChange, onProjectCreated }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectType: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    areaSqFt: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }
    if (!formData.projectType) {
      newErrors.projectType = 'Please select a project type';
    }
    if (!formData.areaSqFt || isNaN(formData.areaSqFt) || Number(formData.areaSqFt) <= 0) {
      newErrors.areaSqFt = 'Please enter a valid area in sq ft';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock project object
      const newProject = {
        id: Date.now(),
        publicId: `proj_${Date.now()}`,
        title: formData.title,
        description: formData.description,
        status: 'DRAFT',
        projectType: formData.projectType,
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`.trim(),
        city: formData.city,
        pincode: formData.pincode || null,
        state: formData.state,
        zipCode: formData.zipCode,
        areaSqFt: Number(formData.areaSqFt),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        thumbnail: '/api/placeholder/400/300',
        progress: 10
      };

      onProjectCreated(newProject);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        projectType: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        areaSqFt: ''
      });
      setStep(1);
      setErrors({});
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false);
      // Reset form when closing
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          projectType: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          areaSqFt: ''
        });
        setStep(1);
        setErrors({});
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-slate-900">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
              <Plus className="h-4 w-4 text-white" />
            </div>
            <span>Create New Project</span>
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            {step === 1 
              ? "Let's start with some basic information about your project"
              : "Add location details to complete your project setup"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step >= 1 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
              )}>
                1
              </div>
              <span className={cn(
                "text-sm font-medium",
                step >= 1 ? "text-slate-900" : "text-slate-500"
              )}>
                Project Details
              </span>
            </div>
            
            <div className={cn(
              "flex-1 h-px transition-colors",
              step >= 2 ? "bg-blue-600" : "bg-slate-200"
            )} />
            
            <div className="flex items-center space-x-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step >= 2 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
              )}>
                2
              </div>
              <span className={cn(
                "text-sm font-medium",
                step >= 2 ? "text-slate-900" : "text-slate-500"
              )}>
                Location
              </span>
            </div>
          </div>

          {/* Step 1: Project Details */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in-0 duration-300">
              {/* Project Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-700">Project Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Modern Living Room Redesign"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={errors.title ? 'border-red-500' : 'border-slate-300'}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Project Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your vision, requirements, or any specific details..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="border-slate-300"
                />
              </div>

              {/* Project Type */}
              <div className="space-y-3">
                <Label className="text-slate-700">Project Type *</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projectTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.projectType === type.id;
                    
                    return (
                      <Card
                        key={type.id}
                        className={cn(
                          "cursor-pointer border-2 transition-all duration-200 hover:shadow-md",
                          isSelected 
                            ? "border-blue-600 shadow-md ring-2 ring-blue-200" 
                            : "border-slate-200 hover:border-blue-300",
                          errors.projectType && !isSelected ? "border-red-300" : ""
                        )}
                        onClick={() => handleInputChange('projectType', type.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className={cn(
                              "p-2 rounded-lg bg-gradient-to-r",
                              type.gradient
                            )}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-slate-900">
                                {type.name}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {type.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                {errors.projectType && (
                  <p className="text-sm text-red-600">{errors.projectType}</p>
                )}
              </div>

              {/* Area */}
              <div className="space-y-2">
                <Label htmlFor="area" className="text-slate-700">Total Area (sq ft) *</Label>
                <div className="relative">
                  <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="area"
                    type="number"
                    placeholder="e.g., 1200"
                    value={formData.areaSqFt}
                    onChange={(e) => handleInputChange('areaSqFt', e.target.value)}
                    className={cn("pl-9 border-slate-300", errors.areaSqFt ? 'border-red-500' : '')}
                  />
                </div>
                {errors.areaSqFt && (
                  <p className="text-sm text-red-600">{errors.areaSqFt}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in-0 duration-300">
              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-slate-700">Street Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="address"
                    placeholder="e.g., 123 Main Street, Block A"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={cn("pl-9 border-slate-300", errors.address ? 'border-red-500' : '')}
                  />
                </div>
                {errors.address && (
                  <p className="text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              {/* City & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-slate-700">City *</Label>
                  <Input
                    id="city"
                    placeholder="e.g., Mumbai"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={cn("border-slate-300", errors.city ? 'border-red-500' : '')}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600">{errors.city}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-slate-700">State</Label>
                  <Input
                    id="state"
                    placeholder="e.g., Maharashtra"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="border-slate-300"
                  />
                </div>
              </div>

              {/* ZIP Code */}
              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-slate-700">ZIP Code</Label>
                <Input
                  id="zipCode"
                  placeholder="e.g., 400001"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className="max-w-40 border-slate-300"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex space-x-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={loading}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Back
                </Button>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Button>
              
              {step === 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="min-w-32 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Project
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}