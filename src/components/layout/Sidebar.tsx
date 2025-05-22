
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Users,
  School,
  Music2,
  UserCheck,
  BookOpen,
  DollarSign,
  ShoppingBag,
  Calendar,
  Settings,
  Menu,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
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

interface SidebarSectionProps {
  title: string;
  isCollapsed: boolean;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, isCollapsed, children }) => (
  <div className="mb-6">
    {!isCollapsed && (
      <h3 className="mb-2 px-3 text-xs uppercase text-muted-foreground">
        {title}
      </h3>
    )}
    <div className="space-y-1">{children}</div>
  </div>
);

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const isMobile = window.innerWidth < 768;
  const [isOpen, setIsOpen] = useState(false);

  const toggleMobileSidebar = () => setIsOpen(!isOpen);
  const closeMobileSidebar = () => setIsOpen(false);
  
  if (!user) return null; // Don't render if not logged in

  const sidebarContent = (
    <>
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
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-3 py-4 space-y-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
        <SidebarSection title="Analytics" isCollapsed={isCollapsed}>
          <SidebarItem
            icon={BarChart3}
            label="Dashboard"
            href="/"
            isActive={location.pathname === "/"}
            isCollapsed={isCollapsed}
          />
        </SidebarSection>

        {hasPermission("students.manage") && (
          <SidebarSection title="Cadastros" isCollapsed={isCollapsed}>
            <SidebarItem
              icon={Users}
              label="Alunos"
              href="/alunos"
              isActive={location.pathname.startsWith("/alunos")}
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              icon={School}
              label="Escolas"
              href="/escolas"
              isActive={location.pathname.startsWith("/escolas")}
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              icon={Music2}
              label="Modalidades"
              href="/modalidades"
              isActive={location.pathname.startsWith("/modalidades")}
              isCollapsed={isCollapsed}
            />
            {hasPermission("teachers.manage") && (
              <SidebarItem
                icon={UserCheck}
                label="Professores"
                href="/professores"
                isActive={location.pathname.startsWith("/professores")}
                isCollapsed={isCollapsed}
              />
            )}
            <SidebarItem
              icon={BookOpen}
              label="Turmas"
              href="/turmas"
              isActive={location.pathname.startsWith("/turmas")}
              isCollapsed={isCollapsed}
            />
          </SidebarSection>
        )}

        {hasPermission("finance.manage") && (
          <SidebarSection title="Financeiro" isCollapsed={isCollapsed}>
            <SidebarItem
              icon={DollarSign}
              label="Mensalidades"
              href="/financeiro"
              isActive={location.pathname === "/financeiro"}
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              icon={ShoppingBag}
              label="Produtos"
              href="/produtos"
              isActive={location.pathname.startsWith("/produtos")}
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              icon={Calendar}
              label="Eventos"
              href="/eventos"
              isActive={location.pathname.startsWith("/eventos")}
              isCollapsed={isCollapsed}
            />
          </SidebarSection>
        )}

        {hasPermission("dashboard.view") && (
          <SidebarSection title="Sistema" isCollapsed={isCollapsed}>
            <SidebarItem
              icon={Settings}
              label="Configurações"
              href="/configuracoes"
              isActive={location.pathname.startsWith("/configuracoes")}
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              icon={LogOut}
              label="Sair"
              href="#"
              isActive={false}
              isCollapsed={isCollapsed}
              onClick={() => logout()}
            />
          </SidebarSection>
        )}
      </div>

      <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground mt-auto">
        <p>© 2024 Corpore - v1.0.0</p>
      </div>
    </>
  );

  // Mobile sidebar
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

  // Desktop sidebar
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
