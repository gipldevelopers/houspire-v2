// src/context/AuthContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import authService from "@/services/auth.service";
import { setAuthCookie } from "@/utils/cookies";
import { toast } from "sonner";
import api from "@/lib/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);
  

  // FIXED: Check if user is authenticated properly
  const checkAuth = async () => {
    try {
      const token = authService.getToken();
      const storedUser = authService.getStoredUser();

      if (token && storedUser) {
        // Verify token is still valid with backend
        try {
          const currentUser = await authService.getCurrentUser();

          if (currentUser.success && currentUser.data.user?.isActive) {
            setUser(currentUser.data.user);
            setIsAuthenticated(true);
          } else {
            setUser(storedUser);
            setIsAuthenticated(true);

            if (currentUser.data?.user?.isActive === false) {
              toast.error("Please verify your email to access all features");
            }
          }
        } catch (error) {
          console.error("❌ Token verification failed:", error);
          // If token verification fails, use stored user data
          // This prevents logout on network issues
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      } else if (token && !storedUser) {
        // Has token but no stored user - try to get user data
        try {
          const currentUser = await authService.getCurrentUser();
          if (currentUser.success) {
            setUser(currentUser.data.user);
            setIsAuthenticated(true);
          } else {
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Failed to get user data:", error);
          authService.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // No token or stored user
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Don't logout on errors - use stored data if available
      const storedUser = authService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Don't set auth state until OTP verified
  const signup = async (userData) => {
    try {
      setLoading(true);
      const result = await authService.signUp(userData);

      if (result.success) {
        // DON'T set user or isAuthenticated here - wait for OTP verification
        return result;
      } else {
        return result;
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || "Signup failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // Check if user is active
  const login = async (credentials, isAdmin = false) => {
    try {
      const result = isAdmin
        ? await authService.adminSignIn(credentials)
        : await authService.signIn(credentials);

      if (result.success) {
        // Update context state only if login successful
        const userData = isAdmin ? result.data.admin : result.data.user;
        setUser(userData);
        setIsAuthenticated(true);

        return { success: true, message: "Login successful" };
      } else {
        // Return the actual backend error message
        return {
          success: false,
          message: result.message,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Login failed. Please try again.",
      };
    }
  };

  // FIXED: Update verifyOtp to properly set auth state
  const verifyOtp = async (email, otp) => {
    try {
      const response = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      const result = response.data;

       if (result.success) {
      // Mark user as new for first-time tour
      const userWithNewFlag = {
        ...result.data.user,
        isNewUser: true // Add this flag
      };

      setUser(userWithNewFlag);
      setIsAuthenticated(true);

      // Store token and user data in cookies
      if (result.data.token) {
        setAuthCookie(result.data.token, userWithNewFlag, false);
      }

      return { success: true, message: "OTP verified successfully" };
    }
       else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "OTP verification failed. Please try again.",
      };
    }
  };

  // FIXED: Update googleAuth to properly set auth state
  const googleAuth = async (token) => {
    try {
      const response = await api.post("/auth/google", { token });
      const result = response.data;

      if (result.success) {
      // Mark user as new for first-time tour
      const userWithNewFlag = {
        ...result.data.user,
        isNewUser: result.data.isNewUser // Use the isNewUser from backend if available
      };

      setUser(userWithNewFlag);
      setIsAuthenticated(true);

      // Store token in cookies
      if (result.data.token) {
        setAuthCookie(result.data.token, userWithNewFlag, false);
      }

      return {
        success: true,
        message: "Google sign in successful",
        isNewUser: result.data.isNewUser,
      };
    }
       else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Google auth error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Google authentication failed",
      };
    }
  };

  const logout = async (redirectPath = "/auth/signin") => {
    try {
      // Call server-side logout API
      await userService.logout();
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with client-side logout even if API fails
    } finally {
      // Clear local storage and cookies
      authService.logout(redirectPath);

      // Clear context state
      setUser(null);
      setIsAuthenticated(false);

      toast.success("Logged out successfully");
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin: authService.isAdmin(),
    login,
    signup,
    verifyOtp,
    googleAuth,
    logout,
    checkAuth,
    refreshToken: authService.refreshToken,
    forgotPassword: authService.forgotPassword,
    resetPassword: authService.resetPassword,
    changePassword: authService.changePassword,
    sendMagicLink: authService.sendMagicLink,
    verifyMagicLink: authService.verifyMagicLink,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
