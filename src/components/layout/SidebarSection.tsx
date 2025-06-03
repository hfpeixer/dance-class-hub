
import React from "react";

interface SidebarSectionProps {
  title: string;
  isCollapsed: boolean;
  children: React.ReactNode;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({ 
  title, 
  isCollapsed, 
  children 
}) => (
  <div className="mb-6">
    {!isCollapsed && (
      <h3 className="mb-2 px-3 text-xs uppercase text-muted-foreground">
        {title}
      </h3>
    )}
    <div className="space-y-1">{children}</div>
  </div>
);
