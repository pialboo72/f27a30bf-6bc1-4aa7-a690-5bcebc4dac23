
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, Database, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const DataManagement: React.FC = () => {
  const handleBackup = () => {
    const data = {
      activities: JSON.parse(localStorage.getItem('activities') || '[]'),
      budgetItems: JSON.parse(localStorage.getItem('budgetItems') || '[]'),
      applications: JSON.parse(localStorage.getItem('applications') || '[]'),
      users: JSON.parse(localStorage.getItem('users') || '[]'),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('系統資料已成功備份');
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // 驗證數據格式
        if (data.activities) localStorage.setItem('activities', JSON.stringify(data.activities));
        if (data.budgetItems) localStorage.setItem('budgetItems', JSON.stringify(data.budgetItems));
        if (data.applications) localStorage.setItem('applications', JSON.stringify(data.applications));
        if (data.users) localStorage.setItem('users', JSON.stringify(data.users));

        toast.success('系統資料已成功還原');
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        toast.error('備份文件格式錯誤');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (confirm('確定要清除所有系統資料嗎？此操作無法恢復。')) {
      localStorage.removeItem('activities');
      localStorage.removeItem('budgetItems');
      localStorage.removeItem('applications');
      localStorage.removeItem('users');
      toast.success('系統資料已清除');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5" />
          數據管理
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={handleBackup} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            備份數據
          </Button>
          
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleRestore}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              還原數據
            </Button>
          </div>
          
          <Button onClick={handleClearData} variant="destructive" className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            清除數據
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>• 備份數據：將所有系統數據導出為 JSON 文件</p>
          <p>• 還原數據：從備份文件恢復系統數據</p>
          <p>• 清除數據：刪除所有本地存儲的數據（謹慎使用）</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataManagement;
