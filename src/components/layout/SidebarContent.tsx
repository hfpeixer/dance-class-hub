
import React from "react";
import { NavLink } from "react-router-dom";
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
  CalendarDays,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { SidebarSection } from "./SidebarSection";
import { SidebarItem } from "./SidebarItem";

interface SidebarContentProps {
  isCollapsed: boolean;
  pathname: string;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  isCollapsed,
  pathname,
}) => {
  const { hasPermission, logout } = useAuth();

  return (
    <div className="px-3 py-4 space-y-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <SidebarSection title="Analytics" isCollapsed={isCollapsed}>
        <SidebarItem
          icon={BarChart3}
          label="Dashboard"
          href="/"
          isActive={pathname === "/"}
          isCollapsed={isCollapsed}
        />
      </SidebarSection>

      {hasPermission("students.manage") && (
        <SidebarSection title="Cadastros" isCollapsed={isCollapsed}>
          <SidebarItem
            icon={Users}
            label="Alunos"
            href="/alunos"
            isActive={pathname.startsWith("/alunos")}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={School}
            label="Escolas"
            href="/escolas"
            isActive={pathname.startsWith("/escolas")}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={Music2}
            label="Modalidades"
            href="/modalidades"
            isActive={pathname.startsWith("/modalidades")}
            isCollapsed={isCollapsed}
          />
          {hasPermission("teachers.manage") && (
            <SidebarItem
              icon={UserCheck}
              label="Professores"
              href="/professores"
              isActive={pathname.startsWith("/professores")}
              isCollapsed={isCollapsed}
            />
          )}
          <SidebarItem
            icon={BookOpen}
            label="Turmas"
            href="/turmas"
            isActive={pathname.startsWith("/turmas")}
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
            isActive={pathname === "/financeiro"}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={CalendarDays}
            label="Controle de Mensalidades"
            href="/mensalidades"
            isActive={pathname.startsWith("/mensalidades")}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={ShoppingBag}
            label="Produtos"
            href="/produtos"
            isActive={pathname.startsWith("/produtos")}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={Calendar}
            label="Eventos"
            href="/eventos"
            isActive={pathname.startsWith("/eventos")}
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
            isActive={pathname.startsWith("/configuracoes")}
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
  );
};
