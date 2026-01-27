// src/components/dashboard/Sidebar.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  FolderOpen, 
  FileText, 
  Users, 
  Image,
  Settings,
  LogOut,
  X,
  Headset,
  Crown,
  CreditCard,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/user.service';
import CombinedTour from '../tour/CombinedTour';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { name: 'Renders', href: '/dashboard/renders', icon: Image, tourClass: 'sidebar-renders' },
  { name: 'Budget', href: '/dashboard/boq', icon: FileText, tourClass: 'sidebar-budget' },
  { name: 'Vendors', href: '/dashboard/vendors', icon: Users, tourClass: 'sidebar-vendors' },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { name: 'Premium', href: '/dashboard/addons', icon: Crown },
  { name: 'Support', href: '/dashboard/support', icon: Headset, tourClass: 'sidebar-support' },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const isActive = (href) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname?.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      onClose();
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

  const NavItem = ({ item, onClick }) => {
    const active = isActive(item.href);
    const isHighlighted = item.highlight && !active;
    
    return (
      <Link
        href={item.href}
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
          active
            ? 'bg-white/10 text-white'
            : isHighlighted
            ? 'text-amber-400 hover:bg-amber-500/10'
            : 'text-slate-400 hover:bg-white/5 hover:text-white',
          item.tourClass
        )}
      >
        <item.icon className={cn(
          'h-[18px] w-[18px] flex-shrink-0',
          active ? 'text-white' : isHighlighted ? 'text-amber-400' : 'text-slate-500'
        )} />
        <span>{item.name}</span>
      </Link>
    );
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex h-full flex-col bg-slate-900">
      {/* Header */}
      <div className={cn(
        "flex items-center h-14 px-4 border-b border-slate-800",
        isMobile ? "justify-between" : "justify-center"
      )}>
        <Link 
          href="/dashboard" 
          onClick={isMobile ? onClose : undefined}
          className="flex items-center gap-2"
        >
          <img src="/logo_final.svg" alt="Houspire" className="h-7" />
        </Link>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navigation.map((item) => (
          <NavItem 
            key={item.name} 
            item={item} 
            onClick={isMobile ? onClose : undefined} 
          />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-slate-800">
        {/* Settings */}
        <Link
          href="/dashboard/settings"
          onClick={isMobile ? onClose : undefined}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-3',
            isActive('/dashboard/settings')
              ? 'bg-white/10 text-white'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          )}
        >
          <Settings className="h-[18px] w-[18px] text-slate-500" />
          <span>Settings</span>
        </Link>

        {/* User Profile */}
        <div className="p-2 rounded-lg bg-slate-800/50">
          <Link 
            href="/dashboard/profile"
            onClick={isMobile ? onClose : undefined}
            className="flex items-center gap-3 p-1.5 rounded-md hover:bg-white/5 transition-colors"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={getUserAvatar()} alt={getUserDisplayName()} />
              <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs font-medium">
                {getUserInitials(getUserDisplayName())}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {getUserEmail()}
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 mt-2 px-3 py-2 rounded-md text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
          >
            {isLoggingOut ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                <span>Signing out...</span>
              </>
            ) : (
              <>
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign out</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <CombinedTour />

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64 lg:block sidebar-tour-trigger">
        <SidebarContent />
      </div>

      {/* Mobile Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-out lg:hidden sidebar-tour-trigger",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent isMobile />
      </div>
    </>
  );
}
