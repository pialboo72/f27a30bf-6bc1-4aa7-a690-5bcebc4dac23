
import React, { ReactNode, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarNav from "./SidebarNav";
import PageHeader from "./PageHeader";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);

  // 當側邊欄進入/離開時切換狀態
  const handleSidebarMouseEnter = () => setCollapsed(false);
  const handleSidebarMouseLeave = () => setCollapsed(true);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SidebarNav
          collapsed={collapsed}
          onMouseEnter={handleSidebarMouseEnter}
          onMouseLeave={handleSidebarMouseLeave}
        />
        <div
          className="flex-1 flex flex-col transition-all duration-300"
          style={{
            marginLeft: collapsed ? "6rem" : "18rem", // w-24:6rem, w-72:18rem
            // 使內容盡可能置中
            alignItems: "center",
          }}
        >
          <PageHeader />
          <main className="flex-1 p-6 w-full max-w-6xl" style={{ margin: "0 auto" }}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
