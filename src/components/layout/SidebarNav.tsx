import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  FileCheck, 
  FileText, 
  Home, 
  BarChart, 
  Settings, 
  Database,
  Tag,
  Info,
  Folder,
  Users
} from "lucide-react";

const mainNavItems = [
  {
    title: "儀表板",
    href: "/",
    icon: Home,
  },
  {
    title: "活動管理",
    href: "/activities",
    icon: FileText,
  },
  {
    title: "補助計劃",
    href: "/programs",
    icon: Tag,
  },
  {
    title: "申請進度追蹤",
    href: "/applications",
    icon: FileCheck,
  },
  {
    title: "附件與檔案",
    href: "/files",
    icon: Folder,
  }
];

const adminNavItems: NavItem[] = [
  {
    title: "統計分析",
    href: "/statistics",
    icon: BarChart,
  },
  {
    title: "管理員設定",
    href: "/admin",
    icon: Settings,
  },
  {
    title: "系統日誌",
    href: "/logs",
    icon: Database,
  },
  {
    title: "用戶管理",
    href: "/users",
    icon: Users,
  }
];

const SidebarNav: React.FC = () => {
  const location = useLocation();
  const isActive = (href: string) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <div className="w-64 bg-sidebar border-r border-border h-full flex flex-col overflow-y-auto">
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-brand-600 text-white rounded p-1">
            <FileText size={24} />
          </div>
          <span className="font-bold text-lg">補助申請系統</span>
        </Link>
      </div>

      <div className="flex-1 px-3 py-2">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground px-3 py-1.5">
            主要功能
          </p>
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                isActive(item.href) ? "bg-accent text-accent-foreground" : "transparent"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </div>

        <div className="mt-6 space-y-1">
          <p className="text-xs font-medium text-muted-foreground px-3 py-1.5">
            管理員功能
          </p>
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                isActive(item.href) ? "bg-accent text-accent-foreground" : "transparent"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 bg-blue-50 rounded-md p-2 text-brand-800">
          <Info className="h-4 w-4" />
          <span className="text-xs">版本 1.0.0</span>
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;
