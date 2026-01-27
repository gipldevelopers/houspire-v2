// middleware.js (ROOT DIRECTORY)
import { NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/admin', '/crm'];
const authRoutes = ['/auth/signin', '/auth/signup', '/auth/admin/signin', '/auth/crm/signin'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if route is auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // If it's a protected route and no token, redirect to appropriate signin
  if (isProtectedRoute && !token) {
    // CRM has its own signin
    if (pathname.startsWith('/crm')) {
      const crmSignInUrl = new URL('/auth/crm/signin', request.url);
      return NextResponse.redirect(crmSignInUrl);
    }
    
    // Default redirect to signin
    const signInUrl = new URL('/auth/signin', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // If it's an auth route and token exists, regulate access based on usage
  if (isAuthRoute && token) {
    // 1. CRM Login Page: Only redirect if already a CRM/Admin.
    // Allow 'user' to stay on this page to login as CRM.
    if (pathname.startsWith('/auth/crm')) {
      if (userRole === 'crm_admin' || userRole === 'admin') {
         // Already logged in as admin, go to CRM
         return NextResponse.redirect(new URL('/crm', request.url));
      }
      // If 'user', allow access to form (NextResponse.next())
      return NextResponse.next();
    }
    
    // 2. Admin Login Page: Only redirect if already Admin.
    if (pathname.startsWith('/auth/admin')) {
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.next();
    }
    
    // 3. User Login Pages: Redirect everyone if logged in.
    if (pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup')) {
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } else if (userRole === 'crm_admin') {
        return NextResponse.redirect(new URL('/crm', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  // Admin route protection
  if (pathname.startsWith('/admin') && token) {
    if (userRole !== 'admin') {
      // Redirect to dashboard if unauthorized
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // User route protection (prevent admin from accessing user dashboard)
  if (pathname.startsWith('/dashboard') && token) {
    if (userRole === 'admin') {
      const adminDashboardUrl = new URL('/admin/dashboard', request.url);
      return NextResponse.redirect(adminDashboardUrl);
    }
    if (userRole === 'crm_admin') {
      const crmUrl = new URL('/crm', request.url);
      return NextResponse.redirect(crmUrl);
    }
  }

  // CRM route protection
  if (pathname.startsWith('/crm') && token) {
    if (userRole !== 'crm_admin' && userRole !== 'admin') {
      // Allow user to go to CRM login to switch/login
      const crmSignInUrl = new URL('/auth/crm/signin', request.url);
      return NextResponse.redirect(crmSignInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/auth/:path*',
    '/crm/:path*',
  ],
};