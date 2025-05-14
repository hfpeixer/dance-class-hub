
import React, { createContext, useState, useEffect } from "react";

// Role types
export type UserRole = "admin" | "secretary" | "financial" | "teacher";

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

// Mock user data - in a real app this would come from a backend
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@danceschool.com",
    password: "admin123",
    role: "admin" as UserRole,
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=admin",
  },
  {
    id: "2",
    name: "Secretary User",
    email: "secretary@danceschool.com",
    password: "secretary123",
    role: "secretary" as UserRole,
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=secretary",
  },
  {
    id: "3",
    name: "Financial User",
    email: "financial@danceschool.com",
    password: "financial123",
    role: "financial" as UserRole,
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=financial",
  },
  {
    id: "4",
    name: "Teacher User",
    email: "teacher@danceschool.com",
    password: "teacher123",
    role: "teacher" as UserRole,
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=teacher",
  },
];

// Create the context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  checkAuth: () => false,
});

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for user in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("danceSchoolUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Log user action
  const logUserAction = (action: string) => {
    if (!user) return;
    
    const log = {
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      timestamp: new Date().toISOString(),
    };
    
    // In a real app, this would be sent to a backend API
    console.log("User action logged:", log);
    
    // For demo purposes, store logs in localStorage
    const logs = JSON.parse(localStorage.getItem("userActionLogs") || "[]");
    logs.push(log);
    localStorage.setItem("userActionLogs", JSON.stringify(logs));
  };

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    // Simulate loading state
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error("Invalid email or password");
    }
    
    // Remove password before storing user data
    const { password: _, ...userData } = foundUser;
    
    // Set user in state and localStorage
    setUser(userData);
    localStorage.setItem("danceSchoolUser", JSON.stringify(userData));
    
    // Log login action
    logUserAction("User logged in");
    
    setIsLoading(false);
  };

  // Logout function
  const logout = () => {
    // Log logout action before clearing user
    if (user) {
      logUserAction("User logged out");
    }
    
    // Clear user data
    setUser(null);
    localStorage.removeItem("danceSchoolUser");
  };

  // Check if user is authenticated
  const checkAuth = (): boolean => {
    return !!user;
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
