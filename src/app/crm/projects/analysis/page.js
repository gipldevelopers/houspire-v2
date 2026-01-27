'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Ruler, CheckCircle2, AlertTriangle } from "lucide-react"

export default function SpaceAnalysisPage() {
  const projects = [
    {
      id: "HOSP-2601-0147",
      customer: "Rohan Mehta",
      property: "3BHK, Bangalore",
      status: "In Progress",
      progress: 60,
      due: "Today, 5:00 PM"
    },
     {
      id: "HOSP-2601-0149",
      customer: "Anita Singhania",
      property: "4BHK Villa, Delhi",
      status: "Pending",
      progress: 0,
      due: "Tomorrow, 11:00 AM"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Space Analysis</h2>
          <p className="text-muted-foreground">Architectural analysis and measurement verification</p>
        </div>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
             <Card key={project.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                        <CardTitle className="text-lg">{project.customer}</CardTitle>
                        <CardDescription>{project.property} • {project.id}</CardDescription>
                    </div>
                    <Badge variant={project.status === "Pending" ? "destructive" : "default"}>
                        {project.status}
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-6 mt-2">
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Analysis Progress</div>
                            <div className="flex items-center gap-4">
                                <Progress value={project.progress} className="h-2 flex-1" />
                                <span className="text-sm font-bold">{project.progress}%</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                             <Ruler className="w-4 h-4 text-primary" />
                             <span>Analysis Due: <strong>{project.due}</strong></span>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">View Files</Button>
                            <Button size="sm">Continue Analysis</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  )
}
