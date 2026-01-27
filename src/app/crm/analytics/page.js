'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, FolderKanban } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics & Reports</h2>
          <p className="text-muted-foreground">Insights into performance and revenue</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Stats Cards - Simplified for demo */}
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+180 from last month</p>
            </CardContent>
         </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">₹8,450</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
         </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-md">
                    Chart Placeholder
                </div>
            </CardContent>
        </Card>
         <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Top Add-Ons</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="space-y-8">
                    <div className="flex items-center">
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">Fast-Track Delivery</p>
                            <p className="text-sm text-muted-foreground">245 sales this month</p>
                        </div>
                        <div className="ml-auto font-medium">+₹4.8L</div>
                    </div>
                    <div className="flex items-center">
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">Vastu Check</p>
                            <p className="text-sm text-muted-foreground">190 sales this month</p>
                        </div>
                        <div className="ml-auto font-medium">+₹1.9L</div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
