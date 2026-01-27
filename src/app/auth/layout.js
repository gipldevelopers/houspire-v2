// src/app/auth/layout.js
import AuthLayoutClient from './AuthLayoutClient';

export const metadata = {
  title: 'Authentication - Houspire',
  description: 'Sign in or create your Houspire account',
};

export default function AuthLayout({ children }) {
  return <AuthLayoutClient>{children}</AuthLayoutClient>;
}