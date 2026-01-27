// src/app/crm/intake-forms/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  Clock,
  User,
  Home,
  Palette,
  DollarSign,
  Calendar,
  Building,
  Ruler,
  Phone,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

export default function IntakeFormDetailPage() {
  const params = useParams();
  const formId = params.id;
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from API
    setFormData({
      id: formId,
      projectId: 'HOSP-2601-0147',
      customerName: 'Rohan Mehta',
      status: 'Completed',
      completedAt: '2026-01-13 16:30',
      sections: {
        builderProvided: {
          painting: true,
          flooring: true,
          electrical: true,
          plumbing: true,
          doors: true,
          windows: true,
          falseCeiling: true,
          kitchenPlatform: true,
          totalValue: 120000,
        },
        existingFurniture: [
          {
            item: 'Sofa',
            room: 'Living Room',
            condition: 'Good',
            mustKeep: true,
            dimensions: '8ft × 3ft × 3ft',
            description: 'Brown leather L-shaped sofa, 8-seater',
          },
          {
            item: 'Bed',
            room: 'Master Bedroom',
            condition: 'Excellent',
            mustKeep: true,
            dimensions: '6ft × 6ft',
            description: 'Queen size bed with storage',
          },
        ],
        colorPreferences: {
          loves: ['White', 'Grey', 'Blue'],
          hates: ['Red', 'Neon'],
          scheme: 'Neutral with 1 Accent Color',
          finish: 'Matte',
        },
        roomRequirements: {
          livingRoom: {
            seatingCapacity: '6-8 people',
            mustHaves: ['TV Unit (55")', 'Pooja Corner', 'Coffee Table', 'Display Unit'],
            seatingPreference: 'L-Shaped Sofa',
            lighting: ['Cove Lighting', 'Statement Chandelier', 'Table Lamps'],
          },
          masterBedroom: {
            bedSize: 'King',
            mustHaves: ['8ft Wardrobe (Sliding)', 'Dresser with Mirror', 'Reading Nook', 'TV Unit'],
            storageNeeds: 'Heavy',
            attachedBathroom: true,
          },
          kitchen: {
            modular: 'Undecided',
            mustHaves: ['Chimney', 'Hob', 'Storage Priority'],
            layout: 'L-shape',
          },
          dining: {
            seating: '6-seater',
            mustHaves: ['Display Unit', 'Chandelier'],
          },
        },
        budget: {
          total: 750000,
          allocation: {
            furniture: 40,
            modularKitchen: 20,
            wardrobes: 15,
            lighting: 5,
            decor: 5,
            curtains: 3,
            painting: 5,
            contingency: 7,
          },
          flexibility: 'Flexible (can increase by 10-15%)',
          existingPurchases: [],
        },
        execution: {
          whoWillExecute: 'Need recommendations',
          startTimeline: 'Within 1 month',
          moveInDate: '2026-04-15',
          phasing: 'No, all at once',
        },
        household: {
          adults: 2,
          children: 2,
          childrenAges: [5, 8],
          lifestyle: ['Work from Home', 'Love Hosting'],
          routines: {
            morningPerson: true,
            entertainment: ['Watch movies/shows', 'Reading'],
          },
        },
        specialRequests: {
          dealBreakers: 'No red colors anywhere',
          mustHaves: 'Guitar display wall in living room',
          accessibility: false,
          messageToDesigner: 'I\'m worried about kitchen being too dark',
        },
      },
    });
    setLoading(false);
  }, [formId]);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (!formData) {
    return <div>Form not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/crm/intake-forms">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Intake Form Details</h1>
            <p className="text-muted-foreground mt-1">
              {formData.customerName} • {formData.projectId}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
            {formData.status}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Completed: {new Date(formData.completedAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Form Sections */}
      <Tabs defaultValue="builder" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="builder">Builder Items</TabsTrigger>
          <TabsTrigger value="furniture">Existing Items</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="rooms">Room Details</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Builder-Provided Items
              </CardTitle>
              <CardDescription>
                Items provided by builder (Total Value: ₹{formData.sections.builderProvided.totalValue.toLocaleString()})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(formData.sections.builderProvided)
                  .filter(([key]) => key !== 'totalValue')
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <Badge variant={value ? 'default' : 'outline'}>
                        {value ? 'Provided' : 'Not Provided'}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="furniture" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Existing Furniture & Items to Retain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.sections.existingFurniture.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{item.item}</h3>
                          <Badge>{item.room}</Badge>
                        </div>
                        <div className="grid gap-2 md:grid-cols-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Condition: </span>
                            <span>{item.condition}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Must Keep: </span>
                            <Badge variant={item.mustKeep ? 'default' : 'outline'}>
                              {item.mustKeep ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Dimensions: </span>
                            <span>{item.dimensions}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium mb-2">Colors You Love</p>
                <div className="flex flex-wrap gap-2">
                  {formData.sections.colorPreferences.loves.map((color, index) => (
                    <Badge key={index} variant="outline">{color}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium mb-2">Colors You Want to Avoid</p>
                <div className="flex flex-wrap gap-2">
                  {formData.sections.colorPreferences.hates.map((color, index) => (
                    <Badge key={index} variant="destructive">{color}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium mb-2">Color Scheme Preference</p>
                <Badge>{formData.sections.colorPreferences.scheme}</Badge>
              </div>
              <div>
                <p className="font-medium mb-2">Paint Finish</p>
                <Badge variant="outline">{formData.sections.colorPreferences.finish}</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-4">
          {Object.entries(formData.sections.roomRequirements).map(([room, details]) => (
            <Card key={room}>
              <CardHeader>
                <CardTitle className="capitalize">{room.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(details).map(([key, value]) => (
                    <div key={key} className="flex items-start justify-between">
                      <span className="text-sm font-medium text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <div className="text-right max-w-md">
                        {Array.isArray(value) ? (
                          <div className="flex flex-wrap gap-1 justify-end">
                            {value.map((item, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        ) : typeof value === 'boolean' ? (
                          <Badge variant={value ? 'default' : 'outline'}>
                            {value ? 'Yes' : 'No'}
                          </Badge>
                        ) : (
                          <span className="text-sm">{value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Budget Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-2xl font-bold mb-4">
                  ₹{formData.sections.budget.total.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Flexibility: {formData.sections.budget.flexibility}
                </p>
              </div>
              <div className="space-y-3">
                {Object.entries(formData.sections.budget.allocation).map(([category, percentage]) => (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm font-medium">
                        {percentage}% (₹{((formData.sections.budget.total * percentage) / 100).toLocaleString()})
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Execution Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Who will execute</span>
                <span>{formData.sections.execution.whoWillExecute}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Start timeline</span>
                <span>{formData.sections.execution.startTimeline}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Move-in date</span>
                <span>{new Date(formData.sections.execution.moveInDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Phasing</span>
                <span>{formData.sections.execution.phasing}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Household Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Adults</span>
                <span>{formData.sections.household.adults}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Children</span>
                <span>
                  {formData.sections.household.children} (Ages:{' '}
                  {formData.sections.household.childrenAges.join(', ')})
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Lifestyle: </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.sections.household.lifestyle.map((item, index) => (
                    <Badge key={index} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Special Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium mb-1">Deal-Breakers</p>
                <p className="text-sm text-muted-foreground">
                  {formData.sections.specialRequests.dealBreakers}
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Must-Haves</p>
                <p className="text-sm text-muted-foreground">
                  {formData.sections.specialRequests.mustHaves}
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Message to Designer</p>
                <p className="text-sm text-muted-foreground">
                  {formData.sections.specialRequests.messageToDesigner}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
