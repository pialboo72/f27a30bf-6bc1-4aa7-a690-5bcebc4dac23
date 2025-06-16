
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LoadingSpinner from "@/components/ui/loading-spinner";
import StorageQuotaManagement from "./StorageQuotaManagement";
import { toast } from "sonner";

const AdminQuickSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("設定已保存");
    }, 1000);
  };

  return (
    <div className="grid gap-6">
      <StorageQuotaManagement />
      
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
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
            保存設定
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>系統參數</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">系統名稱</label>
            <Input type="text" defaultValue="補助雲管理系統" />
          </div>
          <div>
            <label className="text-sm font-medium">預設檔案上傳大小限制 (MB)</label>
            <Input type="number" defaultValue="10" />
          </div>
          <div>
            <label className="text-sm font-medium">允許的檔案類型</label>
            <Input type="text" defaultValue=".doc,.docx,.pdf,.xls,.xlsx" />
          </div>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
            保存設定
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminQuickSettings;
