
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Settings, Users, FileText, Copy } from "lucide-react";

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

        {/* 管理選項 */}
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
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>AI 設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">API 金鑰</label>
                <Input type="password" placeholder="輸入 OpenAI API 金鑰" />
              </div>
              <div>
                <label className="text-sm font-medium">AI 模型</label>
                <Input type="text" defaultValue="gpt-4" />
              </div>
              <div>
                <label className="text-sm font-medium">提示詞範本</label>
                <Textarea
                  placeholder="輸入 AI 生成內容的提示詞範本"
                  className="h-32"
                />
              </div>
              <Button onClick={handleSave}>保存設定</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>系統參數</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">系統名稱</label>
                <Input type="text" defaultValue="補助申請系統" />
              </div>
              <div>
                <label className="text-sm font-medium">檔案上傳大小限制 (MB)</label>
                <Input type="number" defaultValue="10" />
              </div>
              <div>
                <label className="text-sm font-medium">允許的檔案類型</label>
                <Input type="text" defaultValue=".doc,.docx,.pdf,.xls,.xlsx" />
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
