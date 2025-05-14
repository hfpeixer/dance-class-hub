
import { useContext } from "react";
import { AuthContext, User, UserRole } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  // Helper function to check user role
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!context.user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(context.user.role);
    }
    
    return context.user.role === roles;
  };
  
  // Check if the user has permission to access a feature
  const hasPermission = (permission: string): boolean => {
    if (!context.user) return false;
    
    // In a real app, this would check against a more sophisticated permissions system
    // For now, we'll use a simple role-based check
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
  
  return {
    ...context,
    hasRole,
    hasPermission,
  };
};
