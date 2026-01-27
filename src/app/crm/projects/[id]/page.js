'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  FileText,
  MessageSquare,
  DollarSign,
  PenTool,
  Upload,
  MoreVertical,
  Flag,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id;
  const [activeTab, setActiveTab] = useState('overview');

  // Mock Data
  const project = {
    id: projectId,
    title: '3BHK Interior Design',
    customer: 'Rohan Mehta',
    status: 'In Progress',
    phase: 'Design Phase',
    progress: 65,
    startDate: '2026-01-13',
    deadline: '2026-01-14',
    designer: 'Priya Sharma',
    budget: '₹7,50,000',
    spent: '₹1,20,000',
    priority: 'High',
  };

  const tasks = [
    { id: 1, title: 'Space Analysis', status: 'Completed', date: 'Jan 13' },
    { id: 2, title: 'Moodboard Creation', status: 'Completed', date: 'Jan 13' },
    { id: 3, title: '3D Renders', status: 'In Progress', date: 'Due Jan 14' },
    { id: 4, title: 'BOQ Finalization', status: 'Pending', date: 'Due Jan 14' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/crm/projects">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
              <Badge variant="secondary">{project.status}</Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              {project.id} • {project.customer} • <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Due {project.deadline}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline">
             <MessageSquare className="mr-2 h-4 w-4" /> Message Team
           </Button>
           <Button>
             <PenTool className="mr-2 h-4 w-4" /> Open Design Studio
           </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-5 space-y-6">
          {/* Progress & Status */}
          <Card>
            <CardHeader>
               <div className="flex justify-between items-center">
                   <CardTitle>Project Progress</CardTitle>
                   <span className="text-sm font-medium">{project.progress}%</span>
               </div>
            </CardHeader>
            <CardContent>
               <Progress value={project.progress} className="h-2 mb-4" />
               <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="space-y-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 mx-auto">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-medium">Analysis</p>
                  </div>
                   <div className="space-y-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mx-auto">
                        <PenTool className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-medium">Design</p>
                  </div>
                   <div className="space-y-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-400 mx-auto">
                        <FileText className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-medium text-muted-foreground">BOQ</p>
                  </div>
                   <div className="space-y-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-400 mx-auto">
                        <Flag className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-medium text-muted-foreground">Handover</p>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Project Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Budget</span>
                            <span className="font-medium">{project.budget}</span>
                        </div>
                        <Separator />
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Spent</span>
                            <span className="font-medium">{project.spent}</span>
                        </div>
                         <Separator />
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Start Date</span>
                            <span className="font-medium">{project.startDate}</span>
                        </div>
                        <Separator />
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Priority</span>
                            <Badge variant="destructive">{project.priority}</Badge>
                        </div>
                    </CardContent>
                  </Card>
                   <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Files</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                         <div className="flex items-center gap-3 p-2 border rounded hover:bg-accent/50 cursor-pointer">
                            <FileText className="w-8 h-8 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium">Floor Plan.pdf</p>
                                <p className="text-xs text-muted-foreground">Uploaded Jan 13</p>
                            </div>
                         </div>
                          <div className="flex items-center gap-3 p-2 border rounded hover:bg-accent/50 cursor-pointer">
                            <PenTool className="w-8 h-8 text-purple-500" />
                            <div>
                                <p className="text-sm font-medium">Moodboard V1.png</p>
                                <p className="text-xs text-muted-foreground">Uploaded Jan 13</p>
                            </div>
                         </div>
                    </CardContent>
                  </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="tasks">
                 <Card>
                    <CardHeader>
                        <CardTitle>Project Tasks</CardTitle>
                        <CardDescription>Manage daily deliverables</CardDescription>
                    </CardHeader>
                     <CardContent>
                        <div className="space-y-4">
                            {tasks.map((task) => (
                                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${task.status === 'Completed' ? 'bg-green-500' : task.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                                        <span>{task.title}</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">{task.date}</span>
                                </div>
                            ))}
                        </div>
                     </CardContent>
                 </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Team</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarFallback>PS</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">Priya Sharma</p>
                            <p className="text-xs text-muted-foreground">Lead Designer</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarFallback>RK</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">Rohan Kumar</p>
                            <p className="text-xs text-muted-foreground">Analyst</p>
                        </div>
                    </div>
                     <Button variant="outline" className="w-full text-xs">Manage Team</Button>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Customer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarFallback>RM</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">Rohan Mehta</p>
                            <p className="text-xs text-muted-foreground">Bangalore • 3BHK</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                         <Button size="icon" variant="outline" className="flex-1"><MessageSquare className="w-4 h-4" /></Button>
                         <Button size="icon" variant="outline" className="flex-1"><User className="w-4 h-4" /></Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
