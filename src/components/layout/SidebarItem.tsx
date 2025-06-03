
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  href,
  isActive,
  isCollapsed,
  onClick,
}) => (
  <NavLink
    to={href}
    onClick={onClick}
    className={cn(
      "flex items-center space-x-3 p-3 rounded-md transition-all duration-200",
      isActive
        ? "bg-dance-primary text-white"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    )}
  >
    <Icon className="h-5 w-5 flex-shrink-0" />
    {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
  </NavLink>
);
