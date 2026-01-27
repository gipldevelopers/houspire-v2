'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Plus, Edit } from "lucide-react"

export default function WhatsAppTemplatesPage() {
   const templates = [
        { title: "Payment Success", body: "🎉 Hi {name}! Your payment is confirmed! Order: {orderId}...", uses: 1240 },
        { title: "Analysis Complete", body: "📐 Hi {name}! Quick update: Space analysis 50% done!...", uses: 890 },
    ]
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">WhatsApp Templates</h2>
          <p className="text-muted-foreground">Manage automated WhatsApp messages</p>
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
                            <Phone className="w-4 h-4 text-green-600" />
                            {template.title}
                        </CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">{template.body}</CardDescription>
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
