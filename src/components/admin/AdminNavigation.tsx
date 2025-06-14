
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Settings, Users, FileText, Copy, FolderOpen, Shield, Calendar } from "lucide-react";

const AdminNavigation: React.FC = () => {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
      <Link to="/admin/programs">
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full border">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <FileText className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-medium">補助計劃管理</h3>
            <p className="text-sm text-muted-foreground text-center mt-2">
              新增、編輯和管理補助計劃
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link to="/admin/activities">
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full border">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Calendar className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-medium">活動管理</h3>
            <p className="text-sm text-muted-foreground text-center mt-2">
              管理活動資料與補助申請
            </p>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/files">
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full border">
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
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full border">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-medium">單位管理</h3>
            <p className="text-sm text-muted-foreground text-center mt-2">
              管理系統單位帳號與資料
            </p>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/users">
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full border">
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
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full border">
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
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full border">
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
  );
};

export default AdminNavigation;
