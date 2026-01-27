'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, CheckCircle2 } from "lucide-react"

export default function VastuAnalysis() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vastu Specialist</h2>
          <p className="text-muted-foreground">Perform Vastu checks and generate reports</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Pending Checks</CardTitle>
                <CardDescription>Projects requiring Vastu analysis</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-accent/20">
                        <div className="flex items-center gap-3">
                             <div className="bg-primary/10 p-2 rounded-full">
                                <FileText className="w-5 h-5 text-primary" />
                             </div>
                             <div>
                                <div className="font-medium">Rohan Mehta - 3BHK</div>
                                <div className="text-xs text-muted-foreground">Due Today</div>
                             </div>
                        </div>
                        <Button size="sm">Start Analysis</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Completed Reports</CardTitle>
                <CardDescription>Recently generated Vastu reports</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                             <CheckCircle2 className="w-5 h-5 text-green-500" />
                             <div>
                                <div className="font-medium">Suresh Kumar - Villa</div>
                                <div className="text-xs text-muted-foreground">Completed Jan 12</div>
                             </div>
                        </div>
                        <Button size="sm" variant="ghost">
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
