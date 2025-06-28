import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useToast } from "@/hooks/use-toast";

// API base URL
const API_BASE_URL = "http://localhost:5000/api";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isEmailVerified: boolean;
  profile?: {
    avatar?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  };
  preferences?: {
    newsletter: boolean;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    favoriteCategories: string[];
    language: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<boolean>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
      fetchUserProfile(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem("authToken");
        setToken(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem("authToken");
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("authToken", data.token);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user.name}!`,
        });
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast({
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("authToken", data.token);
        toast({
          title: "Registration Successful",
          description: `Welcome to Clip Kart Emporium, ${data.user.name}!`,
        });
        return true;
      } else {
        toast({
          title: "Registration Failed",
          description: data.message || "Registration failed",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast({
        title: "Registration Error",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const updateProfile = async (
    profileData: Partial<User>
  ): Promise<boolean> => {
    try {
      if (!token) return false;

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
        return true;
      } else {
        toast({
          title: "Update Failed",
          description: data.message || "Failed to update profile",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Error",
        description: "An error occurred while updating your profile.",
        variant: "destructive",
      });
      return false;
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    try {
      if (!token) return false;

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Password Changed",
          description: "Your password has been changed successfully.",
        });
        return true;
      } else {
        toast({
          title: "Password Change Failed",
          description: data.message || "Failed to change password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "Password Change Error",
        description: "An error occurred while changing your password.",
        variant: "destructive",
      });
      return false;
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Reset Link Sent",
          description: "Password reset link has been sent to your email.",
        });
        return true;
      } else {
        toast({
          title: "Reset Failed",
          description: data.message || "Failed to send reset link",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error processing forgot password:", error);
      toast({
        title: "Reset Error",
        description: "An error occurred while processing your request.",
        variant: "destructive",
      });
      return false;
    }
  };

  const resetPassword = async (
    resetToken: string,
    newPassword: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Password Reset",
          description: "Your password has been reset successfully.",
        });
        return true;
      } else {
        toast({
          title: "Reset Failed",
          description: data.message || "Failed to reset password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        title: "Reset Error",
        description: "An error occurred while resetting your password.",
        variant: "destructive",
      });
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
