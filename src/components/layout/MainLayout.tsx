
import React, { ReactNode, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarNav from "./SidebarNav";
import PageHeader from "./PageHeader";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [isPinned, setIsPinned] = useState(false);

  const handleSidebarMouseEnter = () => {
    if (!isPinned) {
      setCollapsed(false);
    }
  };

  const handleSidebarMouseLeave = () => {
    if (!isPinned) {
      setCollapsed(true);
    }
  };

  const handleTogglePin = () => {
    setIsPinned(!isPinned);
    if (!isPinned) {
      // When pinning, expand the sidebar
      setCollapsed(false);
    } else {
      // When unpinning, collapse the sidebar
      setCollapsed(true);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SidebarNav
          collapsed={collapsed}
          onMouseEnter={handleSidebarMouseEnter}
          onMouseLeave={handleSidebarMouseLeave}
          isPinned={isPinned}
          onTogglePin={handleTogglePin}
        />
        <div
          className="flex-1 flex flex-col transition-all duration-300"
          style={{
            marginLeft: collapsed ? "6rem" : "18rem",
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
