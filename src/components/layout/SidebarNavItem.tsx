
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}
interface SidebarNavItemProps {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ item, active, collapsed }) => {
  return (
    <div className="relative group">
      <Link
        to={item.href}
        className={cn(
          "flex items-center gap-4 rounded-xl px-3 py-4 text-xl font-semibold transition-all duration-200",
          "hover:bg-brand-100 hover:text-brand-900 focus-visible:ring-2 focus-visible:ring-ring shadow hover:shadow-lg",
          active ? "bg-brand-200 text-brand-900 shadow-xl" : "bg-sidebar",
          collapsed ? "justify-center px-0 py-3" : ""
        )}
        style={{ minHeight: 54 }}
      >
        <item.icon
          className={cn(
            "drop-shadow",
            active ? "text-brand-800" : "text-brand-700",
            collapsed ? "h-8 w-8" : "h-7 w-7",
            "transition-all duration-200"
          )}
        />
        {!collapsed && <span className="truncate">{item.title}</span>}
      </Link>
      {/* Tooltip：側欄縮小時顯示標題 */}
      {collapsed && (
        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap rounded px-3 py-1 bg-gray-900 text-white text-base font-bold shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity duration-200">
          {item.title}
        </span>
      )}
    </div>
  );
};

export default SidebarNavItem;
