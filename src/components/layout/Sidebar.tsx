
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarContent } from "./SidebarContent";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const isMobile = window.innerWidth < 768;
  const [isOpen, setIsOpen] = useState(false);

  const toggleMobileSidebar = () => setIsOpen(!isOpen);
  const closeMobileSidebar = () => setIsOpen(false);
  
  if (!user) return null;

  const sidebarContent = (
    <>
      <SidebarHeader
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      <SidebarContent
        isCollapsed={isCollapsed}
        pathname={location.pathname}
      />
      <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground mt-auto">
        <p>© 2025 Corpore - v1.0.0</p>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <button
          className="fixed left-4 top-4 z-50"
          onClick={toggleMobileSidebar}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm animate-in fade-in">
            <div
              className="fixed inset-0 bg-black/20"
              onClick={closeMobileSidebar}
            />
            <div className="fixed inset-y-0 left-0 z-50 animate-in slide-in-from-left duration-300">
              <div className={cn(
                "flex h-full flex-col bg-card",
                isCollapsed ? "w-16" : "w-64"
              )}>
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h2 className="text-lg font-semibold">Corpore</h2>
                  <button onClick={closeMobileSidebar} aria-label="Close menu">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
                <div className="overflow-y-auto flex-1">
                  {sidebarContent}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <aside
      className={cn(
        "h-full bg-card border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {sidebarContent}
    </aside>
  );
}
