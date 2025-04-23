
import React, { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarNav from "./SidebarNav";
import PageHeader from "./PageHeader";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SidebarNav />
        <div className="flex-1 flex flex-col">
          <PageHeader />
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
