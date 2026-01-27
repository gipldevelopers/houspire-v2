'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Eye } from "lucide-react"

export default function IntakeFormsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Intake Forms</h2>
          <p className="text-muted-foreground">Review customer submissions and design briefs</p>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Design requirements submitted by customers</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Project Type</TableHead>
                        <TableHead>Submitted On</TableHead>
                        <TableHead>Completeness</TableHead>
                         <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">Rohan Mehta</TableCell>
                        <TableCell>3BHK Apartment</TableCell>
                        <TableCell>Today, 2:30 PM</TableCell>
                        <TableCell>
                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">100% Complete</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button size="sm" variant="ghost" className="gap-2">
                                <Eye className="w-4 h-4" /> View Brief
                            </Button>
                        </TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell className="font-medium">Sanya Mirza</TableCell>
                        <TableCell>4BHK Villa</TableCell>
                        <TableCell>Yesterday</TableCell>
                        <TableCell>
                            <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Draft (45%)</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                             <Button size="sm" variant="ghost" className="gap-2">
                                <Eye className="w-4 h-4" /> View
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  )
}
