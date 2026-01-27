'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Image as ImageIcon, Upload, Layers } from "lucide-react"

export default function RendersPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">3D Renders</h2>
          <p className="text-muted-foreground">Manage high-quality conceptual renders</p>
        </div>
        <Button>
            <Upload className="mr-2 h-4 w-4" /> Upload New Render
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Mock Renders */}
        {[1, 2, 3, 4].map((i) => (
             <Card key={i} className="overflow-hidden group">
                <div className="aspect-video bg-muted relative">
                    {/* Placeholder for render */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="w-8 h-8 opacity-50" />
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="sm" variant="secondary">View</Button>
                        <Button size="sm" variant="secondary">Download</Button>
                    </div>
                </div>
                <CardContent className="p-3">
                    <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium text-sm">Living Room View {i}</h4>
                        <Badge variant="outline" className="text-[10px]">4K Ready</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Project: HOSP-2601-0147</p>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  )
}
