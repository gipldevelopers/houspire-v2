// src/components/crm/CRMSidebar.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
// FIX: Import the hook 'useAuth' instead of the context directly
import { useAuth } from '@/context/AuthContext'; 
import {
  Home,
  Users,
  FolderKanban,
  Mail,
  MessageSquare,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Package,
  FileText,
  Zap,
  Briefcase,
  Phone,
  Send,
  PenTool,
  Compass, 
  ShoppingBag,
  HardHat, 
  Layers,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Navigation structure
const navigation = [
  {
    name: 'Overview',
    href: '/crm',
    icon: Home,
  },
  {
    name: 'Sales & Orders',
    href: '/crm/orders',
    icon: ShoppingBag,
    badge: '3',
  },
  {
    name: 'Projects',
    href: '/crm/projects',
    icon: FolderKanban,
    children: [
      { name: 'Active Projects', href: '/crm/projects?status=active', icon: Layers },
      { name: 'Space Analysis', href: '/crm/projects/analysis', icon: FileText },
      { name: 'Design Phase', href: '/crm/projects/design', icon: PenTool },
      { name: 'Handover Ready', href: '/crm/projects/handover', icon: Package },
    ],
  },
  {
    name: 'Customers',
    href: '/crm/customers',
    icon: Users,
  },
  {
    name: 'Design Studio',
    href: '/crm/design-studio',
    icon: PenTool,
    children: [
      { name: 'Moodboards', href: '/crm/design-studio/moodboards', icon: Layers },
      { name: '3D Renders', href: '/crm/design-studio/renders', icon: FileText },
    ]
  },
  {
    name: 'Vastu & Budget',
    href: '/crm/specialists',
    icon: Compass,
    children: [
      { name: 'Vastu Checks', href: '/crm/specialists/vastu', icon: Compass },
      { name: 'BOQ & Budget', href: '/crm/specialists/boq', icon: FileText },
    ]
  },
  {
    name: 'Execution & Vendors',
    href: '/crm/execution',
    icon: HardHat,
    children: [
      { name: 'Vendor Directory', href: '/crm/execution/vendors', icon: Users },
      { name: 'Contractors', href: '/crm/execution/contractors', icon: Briefcase },
    ]
  },
  {
    name: 'Communications',
    href: '/crm/communications',
    icon: MessageSquare,
    children: [
      { name: 'Email Templates', href: '/crm/communications/emails', icon: Mail },
      { name: 'WhatsApp Templates', href: '/crm/communications/whatsapp', icon: Phone },
      { name: 'Automated Logs', href: '/crm/communications/logs', icon: Send },
    ],
  },
  {
    name: 'Tasks & Timeline',
    href: '/crm/tasks',
    icon: Calendar,
    badge: 'Urgent',
  },
  {
    name: 'Intake Forms',
    href: '/crm/intake-forms',
    icon: FileText,
  },
  {
    name: 'Add-Ons & Upsells',
    href: '/crm/addons',
    icon: Zap,
  },
  {
    name: 'Analytics',
    href: '/crm/analytics',
    icon: BarChart3,
  },
];

const bottomNavigation = [
  {
    name: 'Settings',
    href: '/crm/settings',
    icon: Settings,
  },
];

export default function CRMSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // FIX: Use the hook. This prevents the "undefined reading $$typeof" error.
  // We initialize with defaults to prevent crashes if context is momentarily unavailable
  const { user, logout } = useAuth();
  
  const [expandedItems, setExpandedItems] = useState({});

  const isActive = (href) => {
    if (href === '/crm') {
      return pathname === '/crm';
    }
    return pathname?.startsWith(href);
  };

  const toggleExpand = (itemName) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const handleLogout = async () => {
    try {
      // Redirect CRM users back to CRM signin page
      await logout('/auth/crm/signin');
    } catch (error) {
      console.error('Logout failed', error);
      // Fallback redirect to CRM signin
      window.location.href = '/auth/crm/signin';
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo & Header */}
          <div className="flex h-16 items-center justify-between border-b border-border px-6">
            <Link href="/crm" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#e48b53] to-[#d47b43]">
                <span className="text-lg font-bold text-white">H</span>
              </div>
              <span className="text-lg font-bold text-foreground">Houspire</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 custom-scrollbar">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedItems[item.name] || (active && hasChildren);

              return (
                <div key={item.name}>
                  {hasChildren ? (
                    <>
                      <button
                        onClick={() => toggleExpand(item.name)}
                        className={cn(
                          'w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                          active || isExpanded
                            ? 'text-foreground bg-accent/50'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </div>
                        <div className="flex items-center">
                          {item.badge && (
                            <Badge variant="secondary" className="mr-2 text-xs h-5">
                              {item.badge}
                            </Badge>
                          )}
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          ) : (
                            <ChevronRight className="h-4 w-4 opacity-50" />
                          )}
                        </div>
                      </button>
                      
                      {/* Submenu */}
                      <div 
                        className={cn(
                          "overflow-hidden transition-all duration-300 ease-in-out",
                          isExpanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                        )}
                      >
                        <div className="ml-4 border-l border-border pl-2 space-y-1">
                          {item.children.map((child) => {
                            const ChildIcon = child.icon;
                            const childActive = pathname === child.href;
                            return (
                              <Link
                                key={child.name}
                                href={child.href}
                                className={cn(
                                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                  childActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                              >
                                <ChildIcon className="h-4 w-4" />
                                <span>{child.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        active
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <Badge 
                          variant={active ? "secondary" : "secondary"} 
                          className={cn("ml-auto", active && "bg-primary-foreground/20 text-primary-foreground")}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User Section - Connected to AuthContext */}
          <div className="border-t border-border p-4 bg-card">
            {bottomNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors mb-2',
                    active
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            <div className="flex items-center gap-3 pt-2 mt-2 border-t border-border/50">
              <Avatar className="h-9 w-9 border border-border">
                {/* Use optional chaining in case user is null/loading */}
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.name?.charAt(0)?.toUpperCase() || 'H'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name || 'Houspire Admin'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {/* Default to CRM admin email as requested if not loaded */}
                  {user?.email || 'crm@houspire.com'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
