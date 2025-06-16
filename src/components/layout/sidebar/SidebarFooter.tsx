
import React from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface SidebarFooterProps {
  collapsed: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ collapsed }) => {
  return (
    <div
      className={cn(
        "p-6 border-t border-border transition-all duration-300",
        collapsed ? "flex justify-center p-3" : ""
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 bg-blue-50 rounded-lg p-3 text-brand-800 shadow animate-fade-in",
          collapsed && "justify-center p-3 bg-blue-100"
        )}
      >
        <Info className="h-5 w-5" />
        {!collapsed && (
          <span className="text-base font-bold">版本 1.0.0</span>
        )}
      </div>
    </div>
  );
};

export default SidebarFooter;
