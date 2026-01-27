// src/app/auth/crm/signin/page.js
import CRMLoginClient from './CRMLoginClient';

export const metadata = {
  title: 'CRM Login - Houspire',
  description: 'CRM portal access for administrative staff',
};

export default function CRMLoginPage() {
  return <CRMLoginClient />;
}
