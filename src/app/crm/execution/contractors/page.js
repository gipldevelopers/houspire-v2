'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, Star } from "lucide-react"

export default function ContractorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contractors</h2>
          <p className="text-muted-foreground">Verified contractors for project execution</p>
        </div>
        <Button>Onboard Contractor</Button>
      </div>

      <div className="grid gap-6">
        {[1, 2].map((i) => (
             <Card key={i}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarFallback>KC</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle>Kumar Constructions</CardTitle>
                                <CardDescription>Civil Work • Painting • False Ceiling</CardDescription>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="flex items-center gap-1 text-sm font-medium text-yellow-600">
                                <Star className="w-4 h-4 fill-current" /> 4.8 (24 Reviews)
                             </div>
                             <div className="text-xs text-muted-foreground">Bangalore • Active since 2022</div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Verified Partner
                        </div>
                         <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> 1-Year Warranty
                        </div>
                         <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> 50+ Projects
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <Button size="sm">Assign Project</Button>
                        <Button size="sm" variant="outline">View Profile</Button>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  )
}
