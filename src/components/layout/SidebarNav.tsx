
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
  Users,
  Building,
  Receipt
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const mainNavItems: NavItem[] = [
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
    href: "/tracking",
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
    title: "補助管理",
    href: "/admin/subsidies",
    icon: Receipt,
  },
  {
    title: "單位管理",
    href: "/admin/units",
    icon: Building,
  },
  {
    title: "文件模板管理",
    href: "/document-template",
    icon: FileText,
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
  },
  {
    title: "系統設定",
    href: "/settings",
    icon: Settings,
  }
];

const SidebarNav: React.FC = () => {
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
    <div className="fixed left-0 top-0 w-72 bg-sidebar/90 border-r border-border h-screen flex flex-col overflow-y-auto z-40 shadow-2xl animate-fade-in">
      <div className="p-7">
        <Link to="/" className="flex items-center space-x-3">
          <div className="bg-brand-600 text-white rounded-lg p-2 shadow hover:scale-110 transition-transform duration-200">
            <FileText size={36} />
          </div>
          <span className="font-extrabold text-2xl tracking-wide text-brand-800 drop-shadow">補助申請系統</span>
        </Link>
      </div>

      <div className="flex-1 px-4 py-2">
        <div className="space-y-2">
          <p className="text-base font-semibold text-muted-foreground/90 px-3 py-1.5">
            主要功能
          </p>
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-4 rounded-xl px-3 py-3 text-lg font-semibold transition-all duration-200 hover:bg-brand-100 hover:text-brand-900 focus-visible:ring-2 focus-visible:ring-ring shadow hover:shadow-lg",
                isActive(item.href) ? "bg-brand-200 text-brand-900 shadow-xl" : "bg-sidebar"
              )}
              style={{ minHeight: 54 }}
            >
              <item.icon className="h-7 w-7 mr-2 text-brand-700 drop-shadow" />
              {item.title}
            </Link>
          ))}
        </div>

        <div className="mt-8 space-y-2">
          <p className="text-base font-semibold text-muted-foreground/90 px-3 py-1.5">
            管理員功能
          </p>
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-4 rounded-xl px-3 py-3 text-lg font-semibold transition-all duration-200 hover:bg-brand-100 hover:text-brand-900 focus-visible:ring-2 focus-visible:ring-ring shadow hover:shadow-lg",
                isActive(item.href) ? "bg-brand-200 text-brand-900 shadow-xl" : "bg-sidebar"
              )}
              style={{ minHeight: 54 }}
            >
              <item.icon className="h-7 w-7 mr-2 text-brand-700 drop-shadow" />
              {item.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-border">
        <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-3 text-brand-800 shadow animate-fade-in">
          <Info className="h-5 w-5" />
          <span className="text-base font-bold">版本 1.0.0</span>
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;
