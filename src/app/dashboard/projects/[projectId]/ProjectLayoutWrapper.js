// src/app/dashboard/projects/[projectId]/ProjectLayoutWrapper.js
'use client';

import { usePathname } from 'next/navigation';
import ProjectLayout from "@/components/projects/ProjectLayout";

const pathToSectionMap = {
  'uploads': 'uploads',
  'questionnaire': 'questionnaire',
  'styles': 'styles',
  'renders': 'renders',
  'boq': 'boq',
  'vendors': 'vendors'
};

// Paths that should NOT use ProjectLayout
const noLayoutPaths = ['', 'edit']; // Add any paths that shouldn't have layout

export default function ProjectLayoutWrapper({ projectId, children }) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/');
  const currentSegment = pathSegments[pathSegments.length - 1];

   // Check if current path should not have layout
  if (noLayoutPaths.includes(currentSegment) || currentSegment === projectId) {
    return <>{children}</>;
  }

  const currentSection = pathToSectionMap[currentSegment] || 'overview';

  return (
    <ProjectLayout projectId={projectId} currentSection={currentSection}>
      {children}
    </ProjectLayout>
  );
}