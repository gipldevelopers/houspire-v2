// src/components/projects/ProjectLayout.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  Upload,
  FileText,
  Palette,
  Image,
  Receipt,
  Sparkles,
  CheckCircle2,
  Clock,
  PlayCircle,
} from 'lucide-react';
import { PROJECT_STEPS } from '@/constants/projectSteps';

const projectSections = [
  { 
    id: 'uploads', 
    name: 'Uploads', 
    href: 'uploads', 
    icon: Upload,
    description: 'Upload floor plans & photos',
  },
  { 
    id: 'questionnaire', 
    name: 'Questionnaire', 
    href: 'questionnaire', 
    icon: FileText,
    description: 'Share your preferences',
  },
  { 
    id: 'styles', 
    name: 'Styles', 
    href: 'styles', 
    icon: Palette,
    description: 'Choose design style',
  },
  { 
    id: 'renders', 
    name: 'Renders', 
    href: 'renders', 
    icon: Image,
    description: 'View 3D visualizations',
  },
  { 
    id: 'boq', 
    name: 'BOQ', 
    href: 'boq', 
    icon: Receipt,
    description: 'Budget & materials',
  },
];

export default function ProjectLayout({ children, projectId, currentSection = 'uploads' }) {
  const [project, setProject] = useState(null);
  const [completionStatus, setCompletionStatus] = useState({});

  useEffect(() => {
    // Mock project data
    setProject({
      id: projectId,
      title: 'Modern 3BHK Apartment Design',
      status: 'UPLOADED',
      address: '123 Main Street, Mumbai',
      areaSqFt: 1200,
      roomCount: 5,
      progress: 15,
      createdAt: '2024-01-15'
    });

    // Dynamic completion status based on current section
    const status = {};
    const sectionOrder = ['uploads', 'questionnaire', 'styles', 'renders', 'boq'];
    const currentIndex = sectionOrder.indexOf(currentSection);
    
    sectionOrder.forEach((section, index) => {
      if (index < currentIndex) {
        status[section] = { completed: true, progress: 100 };
      } else if (index === currentIndex) {
        status[section] = { completed: false, progress: 50 };
      } else {
        status[section] = { completed: false, progress: 0 };
      }
    });

    setCompletionStatus(status);
  }, [projectId, currentSection]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64 mb-4"></div>
          <div className="h-4 bg-muted rounded w-96 mb-6"></div>
          <div className="h-32 bg-muted rounded-xl mb-6"></div>
          {children}
        </div>
      </div>
    );
  }

  const getSectionStatus = (sectionId) => {
    return completionStatus[sectionId] || { completed: false, progress: 0 };
  };

  const currentStepConfig = PROJECT_STEPS[currentSection] || PROJECT_STEPS.uploads;

  // Calculate overall progress based on completed sections
  const overallProgress = Object.values(completionStatus).reduce(
    (total, status) => total + status.progress, 0
  ) / Object.keys(completionStatus).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Project Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex items-start gap-4">
              <Link href="/dashboard/projects">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  All Projects
                </Button>
              </Link>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    <Clock className="w-3 h-3 mr-1" />
                    {project.areaSqFt} sq ft • {project.roomCount} rooms
                  </Badge>
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                    {project.status.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{project.address}</span>
                </div>
              </div>
            </div>
            
            {/* Step Indicator Card */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">
                        Step {currentStepConfig.step} of 5
                      </span>
                      <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
                        {Math.round(overallProgress)}% Complete
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {currentStepConfig.name}
                    </p>
                  </div>
                </div>
                <Progress value={overallProgress} className="h-2 bg-primary/10 mt-3" />
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Progress Stepper */}
          <div className="relative">
            {/* Main Progress Line Container */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-border -translate-y-1/2 z-0">
              {/* Progress Fill */}
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            
            {/* Steps Container */}
            <div className="flex items-start justify-between relative z-10">
              {projectSections.map((section, index) => {
                const Icon = section.icon;
                const isActive = currentSection === section.id;
                const sectionStatus = getSectionStatus(section.id);
                const isCompleted = sectionStatus.completed;
                const isUpcoming = !isCompleted && !isActive;
                const href = `/dashboard/projects/${projectId}/${section.href}`;
                
                return (
                  <div key={section.id} className="flex flex-col items-center flex-1 relative">
                    {/* Step Connector Lines */}
                    {index > 0 && (
                      <div className="absolute top-8 left-0 right-0 h-0.5 -translate-y-1/2 -z-10">
                        <div 
                          className={`h-full rounded-full ${
                            isCompleted ? 'bg-green-500' : 'bg-transparent'
                          }`}
                          style={{ width: '100%' }}
                        />
                      </div>
                    )}
                    
                    {/* Step Indicator */}
                    <Link 
                      href={isCompleted || isActive ? href : '#'} 
                      className="relative group mb-2"
                    >
                      <div className={`
                        relative flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all duration-300
                        ${isActive 
                          ? 'bg-primary border-primary shadow-lg scale-110 ring-4 ring-primary/20' 
                          : isCompleted
                          ? 'bg-green-500 border-green-500 shadow-md hover:scale-105'
                          : 'bg-card border-border hover:border-primary/50 hover:scale-105'
                        }
                      `}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
                        ) : isActive ? (
                          <PlayCircle className="w-6 h-6 text-primary-foreground" />
                        ) : (
                          <Icon className={`w-5 h-5 ${isUpcoming ? 'text-muted-foreground' : 'text-foreground'}`} />
                        )}
                        
                        {/* Step Number Badge */}
                        <div className={`
                          absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center border
                          ${isActive 
                            ? 'bg-primary-foreground text-primary border-primary' 
                            : isCompleted
                            ? 'bg-white text-green-600 border-green-500'
                            : 'bg-muted text-muted-foreground border-card'
                          }
                        `}>
                          {index + 1}
                        </div>
                      </div>
                      
                      {/* Hover Tooltip */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 hidden group-hover:block z-20">
                        <div className="bg-foreground text-background px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
                          {section.name}
                          {isCompleted && ' ✓'}
                        </div>
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-foreground rotate-45" />
                      </div>
                    </Link>
                    
                    {/* Step Label */}
                    <div className="text-center mt-2 px-2 min-h-[60px] flex flex-col items-center justify-end">
                      <div className={`
                        text-sm font-medium transition-colors line-clamp-2
                        ${isActive ? 'text-foreground font-semibold' : 
                          isCompleted ? 'text-green-600 dark:text-green-400' : 
                          'text-muted-foreground'
                        }
                      `}>
                        {section.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 hidden lg:block line-clamp-2">
                        {section.description}
                      </div>
                      
                      {/* Status Badge */}
                      <div className="mt-2">
                        {isCompleted ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 text-xs">
                            Completed
                          </Badge>
                        ) : isActive ? (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                            In Progress
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-xs">
                            Upcoming
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Summary */}
          {/* <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
                <span>Upcoming</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{Math.round(overallProgress)}%</div>
              <div className="text-xs text-muted-foreground">Overall Progress</div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {children}
      </div>
    </div>
  );
}