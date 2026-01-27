// src\utils\cookies.js
import Cookies from 'js-cookie';

export const cookieKeys = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  ADMIN_DATA: 'admin_data',
  USER_ROLE: 'user_role'
};

export const cookieConfig = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/'
};

export const setAuthCookie = (token, userData, isAdmin = false) => {
  Cookies.set(cookieKeys.AUTH_TOKEN, token, cookieConfig);
  
  if (isAdmin) {
    Cookies.set(cookieKeys.ADMIN_DATA, JSON.stringify(userData), cookieConfig);
    if (userData?.role === 'CRM_ADMIN') {
      Cookies.set(cookieKeys.USER_ROLE, 'crm_admin', cookieConfig);
    } else {
      Cookies.set(cookieKeys.USER_ROLE, 'admin', cookieConfig);
    }
  } else {
    Cookies.set(cookieKeys.USER_DATA, JSON.stringify(userData), cookieConfig);
    Cookies.set(cookieKeys.USER_ROLE, 'user', cookieConfig);
  }
};

export const getAuthToken = () => {
  return Cookies.get(cookieKeys.AUTH_TOKEN);
};

export const getUserData = () => {
  const userData = Cookies.get(cookieKeys.USER_DATA);
  const adminData = Cookies.get(cookieKeys.ADMIN_DATA);
  
  if (userData) return JSON.parse(userData);
  if (adminData) return JSON.parse(adminData);
  return null;
};

export const getUserRole = () => {
  return Cookies.get(cookieKeys.USER_ROLE);
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const isAdmin = () => {
  return getUserRole() === 'admin';
};

export const clearAuthCookies = () => {
  Object.values(cookieKeys).forEach(key => {
    Cookies.remove(key);
  });
};