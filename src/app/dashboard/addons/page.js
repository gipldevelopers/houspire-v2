// src/app/dashboard/addons/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Crown,
  Star,
  Shield,
  CheckCircle2,
  Zap,
  ShoppingCart,
  TrendingUp,
  Award,
  Rocket,
  Palette,
  Eye,
  Users,
  Gift,
  Sparkles,
  Check,
  Clock,
  BadgeCheck,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { packageService } from "@/services/package.service";
import { toast } from "sonner";

// Category configuration - simplified color scheme
const CATEGORIES = {
  all: {
    title: "All Services",
    icon: Filter,
    color: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
  },
  design: {
    title: "Design",
    icon: Palette,
    color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  },
  technical: {
    title: "Technical",
    icon: Zap,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  },
  support: {
    title: "Support",
    icon: Users,
    color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  },
  visualization: {
    title: "Visualization",
    icon: Eye,
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  },
};

// Benefits data - simplified
const BENEFITS = [
  { icon: Rocket, title: "Instant Access" },
  { icon: Shield, title: "Quality Guaranteed" },
  { icon: TrendingUp, title: "Better Results" },
  { icon: Award, title: "Expert Support" },
];

export default function AddonsPage() {
  const router = useRouter();
  const [addons, setAddons] = useState([]);
  const [filteredAddons, setFilteredAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadAddons();
  }, []);

  const loadAddons = async () => {
    setLoading(true);
    try {
      const result = await packageService.getAddons(true);
      if (result.success && result.data?.addons) {
        const addonsWithCategory = result.data.addons.map((addon) => ({
          ...addon,
          category: addon.category || "design",
        }));
        setAddons(addonsWithCategory);
        setFilteredAddons(addonsWithCategory);
      } else {
        setAddons([]);
        setFilteredAddons([]);
      }
    } catch (error) {
      console.error("Error loading addons:", error);
      toast.error("Failed to load premium services");
      setAddons([]);
      setFilteredAddons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredAddons(addons);
    } else {
      setFilteredAddons(
        addons.filter((addon) => addon.category === selectedCategory)
      );
    }
  }, [selectedCategory, addons]);

  const handlePurchase = (addon) => {
    const purchaseData = {
      type: "ADDON",
      addon: {
        id: addon.id,
        name: addon.name,
        description: addon.description,
        price: addon.price,
        currency: addon.currency || "INR",
        category: addon.category,
      },
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem("addonPurchaseData", JSON.stringify(purchaseData));
    
    toast.success(`Adding ${addon.name} to cart`);
    setTimeout(() => {
      router.push("/packages?type=addons-only");
    }, 1000);
  };

  if (loading) {
    return <AddonsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Premium Services
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Enhance Your{" "}
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Project
            </span>
          </h1>
          
          <p className="text-muted-foreground max-w-xl mx-auto">
            Professional add-ons to elevate your design experience
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card text-center"
              >
                <Icon className="w-6 h-6 mb-2 text-primary" />
                <span className="text-sm font-medium">{benefit.title}</span>
              </div>
            );
          })}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(CATEGORIES).map(([key, category]) => {
            const Icon = category.icon;
            const count = key === "all" ? addons.length : addons.filter(a => a.category === key).length;
            const isActive = selectedCategory === key;
            
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.title}
                {count > 0 && (
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                    isActive ? "bg-primary-foreground/20" : "bg-muted-foreground/10"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Addons Grid */}
        {filteredAddons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAddons.map((addon) => {
              const categoryConfig = CATEGORIES[addon.category] || CATEGORIES.design;
              const Icon = categoryConfig.icon;

              return (
                <Card key={addon.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${categoryConfig.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {addon.isPopular && (
                        <Badge variant="secondary" className="gap-1">
                          <Star className="w-3 h-3" />
                          Popular
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-3 mb-6">
                      <h3 className="text-xl font-semibold">{addon.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {addon.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>Instant activation</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>Quality guaranteed</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>Professional support</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">One-time purchase</p>
                        <p className="text-2xl font-bold">₹{addon.price?.toLocaleString("en-IN")}</p>
                      </div>
                      
                      <Button
                        onClick={() => handlePurchase(addon)}
                        className="gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Services Found</h3>
              <p className="text-muted-foreground mb-6">
                {selectedCategory !== "all" 
                  ? "Try selecting a different category" 
                  : "Premium services coming soon"}
              </p>
              {selectedCategory !== "all" && (
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCategory("all")}
                >
                  View All Services
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Guarantee Section */}
        {filteredAddons.length > 0 && (
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <BadgeCheck className="w-10 h-10 text-primary" />
                  <div>
                    <h3 className="font-semibold">100% Satisfaction Guaranteed</h3>
                    <p className="text-sm text-muted-foreground">
                      Full refund within 7 days if not satisfied
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Loading Skeleton
function AddonsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-6 w-32 mx-auto rounded-full" />
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-4 w-80 mx-auto" />
        </div>

        {/* Benefits Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>

        {/* Filter Skeleton */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <Skeleton className="w-16 h-6" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-7 w-16" />
                  </div>
                  <Skeleton className="h-10 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}