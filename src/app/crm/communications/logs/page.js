'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function CommunicationLogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Communication Logs</h2>
          <p className="text-muted-foreground">History of automated messages sent</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Channel</TableHead>
                        <TableHead>Template</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                     <TableRow>
                        <TableCell>Today, 2:35 PM</TableCell>
                        <TableCell>Rohan Mehta</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Payment Confirmation</TableCell>
                        <TableCell><Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0">Sent</Badge></TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell>Today, 2:35 PM</TableCell>
                        <TableCell>Rohan Mehta</TableCell>
                        <TableCell>WhatsApp</TableCell>
                        <TableCell>Payment Success</TableCell>
                        <TableCell><Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0">Delivered</Badge></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  )
}
