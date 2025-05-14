
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  LogOut,
  FileText,
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
  <Link
    to={href}
    onClick={onClick}
    className={cn(
      "flex items-center space-x-3 p-3 rounded-md transition-all duration-200",
      isActive
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
    )}
  >
    <Icon className="h-5 w-5 flex-shrink-0" />
    {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
  </Link>
);

interface SidebarSectionProps {
  title: string;
  isCollapsed: boolean;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, isCollapsed, children }) => (
  <div className="mb-6">
    {!isCollapsed && (
      <h3 className="mb-2 px-3 text-xs uppercase text-sidebar-foreground/50">
        {title}
      </h3>
    )}
    <div className="space-y-1">{children}</div>
  </div>
);

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  
  if (!user) return null; // Don't render if not logged in
  
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!isCollapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-dance-primary flex items-center justify-center">
              <Music2 className="h-5 w-5 text-white animate-dance" />
            </div>
            <span className="text-lg font-bold text-sidebar-foreground">
              Dance<span className="text-dance-primary">School</span>
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-3 py-2 space-y-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
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
              label="Financeiro"
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
            {hasPermission("admin.access") && (
              <SidebarItem
                icon={FileText}
                label="Administração"
                href="/admin"
                isActive={location.pathname.startsWith("/admin")}
                isCollapsed={isCollapsed}
              />
            )}
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
    </aside>
  );
};
