
import React from "react";
import { NavLink } from "react-router-dom";
import { Music2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <div className="flex h-16 items-center justify-between px-4 border-b border-border">
      {!isCollapsed && (
        <NavLink to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-dance-primary flex items-center justify-center">
            <Music2 className="h-5 w-5 text-white animate-dance" />
          </div>
          <span className="text-lg font-bold">
            Corpore<span className="text-dance-primary">Dance</span>
          </span>
        </NavLink>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleCollapse}
        className="text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  );
};
