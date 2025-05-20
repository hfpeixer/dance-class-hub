
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Users,
  School,
  CalendarRange,
  DollarSign,
  Package,
  Settings,
  MenuIcon,
  X,
  Home,
  UserCheck,
  BookUser,
  Package2,
  List,
  ScanBarcode,
  ClipboardList,
  FileText,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  className?: string;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  end?: boolean;
}

const SidebarLink = ({ to, icon: Icon, children, end }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = end
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-dance-primary text-white"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )
      }
      end={end}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </NavLink>
  );
};

export function Sidebar({ className }: SidebarProps) {
  const { isMobile } = useMobile();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  const sidebarContent = (
    <div
      className={cn(
        "flex flex-col gap-6 w-[240px] h-full bg-card border-r border-border",
        className
      )}
    >
      <div className="flex h-14 items-center border-b border-border px-4">
        <h2 className="text-lg font-semibold">Corpore</h2>
      </div>
      <div className="flex-1 px-4">
        <nav className="flex flex-col gap-1">
          <SidebarLink to="/" icon={Home} end>
            Dashboard
          </SidebarLink>
          <SidebarLink to="/alunos" icon={Users}>
            Alunos
          </SidebarLink>
          <SidebarLink to="/professores" icon={UserCheck}>
            Professores
          </SidebarLink>
          <SidebarLink to="/matriculas" icon={List}>
            Matrículas
          </SidebarLink>
          <SidebarLink to="/turmas" icon={BookUser}>
            Turmas
          </SidebarLink>
          <SidebarLink to="/modalidades" icon={School}>
            Modalidades
          </SidebarLink>
          <SidebarLink to="/eventos" icon={Calendar}>
            Eventos
          </SidebarLink>
          <SidebarLink to="/produtos" icon={Package}>
            Produtos
          </SidebarLink>
          <SidebarLink to="/financeiro" icon={DollarSign}>
            Financeiro
          </SidebarLink>
          <SidebarLink to="/relatorios" icon={FileText}>
            Relatórios
          </SidebarLink>
          <SidebarLink to="/configuracoes" icon={Settings}>
            Configurações
          </SidebarLink>
        </nav>
      </div>
      <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground">
        <p>© 2024 Corpore - v1.0.0</p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <button
          className="fixed left-4 top-4 z-50"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <MenuIcon className="h-6 w-6" />
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
            <div
              className="fixed inset-0 bg-black/20"
              onClick={closeSidebar}
            />
            <div className="fixed inset-y-0 left-0 z-50 w-[240px]">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold">Corpore</h2>
                <button onClick={closeSidebar} aria-label="Close menu">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="overflow-y-auto h-[calc(100%-60px)]">{sidebarContent}</div>
            </div>
          </div>
        )}
      </>
    );
  }

  return sidebarContent;
}
