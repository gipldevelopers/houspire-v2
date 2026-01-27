// src/app/auth/signin/page.js
import LoginForm, { SigninForm } from "@/components/auth/SigninForm";

export default function LoginPage() {
  return <SigninForm />;
}

export const metadata = {
  title: 'Sign In - Houspire',
  description: 'Sign in to your Houspire account',
};