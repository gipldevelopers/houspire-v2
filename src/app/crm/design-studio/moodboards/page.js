'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"

export default function DesignStudioMoodboards() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Design Studio</h2>
          <p className="text-muted-foreground">Create and share moodboards with clients</p>
        </div>
        <Button>
            <Plus className="mr-2 h-4 w-4" /> New Moodboard
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Placeholder Moodboard Card */}
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <div className="h-40 bg-muted rounded-t-lg w-full flex items-center justify-center text-muted-foreground">
                        Preview Image
                    </div>
                    <CardHeader>
                        <CardTitle className="text-lg">Modern Scandinavian</CardTitle>
                        <CardDescription>Client: Rohan Mehta</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                             <Badge variant="secondary">Living Room</Badge>
                             <Badge variant="outline">In Review</Badge>
                        </div>
                    </CardContent>
                </Card>
                 <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <div className="h-40 bg-muted rounded-t-lg w-full flex items-center justify-center text-muted-foreground">
                        Preview Image
                    </div>
                    <CardHeader>
                        <CardTitle className="text-lg">Bohemian Vibes</CardTitle>
                        <CardDescription>Client: Neha Patel</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                             <Badge variant="secondary">Bedroom</Badge>
                             <Badge variant="outline">Draft</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
