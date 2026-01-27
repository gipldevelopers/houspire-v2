// src/components/dashboard/Header.js
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, Sun, Moon, LogOut, User, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import NotificationBell from '@/components/dashboard/NotificationBell';
import { userService } from '@/services/user.service';

const getPageTitle = (pathname) => {
  const segment = pathname.split('/').pop();
  const titles = {
    'dashboard': 'Dashboard',
    'projects': 'Projects',
    'uploads': 'Uploads',
    'questionnaire': 'Questionnaire',
    'styles': 'Styles',
    'boq': 'Budget & BOQ',
    'vendors': 'Vendors',
    'renders': 'Renders',
    'profile': 'Profile',
    'settings': 'Settings',
    'new': 'New Project',
    'addons': 'Premium Services',
    'payments': 'Payments',
    'support': 'Support',
    'data': 'Data & Privacy',
  };
  return titles[segment] || 'Dashboard';
};

export default function Header({ onMenuClick }) {
  const pathname = usePathname();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pageTitle = getPageTitle(pathname || '/dashboard');
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && !userProfile) {
        try {
          const response = await userService.getUserProfile();
          if (response.success) {
            setUserProfile(response.data.user);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
    };
    fetchUserProfile();
  }, [user, userProfile]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setIsOpen(false);
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserDisplayName = () => userProfile?.name || user?.name || 'User';
  const getUserEmail = () => userProfile?.email || user?.email || '';
  const getUserAvatar = () => userProfile?.avatar || user?.avatar || null;

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      {/* Left: Menu + Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-base font-medium text-foreground">
          {pageTitle}
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={toggleTheme}
        >
          <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Notifications */}
        <NotificationBell />

        {/* User menu */}
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={getUserAvatar()} alt={getUserDisplayName()} />
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs font-medium">
                  {getUserInitials(getUserDisplayName())}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            align="end" 
            className="w-64 p-0 rounded-xl shadow-lg border-border/50 bg-popover"
          >
            {/* User Info */}
            <Link 
              href="/dashboard/profile" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={getUserAvatar()} alt={getUserDisplayName()} />
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-medium">
                  {getUserInitials(getUserDisplayName())}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {getUserEmail()}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <div className="h-px bg-border/50" />

            {/* Menu Items */}
            <div className="p-1.5">
              <Link
                href="/dashboard/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted/50 transition-colors"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                Profile
              </Link>
              
              <Link
                href="/dashboard/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted/50 transition-colors"
              >
                <Sun className="h-4 w-4 text-muted-foreground" />
                Settings
              </Link>
            </div>

            <div className="h-px bg-border/50" />

            {/* Sign out */}
            <div className="p-1.5">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                    Signing out...
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </>
                )}
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
