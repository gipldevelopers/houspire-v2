// src\components\admin\boq\AdminBOQStats.js
"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Send,
} from "lucide-react";

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  color = "blue",
  trend,
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600",
    amber: "from-amber-500 to-amber-600",
    purple: "from-purple-500 to-purple-600",
    red: "from-red-500 to-red-600",
  };

  return (
    <Card className="border-border bg-card hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {/* {trend && (
              <div className={`flex items-center gap-1 text-xs ${
                trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-muted-foreground'
              }`}>
                <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
                <span>{Math.abs(trend)}% from last month</span>
              </div>
            )} */}
          </div>
          <div
            className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} text-white`}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// src/components/admin/boq/AdminBOQStats.js

export default function AdminBOQStats({ stats }) {
  // Ensure stats object has all required properties with fallbacks
  const safeStats = {
    total: Number(stats?.total) || 0,
    totalAmount: Number(stats?.totalAmount) || 0,
    pending: Number(stats?.pending) || 0,
    sent: Number(stats?.sent) || 0,
    generated: Number(stats?.generated) || 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total BOQs"
        value={safeStats.total}
        description="All created BOQs"
        // 🛑 CHANGE 1: Pass the component reference (FileText)
        icon={FileText}
        color="blue" // Use the key defined in StatCard's colorClasses
      />
      <StatCard
        title="Total Amount"
        value={"₹" + safeStats.totalAmount}
        description="Combined value of all BOQs"
        // 🛑 CHANGE 2: Pass the component reference (IndianRupee)
        icon={IndianRupee}
        color="green" // Use the key defined in StatCard's colorClasses
      />
      <StatCard
        title="Pending Review"
        value={safeStats.pending}
        description="BOQs awaiting action"
        // 🛑 CHANGE 3: Pass the component reference (Clock)
        icon={Clock}
        color="orange" // Changed from 'amber' to 'orange' or update colorClasses
      />
      <StatCard
        title="Sent to Clients"
        value={safeStats.sent}
        description="BOQs shared with clients"
        // 🛑 CHANGE 4: Pass the component reference (Send)
        icon={Send}
        color="purple"
      />
    </div>
  );
}
