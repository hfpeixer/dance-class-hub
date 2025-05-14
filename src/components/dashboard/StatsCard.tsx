
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "primary" | "secondary" | "ballet" | "jazz" | "ginastica" | "ritmica" | "futsal";
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendValue,
  color = "primary",
  className,
}) => {
  const getColorClass = () => {
    switch (color) {
      case "primary":
        return "bg-dance-primary text-white";
      case "secondary":
        return "bg-dance-secondary text-white";
      case "ballet":
        return "bg-modalidades-ballet text-dance-dark";
      case "jazz":
        return "bg-modalidades-jazz text-dance-dark";
      case "ginastica":
        return "bg-modalidades-ginastica text-dance-dark";
      case "ritmica":
        return "bg-modalidades-ritmica text-dance-dark";
      case "futsal":
        return "bg-modalidades-futsal text-dance-dark";
      default:
        return "bg-dance-primary text-white";
    }
  };

  const getTrendIcon = () => {
    if (trend === "up") {
      return (
        <svg
          className="h-3 w-3 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      );
    }

    if (trend === "down") {
      return (
        <svg
          className="h-3 w-3 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      );
    }

    return null;
  };

  return (
    <div className={cn("dança-card relative overflow-hidden", className)}>
      <div className={cn("dança-icon-bg", getColorClass())}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="pt-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="mt-2 flex items-baseline">
          <p className="text-2xl font-semibold">{value}</p>
          {trend && trendValue && (
            <p
              className={cn(
                "ml-2 text-xs font-medium flex items-center",
                trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500"
              )}
            >
              {getTrendIcon()}
              <span className="ml-1">{trendValue}</span>
            </p>
          )}
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
};
