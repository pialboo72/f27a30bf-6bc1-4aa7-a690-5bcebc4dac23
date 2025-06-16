
import React from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarNavSection from "./sidebar/SidebarNavSection";
import SidebarFooter from "./sidebar/SidebarFooter";
import { mainNavItems, adminNavItems } from "./sidebar/navigationItems";

type SidebarNavProps = {
  collapsed: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

const SidebarNav: React.FC<SidebarNavProps> = ({
  collapsed,
  onMouseEnter,
  onMouseLeave,
}) => {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen flex flex-col overflow-y-auto z-40 shadow-2xl animate-fade-in bg-sidebar/90 border-r border-border",
        collapsed ? "w-24" : "w-72",
        "transition-all duration-300"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ minWidth: collapsed ? "6rem" : "18rem" }}
    >
      <SidebarHeader collapsed={collapsed} />

      <div
        className={cn(
          "flex-1 px-2 py-2",
          collapsed ? "px-0 py-2" : "px-4 py-2"
        )}
      >
        <SidebarNavSection
          title="主要功能"
          items={mainNavItems}
          collapsed={collapsed}
          isActive={isActive}
        />

        <div className="mt-8">
          <SidebarNavSection
            title="管理員功能"
            items={adminNavItems}
            collapsed={collapsed}
            isActive={isActive}
          />
        </div>
      </div>

      <SidebarFooter collapsed={collapsed} />
    </div>
  );
};

export default SidebarNav;
