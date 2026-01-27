// src/components/projects/PendingStepsModal.js
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Upload, 
  FileText,
  X
} from 'lucide-react';

const phaseDetails = {
  'PROJECT_SETUP': {
    name: 'Project Setup',
    description: 'Complete basic project information',
    icon: FileText,
    color: 'blue'
  },
  'FILE_UPLOADS': {
    name: 'File Uploads',
    description: 'Upload floor plans or room photos',
    icon: Upload,
    color: 'green'
  },
  'PAYMENT': {
    name: 'Payment',
    description: 'Complete payment for your package',
    icon: CreditCard,
    color: 'orange'
  }
  // ONBOARDING_QUESTIONNAIRE removed - handled by dashboard alert
  // DESIGN_QUESTIONNAIRE removed - handled via popup after payment
};

export default function PendingStepsModal({ 
  isOpen, 
  onClose, 
  pendingProjects,
  onResumeProject 
}) {
  if (!isOpen || pendingProjects.length === 0) return null;

  const getPhaseColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
      purple: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
      green: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
      orange: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
      pink: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-2xl max-h-[90dvh] overflow-hidden flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Complete Your Projects
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {pendingProjects.length} incomplete project{pendingProjects.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Continue from where you left off to complete your projects:
          </p>
        </div>

        {/* Projects List - Scrollable area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
          {pendingProjects.map((project) => {
            const phase = phaseDetails[project.currentPhase];
            const PhaseIcon = phase?.icon || Clock;
            
            return (
              <Card 
                key={project.id} 
                className="border-2 border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    {/* Project Info */}
                    <div className="flex-1 min-w-0">
                      {/* Project Title - Mobile */}
                      <div className="sm:hidden mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">
                          {project.title}
                        </h3>
                      </div>
                      
                      {/* Badge and Phase Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <Badge 
                          className={`${getPhaseColor(phase?.color)} text-xs sm:text-sm px-2 py-1 border`}
                        >
                          <PhaseIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                          {phase?.name}
                        </Badge>
                        
                        {/* Project Title - Desktop */}
                        <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400">
                          Project: {project.title}
                        </span>
                      </div>
                      
                      {/* Description */}
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {phase?.description}
                      </p>
                    </div>
                    
                    {/* Action Button */}
                    <div className="flex sm:flex-col sm:items-end gap-2 sm:gap-1">
                      <Button
                        onClick={() => onResumeProject(project)}
                        className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-1 sm:gap-2 text-sm py-1.5 sm:py-2"
                        size="sm"
                      >
                        <span className="sm:hidden">Resume</span>
                        <span className="hidden sm:inline">Continue</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      
                      {/* Project Title - Mobile alternative */}
                      {/* <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 text-center">
                        {project.title}
                      </div> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete these steps to move forward with your projects
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1 sm:flex-none text-sm"
                size="sm"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}