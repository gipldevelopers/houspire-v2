'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PenTool, Image as ImageIcon, Send } from "lucide-react"

export default function DesignPhasePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Design Phase</h2>
          <p className="text-muted-foreground">Concept creation, 3D modelling, and client reviews</p>
        </div>
      </div>

       <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Rohan Mehta - 3BHK</CardTitle>
                            <CardDescription>Status: Moodboard Review</CardDescription>
                        </div>
                        <Badge variant="secondary">Urgent</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 bg-muted/40 rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-sm">Current Task</h4>
                                <span className="text-xs text-muted-foreground">Due Tomorrow 9 AM</span>
                            </div>
                            <p className="text-sm">Create 3 concepts (Contemporary + Scandi)</p>
                            <div className="flex gap-2">
                                <Button size="sm" className="gap-2">
                                    <PenTool className="w-4 h-4" /> Open Editor
                                </Button>
                                <Button size="sm" variant="outline" className="gap-2">
                                    <ImageIcon className="w-4 h-4" /> View References
                                </Button>
                            </div>
                        </div>
                         <div className="flex-1 bg-muted/40 rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-sm">Client Action</h4>
                            </div>
                             <p className="text-sm text-muted-foreground">Waiting for client input on Form #1.5</p>
                            <Button size="sm" variant="ghost" className="gap-2 text-primary hover:text-primary/80">
                                <Send className="w-4 h-4" /> Resend Reminder
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
       </div>
    </div>
  )
}
