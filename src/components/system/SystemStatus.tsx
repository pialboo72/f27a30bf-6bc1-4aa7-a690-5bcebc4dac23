
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Users, FileText, Activity, AlertCircle } from "lucide-react";

const SystemStatus: React.FC = () => {
  const systemModules = [
    { name: '用戶管理', status: 'active', icon: Users, description: '用戶註冊、權限管理' },
    { name: '活動管理', status: 'active', icon: Activity, description: '活動創建、編輯、審核' },
    { name: '申請追蹤', status: 'active', icon: FileText, description: '申請狀態追蹤' },
    { name: '文件範本', status: 'active', icon: FileText, description: '範本管理系統' },
    { name: '統計報表', status: 'active', icon: FileText, description: '數據分析與報表' },
    { name: '檔案管理', status: 'active', icon: FileText, description: '檔案上傳與管理' },
    { name: '系統設定', status: 'active', icon: FileText, description: 'AI設定、系統參數' },
    { name: '數據導出', status: 'active', icon: FileText, description: 'Excel、CSV、PDF導出' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">運行中</Badge>;
      case 'pending':
        return <Badge variant="secondary">待機</Badge>;
      case 'error':
        return <Badge variant="destructive">錯誤</Badge>;
      default:
        return <Badge variant="outline">未知</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          系統模組狀態
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {systemModules.map((module) => (
            <div key={module.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(module.status)}
                <div>
                  <h4 className="font-medium">{module.name}</h4>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
              </div>
              {getStatusBadge(module.status)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
