
import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
  children?: React.ReactNode;
}

export const PageTitle: React.FC<PageTitleProps> = ({
  title,
  subtitle,
  icon: Icon,
  className,
  children,
}) => {
  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6", className)}>
      <div className="flex items-center gap-3 mb-4 sm:mb-0">
        {Icon && (
          <div className="h-10 w-10 rounded-lg bg-dance-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-dance-primary" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="flex gap-2 w-full sm:w-auto">{children}</div>}
    </div>
  );
};
