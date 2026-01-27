// src\components\admin\AdminSidebar.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderOpen,
  Users,
  UserCheck,
  Receipt,
  Image,
  Palette,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  Shield,
  Activity,
  Package,
  HeadphonesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import authService from "@/services/auth.service";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    name: "Projects",
    href: "/admin/projects",
    icon: FolderOpen,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Renders",
    href: "/admin/renders",
    icon: Image,
  },
  {
    name: "BOQ Management",
    href: "/admin/boq-management",
    icon: Receipt,
  },
  {
    name: "Vendors",
    href: "/admin/vendors",
    icon: UserCheck,
  },
  {
    name: "Styles",
    href: "/admin/styles",
    icon: Palette,
  },
  {
    name: "Packages & Addons",
    href: "/admin/packages",
    icon: Package,
  },
  {
    name: "Support Tickets",
    href: "/admin/support-tickets",
    icon: HeadphonesIcon,
  },
  {
    name: "Email Templates",
    href: "/admin/email-templates",
    icon: FileText,
  },
  {
    name: "Audit Logs",
    href: "/admin/audit-logs",
    icon: Activity,
  },
];

const bottomNavigation = [
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];
export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [user, setUser] = useState({});
  const isActive = (href) => {
    if (href === "/admin/dashboard") {
      return pathname === "/admin/dashboard" || pathname === "/admin";
    }
    return pathname?.startsWith(href);
  };
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUser = await authService.getCurrentUser();

      setUser(currentUser.data.admin);
    };
    fetchCurrentUser();
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-900 px-6 pb-4 border-r border-slate-700">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center">
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-2"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">Houspire</span>
                <span className="text-xs text-slate-400">Admin Console</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            active
                              ? "bg-slate-800 text-white shadow-sm"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-all duration-200"
                          )}
                        >
                          <item.icon
                            className={cn(
                              active
                                ? "text-white"
                                : "text-slate-400 group-hover:text-white",
                              "h-5 w-5 shrink-0 transition-colors"
                            )}
                            aria-hidden="true"
                          />
                          <span className="flex-1">{item.name}</span>
                          {item.badge && (
                            <Badge className="ml-auto bg-red-500 text-white text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>

              {/* Bottom Navigation */}
              <li className="mt-auto">
                <ul className="-mx-2 space-y-1">
                  {bottomNavigation.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            active
                              ? "bg-slate-800 text-white"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-all duration-200"
                          )}
                        >
                          <item.icon
                            className="h-5 w-5 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {/* Admin Profile */}
                <div className="mt-6 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                      <AvatarFallback className="bg-red-500 text-white text-sm">
                        {user.name
                          ?.split(" ") // split into words
                          .map((w) => w[0]) // get first letter of each word
                          .join("") // join them together
                          .slice(0, 2) // take first two letters only
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-3 text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </Button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto bg-slate-900 px-6 pb-4 border-r border-slate-700">
          {/* Mobile Header */}
          <div className="flex h-16 shrink-0 items-center justify-between">
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-2"
              onClick={onClose}
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">Houspire</span>
                <span className="text-xs text-slate-400">Admin Console</span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            active
                              ? "bg-slate-800 text-white shadow-sm"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-all duration-200"
                          )}
                        >
                          <item.icon
                            className="h-5 w-5 shrink-0"
                            aria-hidden="true"
                          />
                          <span className="flex-1">{item.name}</span>
                          {item.badge && (
                            <Badge className="ml-auto bg-red-500 text-white text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>

              {/* Mobile Bottom Navigation */}
              <li className="mt-auto">
                <ul className="-mx-2 space-y-1">
                  {bottomNavigation.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            active
                              ? "bg-slate-800 text-white"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-all duration-200"
                          )}
                        >
                          <item.icon
                            className="h-5 w-5 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {/* Mobile Admin Profile */}
                <div className="mt-6 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-red-500 text-white text-sm">
                        {user.name
                          ?.split(" ") // split into words
                          .map((w) => w[0]) // get first letter of each word
                          .join("") // join them together
                          .slice(0, 2) // take first two letters only
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-3 text-slate-300 hover:bg-slate-700 hover:text-white"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </Button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
