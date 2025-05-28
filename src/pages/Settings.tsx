
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import DataExport from "@/components/export/DataExport";
import NotificationPanel from "@/components/notification/NotificationPanel";
import DataManagement from "@/components/system/DataManagement";
import SystemStatus from "@/components/system/SystemStatus";

const Settings: React.FC = () => {
  return (
    <MainLayout>
      <div className="fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">系統設定</h1>
          <p className="text-muted-foreground mt-1">
            管理系統各項設定與功能
          </p>
        </div>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="export">數據導出</TabsTrigger>
            <TabsTrigger value="notifications">通知中心</TabsTrigger>
            <TabsTrigger value="data">數據管理</TabsTrigger>
            <TabsTrigger value="status">系統狀態</TabsTrigger>
          </TabsList>
          
          <TabsContent value="export" className="mt-6">
            <DataExport />
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
            <NotificationPanel />
          </TabsContent>
          
          <TabsContent value="data" className="mt-6">
            <DataManagement />
          </TabsContent>
          
          <TabsContent value="status" className="mt-6">
            <SystemStatus />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
