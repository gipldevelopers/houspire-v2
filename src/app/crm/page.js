// src/app/crm/page.js
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  FolderKanban,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Calendar,
  ArrowRight,
  Activity,
  Target,
  Zap,
  UserPlus,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

export default function CRMDashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeProjects: 0,
    pendingTasks: 0,
    revenue: 0,
    todayProjects: 0,
    overdueProjects: 0,
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  useEffect(() => {
    // TODO: Fetch real data from API
    setStats({
      totalCustomers: 1247,
      activeProjects: 89,
      pendingTasks: 23,
      revenue: 1245000,
      todayProjects: 12,
      overdueProjects: 3,
    });

    setRecentProjects([
      {
        id: 1,
        customerName: 'Rohan Mehta',
        projectId: 'HOSP-2601-0147',
        package: 'Smart Home',
        status: 'Design Phase',
        timeline: '24 hours',
        designer: 'Priya Sharma',
        progress: 65,
      },
      {
        id: 2,
        customerName: 'Neha Patel',
        projectId: 'HOSP-2601-0148',
        package: 'Single Room',
        status: 'Analysis Phase',
        timeline: '48 hours',
        designer: 'Amit Kumar',
        progress: 30,
      },
    ]);

    setUpcomingTasks([
      {
        id: 1,
        title: 'Review space analysis for HOSP-2601-0147',
        due: 'Today, 3:00 PM',
        assignee: 'Priya Sharma',
        priority: 'high',
      },
      {
        id: 2,
        title: 'Send moodboards to customer',
        due: 'Tomorrow, 10:00 AM',
        assignee: 'Amit Kumar',
        priority: 'medium',
      },
    ]);
  }, []);

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      change: '+5',
      trend: 'up',
      icon: FolderKanban,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingTasks,
      change: '-3',
      trend: 'down',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      title: 'Revenue (This Month)',
      value: `₹${(stats.revenue / 100000).toFixed(1)}L`,
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">CRM Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage customers, projects, and team workflows
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp
                    className={`h-3 w-3 ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  />
                  <span
                    className={
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground"> from last month</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alerts & Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Urgent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Overdue Projects</p>
                  <p className="text-sm text-muted-foreground">{stats.overdueProjects} projects need attention</p>
                </div>
                <Badge variant="destructive">{stats.overdueProjects}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Today's Deadlines</p>
                  <p className="text-sm text-muted-foreground">{stats.todayProjects} projects due today</p>
                </div>
                <Badge variant="default">{stats.todayProjects}</Badge>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/crm/projects?filter=urgent">
                  View All Urgent Items
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-auto flex-col py-3" asChild>
                <Link href="/crm/customers/new">
                  <UserPlus className="h-5 w-5 mb-1" />
                  <span className="text-xs">New Customer</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-3" asChild>
                <Link href="/crm/projects/new">
                  <FolderKanban className="h-5 w-5 mb-1" />
                  <span className="text-xs">New Project</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-3" asChild>
                <Link href="/crm/communications/emails/new">
                  <Mail className="h-5 w-5 mb-1" />
                  <span className="text-xs">Send Email</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-3" asChild>
                <Link href="/crm/tasks/new">
                  <Calendar className="h-5 w-5 mb-1" />
                  <span className="text-xs">Create Task</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects & Tasks */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Projects</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/crm/projects">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-start justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{project.customerName}</p>
                      <Badge variant="outline" className="text-xs">
                        {project.projectId}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {project.package} • {project.status}
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1.5" />
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Designer: {project.designer}</span>
                      <span>•</span>
                      <span>{project.timeline} remaining</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Tasks</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/crm/tasks">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className={`p-1.5 rounded ${
                    task.priority === 'high' ? 'bg-red-100 dark:bg-red-900/20' :
                    task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                    'bg-blue-100 dark:bg-blue-900/20'
                  }`}>
                    <Target className={`h-4 w-4 ${
                      task.priority === 'high' ? 'text-red-600' :
                      task.priority === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{task.assignee}</span>
                      <span>•</span>
                      <span>{task.due}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
