'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Tag, Plus } from "lucide-react"

export default function AddonsPage() {
    const addons = [
        { title: "Fast-Track Delivery", price: "₹1,999", description: "Get designs in 24 hours instead of 72" },
        { title: "Additional 3D Renders", price: "₹999/room", description: "3 extra views per room" },
        { title: "Video Consultation", price: "₹1,999", description: "1-hour with senior designer" },
        { title: "Vastu Compliance Check", price: "₹999", description: "Room-by-room Vastu report" },
        { title: "Detailed Budget Planning", price: "₹1,499", description: "Item-by-item quotes" }
    ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add-Ons & Upsells</h2>
          <p className="text-muted-foreground">Manage service add-ons and pricing</p>
        </div>
        <Button>
            <Plus className="mr-2 h-4 w-4" /> New Add-On
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {addons.map((addon, i) => (
             <Card key={i}>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{addon.title}</CardTitle>
                        <Zap className="w-5 h-5 text-yellow-500" />
                    </div>
                    <CardDescription>{addon.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end justify-between">
                        <div className="text-2xl font-bold">{addon.price}</div>
                        <Button size="sm" variant="outline">Edit</Button>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  )
}
