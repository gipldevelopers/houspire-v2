'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calculator, Download } from "lucide-react"

export default function BOQPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">BOQ & Budget</h2>
          <p className="text-muted-foreground">Bill of Quantities management</p>
        </div>
         <Button>
            <Calculator className="mr-2 h-4 w-4" /> Create New BOQ
        </Button>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>Recent BOQs</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Project ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Total Value</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         <TableRow>
                            <TableCell className="font-medium">HOSP-2601-0147</TableCell>
                            <TableCell>Rohan Mehta</TableCell>
                            <TableCell>₹8,70,000</TableCell>
                            <TableCell><Badge variant="outline">Draft</Badge></TableCell>
                            <TableCell className="text-right">
                                <Button size="sm" variant="ghost">Edit</Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">HOSP-2601-0145</TableCell>
                            <TableCell>Priya Singh</TableCell>
                            <TableCell>₹4,50,000</TableCell>
                            <TableCell><Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0">Approved</Badge></TableCell>
                            <TableCell className="text-right">
                                <Button size="sm" variant="ghost"><Download className="w-4 h-4"/></Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
       </Card>
    </div>
  )
}
