// src/app/crm/projects/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { crmService } from '@/services/crm.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FolderKanban,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Calendar,
  TrendingUp,
  Zap,
  Loader2,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  
  // Initialize filters from URL or default
  const [searchQuery, setSearchQuery] = useState(''); // We'll debounce this
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [phaseFilter, setPhaseFilter] = useState('all');

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const filters = {
        status: statusFilter,
        phase: phaseFilter,
        search: searchQuery,
        // page: 1, // Default to page 1 for now
        limit: 50 
      };
      
      const response = await crmService.getProjects(filters);
      if (response && response.data && response.data.projects) {
        // Map backend data to frontend view model
        const mappedProjects = response.data.projects.map(p => ({
          id: p.publicId, // Display Public ID
          customerName: p.customerName || 'Unknown User',
          customerId: p.customerPublicId, // For linking
          package: p.selectedPlan || 'Pro',
          status: p.status, // e.g., 'IN_PROGRESS'
          phase: p.currentPhase || 'PROJECT_SETUP',
          designer: 'Unassigned', 
          analyst: 'Unassigned',
          progress: 0, // Placeholder
          timeline: 'N/A',
          deadline: null,
          budget: 0, // Need to implement Budget calculation in backend proper
          addons: p.selectedAddons || [],
          priority: 'medium', // Placeholder
          createdAt: p.createdAt
        }));
        
        setProjects(mappedProjects);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
        fetchProjects();
    }, 500);
    return () => clearTimeout(timer);
  }, [statusFilter, phaseFilter, searchQuery]);

  // Update URL on filter change (optional but good for bookmarking)
  useEffect(() => {
     const params = new URLSearchParams();
     if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
     if (phaseFilter && phaseFilter !== 'all') params.set('phase', phaseFilter);
     // Note: Triggering router.push might re-trigger render, but we are fetching on state change anyway.
     // To avoid double fetch or loop, we just pushState or use replace without triggering navigation if possible,
     // or just rely on the Effect dependent on state.
     // router.replace(`/crm/projects?${params.toString()}`);
  }, [statusFilter, phaseFilter]);

  // Use projects directly as they are server-filtered
  const filteredProjects = projects;

  const getPhaseColor = (phase) => {
    if (phase.includes('New')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
    if (phase.includes('Analysis')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    if (phase.includes('Design')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    if (phase.includes('Delivery')) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage all active projects
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={phaseFilter} onValueChange={setPhaseFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phases</SelectItem>
                <SelectItem value="New Customer">New Customer</SelectItem>
                <SelectItem value="Analysis Phase">Analysis Phase</SelectItem>
                <SelectItem value="Design Phase">Design Phase</SelectItem>
                <SelectItem value="Delivery Phase">Delivery Phase</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Phase</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                     <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading projects...</span>
                     </div>
                  </TableCell>
                </TableRow>
              ) : filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    No projects found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow key={project.id} className="cursor-pointer hover:bg-accent/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{project.id}</span>
                        {project.addons.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {project.addons.length} add-ons
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/crm/customers/${project.customerId}`}
                        className="font-medium hover:underline"
                      >
                        {project.customerName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.package}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPhaseColor(project.phase)}>
                        {project.phase}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Designer: {project.designer}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Analyst: {project.analyst}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{project.timeline}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {project.deadline ? `Due: ${new Date(project.deadline).toLocaleDateString()}` : 'No deadline'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">₹{(project.budget || 0).toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/crm/projects/${project.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/crm/projects/${project.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Update Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Zap className="mr-2 h-4 w-4" />
                            Mark Urgent
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
