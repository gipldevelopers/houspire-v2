// src/app/auth/admin/signin/page.js
import AdminLoginClient from './AdminLoginClient';

export const metadata = {
  title: 'Admin Login - Houspire',
  description: 'Admin portal access',
};

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}