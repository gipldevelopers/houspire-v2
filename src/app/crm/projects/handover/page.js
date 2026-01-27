'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, CheckCircle, Download } from "lucide-react"

export default function HandoverReadyPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Handover Ready</h2>
          <p className="text-muted-foreground">Final package generation and project delivery</p>
        </div>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-green-200 bg-green-50/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Ready to Deliver
                    </CardTitle>
                    <CardDescription>HOSP-2512-0098 • Amit Patel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-sm">
                        <p>✓ All designs approved</p>
                        <p>✓ BOQ finalized</p>
                        <p>✓ Payment cleared</p>
                    </div>
                    <Button className="w-full gap-2">
                        <Package className="w-4 h-4" /> Generate Package
                    </Button>
                </CardContent>
            </Card>
       </div>
    </div>
  )
}
