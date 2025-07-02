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
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { useFiles } from "@/contexts/FileContext";
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
import BatchOperations from "@/components/activity/BatchOperations";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ActivityTableRow from "@/components/activity/ActivityTableRow";
import { handleDownloadDocument, handlePrintDocument } from "@/components/activity/ActivityDocumentGenerator";

const ActivityList: React.FC = () => {
  const { downloadFile } = useFiles();
  const [activities, setActivities] = useState<any[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<Set<number>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false);
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
          hasDocument: true,
        },
      ];
      setActivities(initialActivities);
      localStorage.setItem('activities', JSON.stringify(initialActivities));
    }
  }, []);

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
    const exportData = activitiesToExport.map(activity => {
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
    }).join('\n\n---\n\n');
    
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

  const handleDownload = (id: number, format: string = 'txt') => {
    const activity = activities.find(a => a.id === id);
    
    if (!activity?.hasDocument) {
      toast.error("此活動尚未生成申請文件");
      return;
    }
    
    const success = handleDownloadDocument(activity, format);
    if (success) {
      toast.success("文件下載完成");
    } else {
      toast.error("下載文件時發生錯誤");
    }
  };

  const handlePrint = (id: number) => {
    const activity = activities.find(a => a.id === id);
    
    if (!activity?.hasDocument) {
      toast.error("此活動尚未生成申請文件");
      return;
    }
    
    const success = handlePrintDocument(activity);
    if (success) {
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
                  <ActivityTableRow
                    key={activity.id}
                    activity={activity}
                    isSelected={selectedActivities.has(activity.id)}
                    onSelect={handleSelectActivity}
                    onCopy={handleCopy}
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                    onPrint={handlePrint}
                  />
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
      </div>
    </MainLayout>
  );
};

export default ActivityList;
