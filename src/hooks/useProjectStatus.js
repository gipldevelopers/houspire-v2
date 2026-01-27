// src\hooks\useProjectStatus.js
'use client';

import { useState, useEffect } from 'react';
import { projectService } from '@/services/project.service';
import { useRouter } from 'next/navigation';

export const useProjectStatus = () => {
  const [pendingProjects, setPendingProjects] = useState([]);
  const [allPendingProjects, setAllPendingProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkPendingProjects = async () => {
    try {
      setLoading(true);
      const result = await projectService.getUserProjects();
      
      if (result.success) {
        const projects = result.data?.projects || [];
        
        // Get ALL pending projects (for other uses)
        const allPending = projects.filter(project => 
          project.currentPhase && 
          project.currentPhase !== 'COMPLETED' && 
          project.status !== 'CANCELLED'
        );
        
        setAllPendingProjects(allPending);
        
        // Filter out ONBOARDING_QUESTIONNAIRE for the modal (handled by dashboard alert)
        const filteredPending = allPending.filter(project => 
          project.currentPhase !== 'ONBOARDING_QUESTIONNAIRE' &&
          project.currentPhase !== 'DESIGN_QUESTIONNAIRE' // Also filter design questionnaire (handled by popup)
        );
        
        setPendingProjects(filteredPending);
      }
    } catch (error) {
      console.error('Error checking project status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRedirectUrl = (project) => {
    const redirectUrls = {
      'PROJECT_SETUP': `/dashboard/projects/new`,
      'ONBOARDING_QUESTIONNAIRE': `/dashboard/projects/${project.id}`,
      'FILE_UPLOADS': `/dashboard/projects/${project.id}/uploads`,
      'PAYMENT': `/packages?type=new-project&projectId=${project.id}`,
      'DESIGN_QUESTIONNAIRE': `/dashboard/projects/${project.id}/design-questionnaire`
    };
    return redirectUrls[project.currentPhase];
  };

  const redirectToPendingStep = (project) => {
    const redirectUrl = getRedirectUrl(project);
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  };

  useEffect(() => {
    checkPendingProjects();
  }, []);

  return {
    pendingProjects, // Filtered - excludes onboarding and design questionnaire
    allPendingProjects, // All pending projects including onboarding
    loading,
    checkPendingProjects,
    redirectToPendingStep,
    getRedirectUrl
  };
};