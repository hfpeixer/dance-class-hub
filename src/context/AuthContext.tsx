
import React, { createContext, useState, useEffect } from "react";
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Role types matching database enum
export type UserRole = "admin" | "secretary" | "financial" | "teacher";

// User profile type
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  userRole: UserRole | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

// Create the context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  userRole: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  hasRole: () => false,
  hasPermission: () => false,
});

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch user profile and role
  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      if (profileData) {
        setProfile({
          id: profileData.id,
          name: profileData.name,
          email: profileData.email,
          avatar: profileData.avatar
        });
      }

      // Fetch user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError) {
        console.error("Error fetching user role:", roleError);
        setUserRole(null);
      } else if (roleData) {
        setUserRole(roleData.role as UserRole);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Erro ao carregar dados do usuário");
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer user data fetching to prevent deadlocks
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setUserRole(null);
        }
        
        setIsLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success("Login realizado com sucesso!");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Erro ao fazer login");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success("Conta criada com sucesso! Verifique seu email para confirmar.");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Erro ao criar conta");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local state
      setUser(null);
      setProfile(null);
      setUserRole(null);
      setSession(null);
      
      toast.success("Logout realizado com sucesso!");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  // Helper function to check user role
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!userRole) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(userRole);
    }
    
    return userRole === roles;
  };
  
  // Check if the user has permission to access a feature
  const hasPermission = (permission: string): boolean => {
    if (!userRole) return false;
    
    switch (permission) {
      case "dashboard.view":
        return hasRole(["admin", "secretary", "financial", "teacher"]);
      case "students.manage":
        return hasRole(["admin", "secretary"]);
      case "finance.manage":
        return hasRole(["admin", "financial"]);
      case "teachers.manage":
        return hasRole(["admin"]);
      case "classes.manage":
        return hasRole(["admin", "secretary"]);
      case "reports.view":
        return hasRole(["admin", "financial"]);
      case "admin.access":
        return hasRole(["admin"]);
      default:
        return false;
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    profile,
    userRole,
    session,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    hasRole,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
