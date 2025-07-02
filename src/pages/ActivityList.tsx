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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Copy, Trash2, Download, Printer, Upload } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BatchOperations from "@/components/activity/BatchOperations";
import DragDropUpload from "@/components/activity/DragDropUpload";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const ActivityList: React.FC = () => {
  const { downloadFile } = useFiles();
  const [activities, setActivities] = useState<any[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<Set<number>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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

  // 生成活動申請文件內容
  const generateDocumentContent = (activity: any) => {
    return `活動申請書

活動名稱：${activity.name || activity.title || ''}
活動類別：${activity.category || ''}
活動日期：${activity.date || ''}
活動地點：${activity.location || ''}
主辦單位：${activity.unit || ''}

活動目的：
${activity.purpose || ''}

活動內容：
${activity.content || ''}

參與對象：${activity.target || ''}
預計參與人數：${activity.participants || ''}人

申請日期：${new Date().toLocaleDateString()}
申請狀態：${activity.status || ''}`;
  };

  const handleSelectActivity = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedActivities);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedActivities(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedActivities(new Set(activities.map(a => a.id)));
    } else {
      setSelectedActivities(new Set());
    }
  };

  const handleDelete = (id: number) => {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      setIsLoading(true);
      setTimeout(() => {
        const updatedActivities = activities.filter(activity => activity.id !== deleteTargetId);
        setActivities(updatedActivities);
        localStorage.setItem('activities', JSON.stringify(updatedActivities));
        setDeleteDialogOpen(false);
        setDeleteTargetId(null);
        setIsLoading(false);
        toast.success("活動已刪除");
      }, 500);
    }
  };

  const handleBatchDelete = () => {
    setBatchDeleteDialogOpen(true);
  };

  const confirmBatchDelete = () => {
    setIsLoading(true);
    setTimeout(() => {
      const updatedActivities = activities.filter(activity => !selectedActivities.has(activity.id));
      setActivities(updatedActivities);
      localStorage.setItem('activities', JSON.stringify(updatedActivities));
      setSelectedActivities(new Set());
      setBatchDeleteDialogOpen(false);
      setIsLoading(false);
      toast.success(`已刪除 ${selectedActivities.size} 個活動`);
    }, 500);
  };

  const handleBatchCopy = () => {
    setIsLoading(true);
    setTimeout(() => {
      const activitiesToCopy = activities.filter(activity => selectedActivities.has(activity.id));
      const newActivities = activitiesToCopy.map(activity => ({
        ...activity,
        id: new Date().getTime() + Math.random(),
        name: `${activity.name} (複製)`,
        status: "草稿"
      }));
      const updatedActivities = [...activities, ...newActivities];
      setActivities(updatedActivities);
      localStorage.setItem('activities', JSON.stringify(updatedActivities));
      setSelectedActivities(new Set());
      setIsLoading(false);
      toast.success(`已複製 ${activitiesToCopy.length} 個活動`);
    }, 500);
  };

  const handleBatchExport = () => {
    const activitiesToExport = activities.filter(activity => selectedActivities.has(activity.id));
    const exportData = activitiesToExport.map(activity => generateDocumentContent(activity)).join('\n\n---\n\n');
    
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `批量活動導出_${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`已導出 ${activitiesToExport.length} 個活動`);
  };

  const handleFileUpload = (files: FileList) => {
    console.log('上傳的檔案:', files);
    toast.success(`準備處理 ${files.length} 個檔案`);
    setUploadDialogOpen(false);
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

  // 生成活動申請文件內容
  const generateDocumentContent = (activity: any) => {
    return `活動申請書

活動名稱：${activity.name || activity.title || ''}
活動類別：${activity.category || ''}
活動日期：${activity.date || ''}
活動地點：${activity.location || ''}
主辦單位：${activity.unit || ''}

活動目的：
${activity.purpose || ''}

活動內容：
${activity.content || ''}

參與對象：${activity.target || ''}
預計參與人數：${activity.participants || ''}人

申請日期：${new Date().toLocaleDateString()}
申請狀態：${activity.status || ''}`;
  };

  const handleDownload = (id: number, format: string = 'txt') => {
    const activity = activities.find(a => a.id === id);
    
    if (!activity?.hasDocument) {
      toast.error("此活動尚未生成申請文件");
      return;
    }
    
    const content = generateDocumentContent(activity);
    const fileName = `${activity.name || activity.title}_申請文件`;
    
    try {
      let blob;
      let mimeType;
      let fileExtension;
      
      switch (format) {
        case 'docx':
          // 簡單的 RTF 格式，可以被 Word 打開
          const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24 ${content.replace(/\n/g, '\\par ')}}`;
          blob = new Blob([rtfContent], { type: 'application/rtf' });
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          fileExtension = 'rtf'; // 使用 RTF 格式，Word 可以打開
          break;
        case 'odt':
          // ODT 格式的簡單實現
          blob = new Blob([content], { type: 'application/vnd.oasis.opendocument.text' });
          mimeType = 'application/vnd.oasis.opendocument.text';
          fileExtension = 'txt'; // 簮化為文字檔
          break;
        case 'pdf':
          // PDF 格式需要特殊處理，這裡簡化為文字檔
          blob = new Blob([content], { type: 'text/plain' });
          mimeType = 'text/plain';
          fileExtension = 'txt';
          break;
        default:
          blob = new Blob([content], { type: 'text/plain' });
          mimeType = 'text/plain';
          fileExtension = 'txt';
      }
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("文件下載完成");
    } catch (error) {
      console.error('下載文件時發生錯誤:', error);
      toast.error("下載文件時發生錯誤");
    }
  };

  const handlePrint = (id: number) => {
    const activity = activities.find(a => a.id === id);
    
    if (!activity?.hasDocument) {
      toast.error("此活動尚未生成申請文件");
      return;
    }
    
    const content = generateDocumentContent(activity);
    
    // 創建新視窗進行列印
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${activity.name} - 申請文件</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              h1 { text-align: center; margin-bottom: 30px; }
              .content { white-space: pre-line; }
            </style>
          </head>
          <body>
            <div class="content">${content}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
      
      toast.success("正在列印文件");
    } else {
      toast.error("無法開啟列印視窗");
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" text="處理中..." />
        </div>
      </MainLayout>
    );
  }

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
            <Button 
              variant="outline" 
              onClick={() => setUploadDialogOpen(true)}
            >
              <Upload className="mr-2 h-4 w-4" />
              批量匯入
            </Button>
            <Button variant="outline" asChild>
              <Link to="/document-template">
                <FileText className="mr-2 h-4 w-4" />
                文件模板
              </Link>
            </Button>
          </div>
        </div>

        <BatchOperations
          selectedCount={selectedActivities.size}
          onBatchDelete={handleBatchDelete}
          onBatchExport={handleBatchExport}
          onBatchCopy={handleBatchCopy}
          onClearSelection={() => setSelectedActivities(new Set())}
        />

        <Card className={selectedActivities.size > 0 ? "mt-4" : ""}>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedActivities.size === activities.length && activities.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
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
                    <TableCell>
                      <Checkbox
                        checked={selectedActivities.has(activity.id)}
                        onCheckedChange={(checked) => handleSelectActivity(activity.id, !!checked)}
                      />
                    </TableCell>
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

        {/* 單個刪除確認對話框 */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>確認刪除</AlertDialogTitle>
              <AlertDialogDescription>
                您確定要刪除此活動嗎？此操作無法撤銷。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                確認刪除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* 批量刪除確認對話框 */}
        <AlertDialog open={batchDeleteDialogOpen} onOpenChange={setBatchDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>確認批量刪除</AlertDialogTitle>
              <AlertDialogDescription>
                您確定要刪除選中的 {selectedActivities.size} 個活動嗎？此操作無法撤銷。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmBatchDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                確認刪除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* 批量匯入對話框 */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>批量匯入活動</DialogTitle>
            </DialogHeader>
            <DragDropUpload
              onFileUpload={handleFileUpload}
              accept=".json,.csv,.xlsx"
              multiple={true}
            />
          </DialogContent>
        </Dialog>
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
