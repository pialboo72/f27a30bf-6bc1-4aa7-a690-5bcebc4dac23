
import React, { useState } from "react";
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
  Receipt,
  // 保留已用的 icon
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
  },
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
  },
];

const SidebarNav: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);

  const isActive = (href: string) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  // 滑鼠進入時展開，離開時縮小（縮小時 collapsed 為 true）
  const handleMouseEnter = () => setCollapsed(false);
  const handleMouseLeave = () => setCollapsed(true);

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen flex flex-col overflow-y-auto z-40 shadow-2xl animate-fade-in bg-sidebar/90 border-r border-border",
        collapsed ? "w-24" : "w-72",
        "transition-all duration-300"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ minWidth: collapsed ? "6rem" : "18rem" }}
    >
      {/* Header / Logo */}
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
          <div className="bg-brand-600 text-white rounded-lg p-2 shadow hover:scale-110 transition-transform duration-200">
            <FileText size={collapsed ? 32 : 36} />
          </div>
          {!collapsed && (
            <span className="font-extrabold text-2xl tracking-wide text-brand-800 drop-shadow">
              補助申請系統
            </span>
          )}
        </Link>
        {/* 移除縮放按鈕 */}
      </div>

      {/* 功能列表 */}
      <div
        className={cn(
          "flex-1 px-2 py-2",
          collapsed ? "px-0 py-2" : "px-4 py-2"
        )}
      >
        {/* 主要功能 */}
        <div className="space-y-2">
          {!collapsed && (
            <p className="text-lg font-bold text-muted-foreground/90 px-3 py-2">
              主要功能
            </p>
          )}
          {mainNavItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              item={item}
              active={isActive(item.href)}
              collapsed={collapsed}
            />
          ))}
        </div>

        {/* 管理員功能 */}
        <div className="mt-8 space-y-2">
          {!collapsed && (
            <p className="text-lg font-bold text-muted-foreground/90 px-3 py-2">
              管理員功能
            </p>
          )}
          {adminNavItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              item={item}
              active={isActive(item.href)}
              collapsed={collapsed}
            />
          ))}
        </div>
      </div>

      {/* 版本資訊 */}
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
    </div>
  );
};

// SidebarNavItem 加入 Tooltip（縮小時顯示標題）並美化
const SidebarNavItem: React.FC<{
  item: NavItem;
  active: boolean;
  collapsed: boolean;
}> = ({ item, active, collapsed }) => {
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

export default SidebarNav;
