
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import AdminQuickSettings from "@/components/admin/AdminQuickSettings";

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

        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="admin">管理員設定</TabsTrigger>
          </TabsList>
          
          <TabsContent value="admin" className="mt-6">
            <AdminQuickSettings />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
