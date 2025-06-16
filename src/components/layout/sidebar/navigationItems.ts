
import {
  FileText,
  FileCheck,
  Home,
  BarChart,
  Settings,
  Database,
  Tag,
  Folder,
  Users,
  Building,
  Receipt,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

export const mainNavItems: NavItem[] = [
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

export const adminNavItems: NavItem[] = [
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
