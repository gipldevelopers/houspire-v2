'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Plus, Edit } from "lucide-react"

export default function EmailTemplatesPage() {
    const templates = [
        { title: "Payment Confirmation", subject: "🎉 Welcome {name}! Your ₹{amount} Package Starts Now", uses: 1240 },
        { title: "Space Analysis Started", subject: "{name}, I'm Analyzing Your Space Now 🔍", uses: 890 },
        { title: "Designer Assigned", subject: "Meet Your Dream Team! 🎨", uses: 850 },
        { title: "Moodboards Ready", subject: "Your Designs Are Ready for Review! 😍", uses: 720 },
    ]
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Email Templates</h2>
          <p className="text-muted-foreground">Manage automated email communications</p>
        </div>
        <Button>
            <Plus className="mr-2 h-4 w-4" /> New Template
        </Button>
      </div>

      <div className="grid gap-4">
        {templates.map((template, i) => (
            <Card key={i}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            {template.title}
                        </CardTitle>
                        <CardDescription className="mt-1">Subject: {template.subject}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">{template.uses} sends all time</div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  )
}
