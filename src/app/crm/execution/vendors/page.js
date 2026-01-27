'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Phone } from "lucide-react"

export default function VendorDirectoryPage() {
  const vendors = [
    { id: 1, name: "Urban Ladder", category: "Furniture", location: "Whitefield, Bangalore", rating: 4.5 },
    { id: 2, name: "Sleek Kitchens", category: "Modular Kitchen", location: "Koramangala, Bangalore", rating: 4.8 },
    { id: 3, name: "Asian Paints", category: "Paint & Wallpaper", location: "Indiranagar, Bangalore", rating: 4.9 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vendor Directory</h2>
          <p className="text-muted-foreground">Manage and find verified suppliers</p>
        </div>
        <Button>Add Vendor</Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Input placeholder="Search vendors..." className="max-w-sm" />
        <Button variant="ghost" size="icon"><Search className="w-4 h-4" /></Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vendors.map((vendor) => (
            <Card key={vendor.id}>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{vendor.name}</CardTitle>
                        <Badge variant="secondary">{vendor.category}</Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {vendor.location}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mt-2">
                        <div className="text-sm font-medium">Rating: {vendor.rating} ⭐</div>
                        <Button size="sm" variant="outline" className="gap-2">
                            <Phone className="w-3 h-3" /> Contact
                        </Button>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  )
}
