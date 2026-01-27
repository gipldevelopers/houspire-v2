'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, User, Bell, Shield, Wallet } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer hover:bg-accent/50">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><User className="w-5 h-5"/> Profile</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Manage your personal info</CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-accent/50">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5"/> Notifications</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Configure alert preferences</CardContent>
          </Card>
           <Card className="cursor-pointer hover:bg-accent/50">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5"/> Security</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Password and access control</CardContent>
          </Card>
      </div>
    </div>
  )
}
