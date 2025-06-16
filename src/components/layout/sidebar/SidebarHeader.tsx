
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import GrantCloudLogo from "@/components/branding/GrantCloudLogo";

interface SidebarHeaderProps {
  collapsed: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed }) => {
  return (
    <div
      className={cn(
        "flex items-center px-2 py-7 gap-2",
        collapsed ? "justify-center" : "justify-between"
      )}
    >
      <Link
        to="/"
        className={cn(
          "flex items-center transition-all duration-300",
          collapsed ? "justify-center" : "space-x-3"
        )}
      >
        <div className="bg-brand-600 text-white rounded-lg p-2 shadow hover:scale-110 transition-transform duration-200 flex items-center justify-center">
          <GrantCloudLogo size={collapsed ? 32 : 40} className="drop-shadow" />
        </div>
        {!collapsed && (
          <span className="font-extrabold text-2xl tracking-wide text-brand-800 drop-shadow">
            補助雲管理系統
            <span className="text-lg font-bold ml-4 text-brand-600">GrantCloud</span>
          </span>
        )}
      </Link>
    </div>
  );
};

export default SidebarHeader;
