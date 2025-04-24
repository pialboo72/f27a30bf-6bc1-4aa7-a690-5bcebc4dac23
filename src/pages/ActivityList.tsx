import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Plus, Pencil, Copy, Trash2, Download, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { useFiles } from "@/contexts/FileContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ActivityList: React.FC = () => {
  const { downloadFile } = useFiles();
  const [activities, setActivities] = useState<any[]>([]);
  
  // 載入活動數據
  useEffect(() => {
    const savedActivities = localStorage.getItem('activities');
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    } else {
      // 如果沒有保存的活動，使用初始模擬數據
      const initialActivities = [
        {
          id: 1,
          name: "青年藝術發展計劃",
          category: "文化藝術",
          date: "2025-05-01",
          status: "草稿",
        },
        {
          id: 2,
          name: "社區服務計劃",
          category: "社區服務",
          date: "2025-06-15",
          status: "已提交",
          hasDocument: true, // 標記此活動有生成的文件
        },
      ];
      setActivities(initialActivities);
      localStorage.setItem('activities', JSON.stringify(initialActivities));
    }
  }, []);

  const handleDelete = (id: number) => {
    if (window.confirm('確定要刪除此活動嗎？')) {
      const updatedActivities = activities.filter(activity => activity.id !== id);
      setActivities(updatedActivities);
      localStorage.setItem('activities', JSON.stringify(updatedActivities));
      toast.success("活動已刪除");
    }
  };

  const handleCopy = (id: number) => {
    const activityToCopy = activities.find(activity => activity.id === id);
    if (activityToCopy) {
      const newActivity = {
        ...activityToCopy,
        id: new Date().getTime(),
        name: `${activityToCopy.name} (複製)`,
        status: "草稿"
      };
      const updatedActivities = [...activities, newActivity];
      setActivities(updatedActivities);
      localStorage.setItem('activities', JSON.stringify(updatedActivities));
      toast.success("活動已複製");
    }
  };

  const handleDownload = (id: number, format: string = 'docx') => {
    // 檢查此活動是否有生成文件
    const activity = activities.find(a => a.id === id);
    
    if (!activity?.hasDocument) {
      toast.error("此活動尚未生成申請文件");
      return;
    }
    
    toast.success(`正在下載 ${activity.name} 申請文件 (${format})`);
    
    // 模擬下載過程
    setTimeout(() => {
      // 在實際應用中，這裡應該下載真實的文件
      const link = document.createElement('a');
      const blob = new Blob([`${activity.name} 申請文件內容`], { type: 'text/plain' });
      link.href = URL.createObjectURL(blob);
      link.download = `${activity.name}_申請文件.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("文件下載完成");
    }, 1500);
  };

  const handlePrint = (id: number) => {
    // 檢查此活動是否有生成文件
    const activity = activities.find(a => a.id === id);
    
    if (!activity?.hasDocument) {
      toast.error("此活動尚未生成申請文件");
      return;
    }
    
    // 實際應用中，這裡應該載入特定文件內容，而不是直接列印頁面
    toast.success("正在準備列印文件");
    
    // 模擬準備列印過程
    setTimeout(() => {
      window.print();
      toast.success("正在列印文件");
    }, 500);
  };

  return (
    <MainLayout>
      <div className="fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">活動管理</h1>
            <p className="text-muted-foreground mt-1">
              在這裡管理您的所有活動申請案
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/activity/new">
                <Plus className="mr-2 h-4 w-4" />
                新增活動
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/document-template">
                <FileText className="mr-2 h-4 w-4" />
                文件模板
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>活動名稱</TableHead>
                  <TableHead>類別</TableHead>
                  <TableHead>活動日期</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      {activity.name}
                    </TableCell>
                    <TableCell>{activity.category}</TableCell>
                    <TableCell>{activity.date}</TableCell>
                    <TableCell>{activity.status}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                        >
                          <Link to={`/activity/${activity.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        
                        {/* 只有已生成文件的活動才顯示下載和列印按鈕 */}
                        {activity.hasDocument && (
                          <>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  title="下載申請文件"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleDownload(activity.id, 'docx')}>
                                  下載 DOCX 格式
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDownload(activity.id, 'odt')}>
                                  下載 ODT 格式
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDownload(activity.id, 'pdf')}>
                                  下載 PDF 格式
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handlePrint(activity.id)}
                              title="列印申請文件"
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopy(activity.id)}
                          title="複製活動"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(activity.id)}
                          title="刪除活動"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

// 添加 FileText 圖標元件
const FileText = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

export default ActivityList;
