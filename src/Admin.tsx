
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Settings, Users, FileText, Copy, FolderOpen, Building } from "lucide-react";
import SystemStatus from "@/components/system/SystemStatus";

const Admin: React.FC = () => {
  const handleSave = () => {
    toast.success("設定已保存");
  };

  return (
    <MainLayout>
      <div className="fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">系統管理</h1>
          <p className="text-muted-foreground mt-1">
            管理系統設定與參數
          </p>
        </div>

        <div className="mb-8">
          <SystemStatus />
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
          <Link to="/admin/programs">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <FileText className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-medium">補助計劃管理</h3>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  新增、編輯和管理補助計劃
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/files">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <FolderOpen className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-medium">檔案管理</h3>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  管理系統相關附件與檔案
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/units">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Building className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-medium">單位管理</h3>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  管理單位資料與聯絡資訊
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/users">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-medium">用戶管理</h3>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  管理系統用戶帳號與權限
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/logs">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Copy className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-medium">系統日誌</h3>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  查看系統操作記錄
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/settings">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Settings className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-medium">系統設定</h3>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  AI設定、系統參數配置
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>快速設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">系統名稱</label>
                <Input type="text" defaultValue="補助申請系統" />
              </div>
              <div>
                <label className="text-sm font-medium">管理員郵箱</label>
                <Input type="email" placeholder="admin@example.com" />
              </div>
              <Button onClick={handleSave}>保存設定</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Admin;
