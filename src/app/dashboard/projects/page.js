// src/app/dashboard/projects/page.js
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  FileText,
  Palette,
  Image,
  ChevronDown,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProjectCard from '@/components/dashboard/ProjectCard'
import { projectService } from '@/services/project.service'
import { toast } from 'sonner'

const statusConfig = {
  'DRAFT': {
    label: 'Draft',
    color: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200',
    icon: FileText
  },
  'UPLOADED': {
    label: 'Uploaded',
    color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200',
    icon: CheckCircle2
  },
  'QUESTIONNAIRE_COMPLETED': {
    label: 'Questionnaire Done',
    color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200',
    icon: CheckCircle2
  },
  'STYLE_SELECTED': {
    label: 'Style Selected',
    color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-200',
    icon: Palette
  },
  'RENDER_IN_PROGRESS': {
    label: 'Rendering',
    color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 animate-pulse',
    icon: Image
  },
  'BOQ_GENERATED': {
    label: 'BOQ Ready',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-200',
    icon: CheckCircle2
  },
  'COMPLETED': {
    label: 'Completed',
    color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200',
    icon: CheckCircle2
  },
  'PAYMENT_COMPLETED': {
    label: 'Payment Completed',
    color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200',
    icon: CheckCircle2
  }
}

const quickActions = [
  {
    title: 'View Renders',
    description: 'Check your latest renders',
    icon: Image,
    href: '/dashboard/renders',
    color: 'from-purple-500 to-pink-500',
    badge: '2 new'
  },
  {
    title: 'BOQ Review',
    description: 'Review your bill of quantities',
    icon: FileText,
    href: '/dashboard/boq',
    color: 'from-amber-500 to-orange-500',
    badge: '3 pending'
  },
  {
    title: 'Style Selection',
    description: 'Choose your design style',
    icon: Palette,
    href: '/dashboard/styles',
    color: 'from-blue-500 to-cyan-500'
  }
]

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Load projects from API
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const response = await projectService.getUserProjects()
      
      if (response.success) {
        setProjects(response.data.projects || [])
      } else {
        toast.error(response.message || 'Failed to load projects')
        setProjects([])
      }
    } catch (error) {
      console.error('Error loading projects:', error)
      toast.error('Failed to load projects')
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const refreshProjects = async () => {
    setRefreshing(true)
    await loadProjects()
    setRefreshing(false)
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.address?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const projectStats = {
    total: projects.length,
    active: projects.filter(p => p.status !== 'COMPLETED' && p.status !== 'DRAFT' && p.status !== 'CANCELLED').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
    draft: projects.filter(p => p.status === 'DRAFT').length,
    inProgress: projects.filter(p => p.status === 'RENDER_IN_PROGRESS' || p.status === 'BOQ_GENERATED').length,
    needsQuestionnaire: projects.filter(p => p.status === 'PAYMENT_COMPLETED' && !p.questionnaireCompleted).length
  }

  const totalInvestment = projects.reduce((sum, project) => sum + (project.budget || 0), 0)

  const dashboardStats = [
    {
      title: 'Total Projects',
      value: projectStats.total.toString(),
      description: 'All projects',
      trend: projectStats.total > 0 ? `${projectStats.active} active` : 'No projects yet',
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Active Projects',
      value: projectStats.active.toString(),
      description: 'In progress',
      trend: projectStats.needsQuestionnaire > 0 ? `${projectStats.needsQuestionnaire} need questionnaire` : 'All on track',
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Completed',
      value: projectStats.completed.toString(),
      description: 'Finished projects',
      trend: '100% satisfaction',
      icon: CheckCircle2,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Total Investment',
      value: `₹${(totalInvestment / 100000).toFixed(1)}L`,
      description: 'Project value',
      trend: '+₹2.1L this quarter',
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400'
    }
  ]

  const statusFilters = [
    { key: 'all', label: 'All', count: projects.length },
    { key: 'DRAFT', label: 'Draft', count: projectStats.draft },
    { key: 'PAYMENT_COMPLETED', label: 'Needs Questionnaire', count: projectStats.needsQuestionnaire },
    { key: 'RENDER_IN_PROGRESS', label: 'Rendering', count: projectStats.inProgress },
    { key: 'COMPLETED', label: 'Completed', count: projectStats.completed }
  ]

  const handleStartQuestionnaire = async (project) => {
    // This will be handled by the ProjectCard component
    console.log('Starting questionnaire for project:', project.publicId)
  }

  if (loading) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/3"></div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-3 sm:p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-10 bg-muted rounded w-full"></div>
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-muted rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="animate-slide-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
              My Projects
            </h1>
            <p className="text-muted-foreground text-sm sm:text-lg">
              Manage and track your interior design projects
            </p>
          </div>
          
          <div className="flex gap-2">
            {/* <Button
              variant="outline"
              size="sm"
              onClick={refreshProjects}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button> */}
            <Link href="/dashboard/projects/new" className="w-full sm:w-auto">
              <Button 
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm group"
                size="lg"
              >
                <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                New Project
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid - Mobile Optimized */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card 
              key={stat.title} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-border bg-card min-h-[120px] sm:min-h-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between h-full">
                  <div className="flex-1">
                    <CardDescription className="font-medium text-muted-foreground text-xs sm:text-sm">
                      {stat.title}
                    </CardDescription>
                    <CardTitle className="text-xl sm:text-2xl font-bold group-hover:text-foreground/90 transition-colors text-foreground mt-1">
                      {stat.value}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                      {stat.description}
                    </p>
                    <p className={`text-xs font-medium ${stat.color} mt-1 hidden sm:block`}>
                      {stat.trend}
                    </p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-xl bg-muted ${stat.color} mt-2 sm:mt-0`}>
                    <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>
                </div>
                {/* Mobile only trend */}
                <p className={`text-xs font-medium ${stat.color} mt-1 block sm:hidden`}>
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Priority Alert for Questionnaire */}
      {projectStats.needsQuestionnaire > 0 && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-amber-900 dark:text-amber-100">
                  Action Required: Complete Questionnaires
                </h4>
                <p className="text-amber-700 dark:text-amber-300 text-sm">
                  {projectStats.needsQuestionnaire} project{projectStats.needsQuestionnaire > 1 ? 's' : ''} waiting for your preferences to start the design process
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Section */}
      <Card className="border-border bg-card">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="text-center sm:text-left">
              <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground">Your Projects</CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                {filteredProjects.length} of {projects.length} projects shown
              </CardDescription>
            </div>
            
            {/* Search and Filters - Mobile Optimized */}
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-border bg-background w-full"
                />
              </div>
              
              {/* Filters and View Toggle */}
              <div className="flex flex-col gap-3">
                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="sm:hidden flex items-center justify-between"
                >
                  <span>Filters & View</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>

                {/* Filters Container */}
                <div className={`${showFilters ? 'block' : 'hidden'} sm:flex sm:flex-col sm:gap-2 space-y-3 sm:space-y-0`}>
                  {/* Status Filters */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex flex-wrap gap-1 bg-muted p-1 rounded-lg">
                      {statusFilters.map((filter) => (
                        <Button
                          key={filter.key}
                          variant={statusFilter === filter.key ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setStatusFilter(filter.key)}
                          className="text-xs h-8 flex-1 sm:flex-none min-w-[60px]"
                        >
                          <span className="truncate">{filter.label}</span>
                          {filter.count > 0 && (
                            <Badge variant="secondary" className="ml-1 text-xs hidden sm:inline-flex">
                              {filter.count}
                            </Badge>
                          )}
                        </Button>
                      ))}
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex gap-1 bg-muted p-1 rounded-lg">
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="flex-1 sm:flex-none"
                      >
                        <List className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only sm:ml-1">List</span>
                      </Button>
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className="flex-1 sm:flex-none"
                      >
                        <Grid3X3 className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only sm:ml-1">Grid</span>
                      </Button>
                    </div>
                  </div>

                  {/* Mobile Filter Counts */}
                  <div className="flex flex-wrap gap-2 sm:hidden">
                    {statusFilters.map((filter) => (
                      <Badge 
                        key={filter.key} 
                        variant={statusFilter === filter.key ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {filter.label}: {filter.count}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {filteredProjects.length > 0 ? (
            <div className={`grid gap-4 sm:gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredProjects.map((project, index) => {
               
                const statusConfigItem = statusConfig[project.status]
                const StatusIcon = statusConfigItem?.icon
                
                return (
                  <ProjectCard
                    key={project.publicId || project.id || `project-${index}`}
                    project={{
                      ...project,
                      statusConfig: statusConfigItem,
                      StatusIcon,
                      questionnaireCompleted: project.status === 'QUESTIONNAIRE_COMPLETED' || project.questionnaireCompletedAt,
                      paymentCompleted: project.payments && project.payments.length > 0,
                      progress: calculateProjectProgress(project.status)
                    }}
                    viewMode={viewMode}
                    onStartQuestionnaire={handleStartQuestionnaire}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  />
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {searchQuery || statusFilter !== 'all' 
                  ? 'No projects found' 
                  : 'No projects yet'
                }
              </h3>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start your interior design journey by creating your first project'
                }
              </p>
              {(!searchQuery && statusFilter === 'all') && (
                <Link href="/dashboard/projects/new">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Project
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions Footer */}
      {filteredProjects.length > 0 && (
        <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <h3 className="text-lg font-semibold mb-2">Ready to start something new?</h3>
                <p className="text-slate-200 text-sm sm:text-base">
                  Create a new project and bring your vision to life with our powered design tools.
                </p>
              </div>
              <Link href="/dashboard/projects/new" className="w-full sm:w-auto">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-slate-100 transition-all duration-200 hover:scale-105 w-full sm:w-auto"
                >
                  Start New Project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Helper function to calculate project progress
function calculateProjectProgress(status) {
  const progressMap = {
    'DRAFT': 10,
    'UPLOADED': 25,
    'PAYMENT_COMPLETED': 30,
    'QUESTIONNAIRE_COMPLETED': 40,
    'STYLE_SELECTED': 55,
    'RENDER_IN_PROGRESS': 75,
    'RENDER_COMPLETED': 85,
    'BOQ_GENERATED': 90,
    'COMPLETED': 100,
    'CANCELLED': 0
  };
  
  return progressMap[status] || 0;
}