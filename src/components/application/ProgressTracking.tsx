
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, User, FileText, CheckCircle, AlertCircle, Plus, Paperclip, Download } from 'lucide-react';
import { toast } from "sonner";

interface ProgressEntry {
  id: number;
  action: string;
  description: string;
  user: string;
  timestamp: string;
  status: 'info' | 'success' | 'warning' | 'error';
  attachments?: { id: number; name: string; size: number }[];
}

interface ProgressTrackingProps {
  applicationId: string;
}

const ProgressTracking: React.FC<ProgressTrackingProps> = ({ applicationId }) => {
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([
    {
      id: 1,
      action: '申請提交',
      description: '申請者已提交補助申請',
      user: '申請者',
      timestamp: '2024-01-15 10:30:00',
      status: 'info'
    },
    {
      id: 2,
      action: '初步審核',
      description: '承辦人員開始審核申請資料',
      user: '王小明',
      timestamp: '2024-01-16 09:15:00',
      status: 'info'
    },
    {
      id: 3,
      action: '補件要求',
      description: '需要補充活動詳細企劃書',
      user: '王小明',
      timestamp: '2024-01-18 14:20:00',
      status: 'warning',
      attachments: [
        { id: 1, name: '補件通知書.pdf', size: 245000 }
      ]
    },
    {
      id: 4,
      action: '補件完成',
      description: '申請者已補充所需文件',
      user: '申請者',
      timestamp: '2024-01-20 11:45:00',
      status: 'success',
      attachments: [
        { id: 2, name: '活動詳細企劃書.docx', size: 1200000 },
        { id: 3, name: '預算修正表.xlsx', size: 320000 }
      ]
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    action: '',
    description: '',
    status: 'info' as 'info' | 'success' | 'warning' | 'error'
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleAddProgress = () => {
    if (!newEntry.action.trim() || !newEntry.description.trim()) {
      toast.error("請填寫完整的進度資訊");
      return;
    }

    const progressAttachments = attachments.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: file.size
    }));

    const newProgressEntry: ProgressEntry = {
      id: Date.now(),
      action: newEntry.action,
      description: newEntry.description,
      user: '系統管理員', // 應該從用戶上下文獲取
      timestamp: new Date().toLocaleString('zh-TW'),
      status: newEntry.status,
      attachments: progressAttachments.length > 0 ? progressAttachments : undefined
    };

    setProgressEntries(prev => [...prev, newProgressEntry]);
    setNewEntry({ action: '', description: '', status: 'info' });
    setAttachments([]);
    setDialogOpen(false);
    toast.success("進度記錄已新增");
  };

  const downloadAttachment = (attachment: { name: string }) => {
    toast.success(`開始下載 ${attachment.name}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            申請進度追蹤
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="mr-1 h-4 w-4" />
                新增進度
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新增進度記錄</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">動作/階段</label>
                  <Input
                    value={newEntry.action}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, action: e.target.value }))}
                    placeholder="例如：審核完成、補件要求等"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">說明</label>
                  <Textarea
                    value={newEntry.description}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="詳細說明此階段的處理情況"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">狀態</label>
                  <select
                    value={newEntry.status}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, status: e.target.value as any }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="info">進行中</option>
                    <option value="success">完成</option>
                    <option value="warning">待處理</option>
                    <option value="error">錯誤</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">附件 (可選)</label>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                  />
                  {attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {attachments.map((file, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          {file.name} ({formatFileSize(file.size)})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleAddProgress}>
                    新增
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {progressEntries.map((entry, index) => (
            <div key={entry.id} className="relative">
              {index < progressEntries.length - 1 && (
                <div className="absolute left-6 top-12 h-8 w-px bg-gray-200" />
              )}
              
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  {getStatusIcon(entry.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{entry.action}</h4>
                      <Badge className={getStatusColor(entry.status)}>
                        {entry.status === 'success' ? '完成' :
                         entry.status === 'warning' ? '待處理' :
                         entry.status === 'error' ? '錯誤' : '進行中'}
                      </Badge>
                    </div>
                    <time className="text-sm text-gray-500">{entry.timestamp}</time>
                  </div>
                  
                  <p className="text-gray-600 mt-1">{entry.description}</p>
                  
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <User className="h-3 w-3 mr-1" />
                    {entry.user}
                  </div>

                  {entry.attachments && entry.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Paperclip className="h-3 w-3 mr-1" />
                        附件:
                      </div>
                      {entry.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                          <span>{attachment.name} ({formatFileSize(attachment.size)})</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadAttachment(attachment)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTracking;
