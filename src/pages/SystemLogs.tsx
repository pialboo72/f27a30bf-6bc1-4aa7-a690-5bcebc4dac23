
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layout/MainLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";

// 模擬系統日誌
const generateLogs = () => {
  const logTypes = ["info", "warning", "error", "success"];
  const actions = [
    "用戶登入",
    "新增補助計劃",
    "編輯補助計劃",
    "刪除補助計劃",
    "提交申請",
    "審核申請",
    "上傳檔案",
    "下載檔案",
    "修改系統設定",
    "用戶註冊",
    "重置密碼",
    "更新用戶資料"
  ];
  const users = ["張小明", "李大華", "王美玲", "陳志明", "系統"];
  
  const logs = [];
  const startDate = new Date('2025-04-01');
  const endDate = new Date('2025-04-23');
  
  for (let i = 0; i < 100; i++) {
    const logDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const formattedDate = `${logDate.getFullYear()}-${String(logDate.getMonth() + 1).padStart(2, '0')}-${String(logDate.getDate()).padStart(2, '0')} ${String(logDate.getHours()).padStart(2, '0')}:${String(logDate.getMinutes()).padStart(2, '0')}:${String(logDate.getSeconds()).padStart(2, '0')}`;
    
    logs.push({
      id: i + 1,
      timestamp: formattedDate,
      type: logTypes[Math.floor(Math.random() * logTypes.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      user: users[Math.floor(Math.random() * users.length)],
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      details: `操作ID: ${Math.floor(Math.random() * 10000)}`
    });
  }
  
  // 按照時間戳降序排序
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const mockLogs = generateLogs();

const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState(mockLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  
  const itemsPerPage = 10;
  
  // 處理日期範圍變更
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'start' | 'end') => {
    setDateRange({
      ...dateRange,
      [field]: e.target.value
    });
  };
  
  // 處理搜索和過濾
  const filteredLogs = logs.filter(log => {
    // 搜索條件
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 類型過濾
    const matchesType = filterType === "all" || log.type === filterType;
    
    // 日期過濾
    let matchesDate = true;
    if (dateRange.start) {
      matchesDate = matchesDate && new Date(log.timestamp) >= new Date(dateRange.start);
    }
    if (dateRange.end) {
      matchesDate = matchesDate && new Date(log.timestamp) <= new Date(dateRange.end + " 23:59:59");
    }
    
    return matchesSearch && matchesType && matchesDate;
  });
  
  // 計算分頁
  const pageCount = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // 處理清空日誌
  const handleClearLogs = () => {
    if (confirm("確定要清空所有系統日誌嗎？此操作無法撤銷。")) {
      setLogs([]);
      toast.success("已清空系統日誌");
    }
  };
  
  // 處理匯出日誌
  const handleExportLogs = () => {
    toast.success("已開始匯出日誌");
  };
  
  // 日誌類型對應的徽章樣式
  const logTypeBadge = {
    info: "bg-blue-100 text-blue-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800"
  };

  return (
    <MainLayout>
      <div className="fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">系統日誌</h1>
            <p className="text-muted-foreground mt-1">查看系統操作記錄</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportLogs}>
              匯出日誌
            </Button>
            <Button variant="destructive" onClick={handleClearLogs}>
              清空日誌
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">篩選條件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  日誌類型
                </label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇類型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="info">一般資訊</SelectItem>
                    <SelectItem value="warning">警告</SelectItem>
                    <SelectItem value="error">錯誤</SelectItem>
                    <SelectItem value="success">成功</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  開始日期
                </label>
                <Input 
                  type="date" 
                  value={dateRange.start}
                  onChange={(e) => handleDateChange(e, 'start')}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  結束日期
                </label>
                <Input 
                  type="date" 
                  value={dateRange.end}
                  onChange={(e) => handleDateChange(e, 'end')}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  搜尋
                </label>
                <Input 
                  placeholder="搜尋動作、使用者或詳情..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>時間</TableHead>
                  <TableHead>類型</TableHead>
                  <TableHead>動作</TableHead>
                  <TableHead>使用者</TableHead>
                  <TableHead>IP位址</TableHead>
                  <TableHead>詳情</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs whitespace-nowrap">{log.timestamp}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={logTypeBadge[log.type as keyof typeof logTypeBadge]}>
                          {log.type === 'info' && '一般資訊'}
                          {log.type === 'warning' && '警告'}
                          {log.type === 'error' && '錯誤'}
                          {log.type === 'success' && '成功'}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{log.details}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      沒有找到符合條件的日誌記錄
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* 分頁控制 */}
        {pageCount > 0 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1} 
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, pageCount) }).map((_, i) => {
                  let pageNumber;
                  if (pageCount <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= pageCount - 2) {
                    pageNumber = pageCount - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        onClick={() => setCurrentPage(pageNumber)}
                        isActive={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {pageCount > 5 && currentPage < pageCount - 2 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink onClick={() => setCurrentPage(pageCount)}>
                        {pageCount}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                    disabled={currentPage === pageCount} 
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SystemLogs;
