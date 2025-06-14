
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import AdminStats from "@/components/admin/AdminStats";
import AdminQuickSettings from "@/components/admin/AdminQuickSettings";

const Admin: React.FC = () => {
  return (
    <MainLayout>
      <div className="fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">系統管理</h1>
          <p className="text-muted-foreground mt-1">
            管理系統設定與參數
          </p>
        </div>

        <AdminStats />
        <AdminQuickSettings />
      </div>
    </MainLayout>
  );
};

export default Admin;
