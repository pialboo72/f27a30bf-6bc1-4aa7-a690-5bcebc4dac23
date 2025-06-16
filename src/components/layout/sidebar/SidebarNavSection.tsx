
import React from "react";
import { cn } from "@/lib/utils";
import SidebarNavItem from "../SidebarNavItem";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface SidebarNavSectionProps {
  title: string;
  items: NavItem[];
  collapsed: boolean;
  isActive: (href: string) => boolean;
}

const SidebarNavSection: React.FC<SidebarNavSectionProps> = ({
  title,
  items,
  collapsed,
  isActive,
}) => {
  return (
    <div className="space-y-2">
      {!collapsed && (
        <p className="text-lg font-bold text-muted-foreground/90 px-3 py-2">
          {title}
        </p>
      )}
      {items.map((item) => (
        <SidebarNavItem
          key={item.href}
          item={item}
          active={isActive(item.href)}
          collapsed={collapsed}
        />
      ))}
    </div>
  );
};

export default SidebarNavSection;
