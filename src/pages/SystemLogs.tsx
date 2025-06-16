
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Download, Filter, AlertCircle, Info, CheckCircle, XCircle } from "lucide-react";

interface LogEntry {
  id: number;
  timestamp: string;
  level: "info" | "warning" | "error" | "success";
  action: string;
  user: string;
  details: string;
  ip?: string;
}

const SystemLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  
  const mockLogs: LogEntry[] = [
    {
      id: 1,
      timestamp: "2025-06-16 14:30:25",
      level: "info",
      action: "用戶登入",
      user: "admin@example.com",
      details: "管理員成功登入系統",
      ip: "192.168.1.100"
    },
    {
      id: 2,
      timestamp: "2025-06-16 14:25:10",
      level: "success",
      action: "檔案上傳",
      user: "user@example.com",
      details: "成功上傳檔案: 申請表格.docx (2.5MB)",
      ip: "192.168.1.101"
    },
    {
      id: 3,
      timestamp: "2025-06-16 14:20:45",
      level: "warning",
      action: "儲存空間警告",
      user: "系統",
      details: "單位 A 儲存空間使用率達到 85%",
    },
    {
      id: 4,
      timestamp: "2025-06-16 14:15:30",
      level: "error",
      action: "檔案上傳失敗",
      user: "user2@example.com",
      details: "檔案大小超過限制 (10MB)",
      ip: "192.168.1.102"
    }
  ];

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "info":
        return <Info className="h-4 w-4" />;
      case "warning":
        return <AlertCircle className="h-4 w-4" />;
      case "error":
        return <XCircle className="h-4 w-4" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getLevelVariant = (level: string) => {
    switch (level) {
      case "info":
        return "secondary";
      case "warning":
        return "outline";
      case "error":
        return "destructive";
      case "success":
        return "default";
      default:
        return "secondary";
    }
  };

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <MainLayout>
      <div className="fade-in">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">系統日誌</h1>
          <p className="text-muted-foreground mt-1">
            查看系統操作記錄與事件日誌
          </p>
        </div>

        {/* 篩選工具 */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜尋日誌..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="篩選等級" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="info">資訊</SelectItem>
                  <SelectItem value="success">成功</SelectItem>
                  <SelectItem value="warning">警告</SelectItem>
                  <SelectItem value="error">錯誤</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                導出日誌
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 日誌列表 */}
        <Card>
          <CardHeader>
            <CardTitle>系統操作記錄</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Badge variant={getLevelVariant(log.level) as any} className="flex items-center gap-1">
                      {getLevelIcon(log.level)}
                      {log.level.toUpperCase()}
                    </Badge>
                    <div>
                      <div className="font-medium">{log.action}</div>
                      <div className="text-sm text-muted-foreground">{log.details}</div>
                      <div className="text-xs text-muted-foreground">
                        用戶: {log.user} {log.ip && `| IP: ${log.ip}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground text-right">
                    {log.timestamp}
                  </div>
                </div>
              ))}
            </div>
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                沒有找到符合條件的日誌記錄
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SystemLogs;
