import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layout/MainLayout";
import ApplicationHistory from "@/components/application/ApplicationHistory";
import { toast } from "sonner";
import { Trash, Eye, Filter, Plus, MessageSquare, Edit, Clock } from "lucide-react";

interface Application {
  id: number;
  activityName: string;
  submitDate: string;
  amount: number;
  reviewAgency: string;
  lastUpdate: string;
  status: string;
  programId?: string;
  notes?: string;
}

interface ProgressRecord {
  id: number;
  applicationId: number;
  date: string;
  time: string;
  status: string;
  notes: string;
  updatedBy: string;
}

const ApplicationTracking: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [progressRecords, setProgressRecords] = useState<ProgressRecord[]>([]);
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ProgressRecord | null>(null);
  const [newProgressStatus, setNewProgressStatus] = useState('');
  const [newProgressNotes, setNewProgressNotes] = useState('');
  const [newProgressTime, setNewProgressTime] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    agency: 'all',
    search: ''
  });

  useEffect(() => {
    // 載入申請案資料
    const savedApplications = localStorage.getItem('applications');
    if (savedApplications) {
      const apps = JSON.parse(savedApplications);
      setApplications(apps);
      setFilteredApplications(apps);
    } else {
      const initialApplications = [
        {
          id: 1,
          activityName: "青年藝術發展計劃",
          submitDate: "2025-03-15",
          amount: 50000,
          reviewAgency: "文化部",
          lastUpdate: "2025-03-20",
          status: "審核中"
        },
        {
          id: 2,
          activityName: "社區服務計劃",
          submitDate: "2025-03-10",
          amount: 30000,
          reviewAgency: "教育部",
          lastUpdate: "2025-03-18",
          status: "已核准"
        },
      ];
      setApplications(initialApplications);
      setFilteredApplications(initialApplications);
      localStorage.setItem('applications', JSON.stringify(initialApplications));
    }

    // 載入進度記錄
    const savedProgressRecords = localStorage.getItem('progressRecords');
    if (savedProgressRecords) {
      setProgressRecords(JSON.parse(savedProgressRecords));
    }
  }, []);

  // 篩選功能
  useEffect(() => {
    let filtered = applications.filter(app => {
      const matchesStatus = filters.status === 'all' || app.status === filters.status;
      const matchesAgency = filters.agency === 'all' || app.reviewAgency === filters.agency;
      const matchesSearch = !filters.search || 
        app.activityName.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesStatus && matchesAgency && matchesSearch;
    });
    
    setFilteredApplications(filtered);
  }, [applications, filters]);

  const handleDeleteApplication = (id: number) => {
    if (window.confirm("確定要刪除此申請案嗎？")) {
      const updatedApplications = applications.filter(app => app.id !== id);
      setApplications(updatedApplications);
      localStorage.setItem('applications', JSON.stringify(updatedApplications));
      toast.success("申請案已刪除");
    }
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    const updatedApplications = applications.map(app => 
      app.id === id ? { 
        ...app, 
        status: newStatus,
        lastUpdate: new Date().toISOString().split('T')[0]
      } : app
    );
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
    toast.success("狀態已更新");
  };

  const handleAddProgressRecord = () => {
    if (!selectedApplication || !newProgressStatus) {
      toast.error("請選擇申請案並填寫進度狀態");
      return;
    }

    const now = new Date();
    const currentTime = newProgressTime || now.toTimeString().split(' ')[0].substring(0, 5);

    const newRecord: ProgressRecord = {
      id: Date.now(),
      applicationId: selectedApplication.id,
      date: now.toISOString().split('T')[0],
      time: currentTime,
      status: newProgressStatus,
      notes: newProgressNotes,
      updatedBy: "當前用戶"
    };

    const updatedRecords = [...progressRecords, newRecord];
    setProgressRecords(updatedRecords);
    localStorage.setItem('progressRecords', JSON.stringify(updatedRecords));

    handleStatusChange(selectedApplication.id, newProgressStatus);

    setNewProgressStatus('');
    setNewProgressNotes('');
    setNewProgressTime('');
    setIsProgressDialogOpen(false);
    toast.success("進度記錄已新增");
  };

  const handleEditProgressRecord = () => {
    if (!editingRecord) return;

    const updatedRecords = progressRecords.map(record =>
      record.id === editingRecord.id ? editingRecord : record
    );
    
    setProgressRecords(updatedRecords);
    localStorage.setItem('progressRecords', JSON.stringify(updatedRecords));
    
    setIsEditDialogOpen(false);
    setEditingRecord(null);
    toast.success("進度記錄已更新");
  };

  const openEditDialog = (record: ProgressRecord) => {
    setEditingRecord({ ...record });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      '待審核': 'bg-yellow-100 text-yellow-800',
      '審核中': 'bg-blue-100 text-blue-800',
      '補件中': 'bg-orange-100 text-orange-800',
      '已核准': 'bg-green-100 text-green-800',
      '已駁回': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const uniqueAgencies = [...new Set(applications.map(app => app.reviewAgency))];
  const applicationProgressRecords = selectedApplication 
    ? progressRecords.filter(record => record.applicationId === selectedApplication.id)
    : [];

  return (
    <MainLayout>
      <div className="fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">申請進度追蹤</h1>
          <p className="text-muted-foreground mt-1">
            查看您的補助申請案件進度
          </p>
        </div>

        {/* 篩選器 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              篩選條件
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="搜尋活動名稱..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
              <div>
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="所有狀態" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有狀態</SelectItem>
                    <SelectItem value="待審核">待審核</SelectItem>
                    <SelectItem value="審核中">審核中</SelectItem>
                    <SelectItem value="補件中">補件中</SelectItem>
                    <SelectItem value="已核准">已核准</SelectItem>
                    <SelectItem value="已駁回">已駁回</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={filters.agency} onValueChange={(value) => setFilters(prev => ({ ...prev, agency: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="所有機關" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有機關</SelectItem>
                    {uniqueAgencies.map(agency => (
                      <SelectItem key={agency} value={agency}>{agency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({ status: 'all', agency: 'all', search: '' })}
                >
                  清除篩選
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 申請列表 */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">申請案列表</h3>
                  <Dialog open={isProgressDialogOpen} onOpenChange={setIsProgressDialogOpen}>
                    <DialogTrigger asChild>
                      <Button disabled={!selectedApplication}>
                        <Plus className="mr-2 h-4 w-4" />
                        新增進度
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>新增進度記錄</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">申請案</label>
                          <Input 
                            value={selectedApplication?.activityName || ''} 
                            disabled 
                            className="bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">進度狀態</label>
                          <Select value={newProgressStatus} onValueChange={setNewProgressStatus}>
                            <SelectTrigger>
                              <SelectValue placeholder="選擇進度狀態" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="待審核">待審核</SelectItem>
                              <SelectItem value="審核中">審核中</SelectItem>
                              <SelectItem value="補件中">補件中</SelectItem>
                              <SelectItem value="已核准">已核准</SelectItem>
                              <SelectItem value="已駁回">已駁回</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium flex items-center">
                            <Clock className="mr-1 h-4 w-4" />
                            記錄時間
                          </label>
                          <Input
                            type="time"
                            value={newProgressTime}
                            onChange={(e) => setNewProgressTime(e.target.value)}
                            placeholder="選擇時間"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">備註</label>
                          <Textarea
                            value={newProgressNotes}
                            onChange={(e) => setNewProgressNotes(e.target.value)}
                            placeholder="輸入進度備註或說明..."
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsProgressDialogOpen(false)}>
                            取消
                          </Button>
                          <Button onClick={handleAddProgressRecord}>
                            新增記錄
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>活動名稱</TableHead>
                      <TableHead>申請日期</TableHead>
                      <TableHead>申請金額</TableHead>
                      <TableHead>審核機關</TableHead>
                      <TableHead>最後更新</TableHead>
                      <TableHead>進度</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id} className={selectedApplication?.id === app.id ? "bg-muted/50" : ""}>
                        <TableCell className="font-medium">
                          {app.activityName}
                        </TableCell>
                        <TableCell>{app.submitDate}</TableCell>
                        <TableCell>NT$ {app.amount.toLocaleString()}</TableCell>
                        <TableCell>{app.reviewAgency}</TableCell>
                        <TableCell>{app.lastUpdate}</TableCell>
                        <TableCell>
                          <Select
                            value={app.status}
                            onValueChange={(value) => handleStatusChange(app.id, value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="待審核">待審核</SelectItem>
                              <SelectItem value="審核中">審核中</SelectItem>
                              <SelectItem value="補件中">補件中</SelectItem>
                              <SelectItem value="已核准">已核准</SelectItem>
                              <SelectItem value="已駁回">已駁回</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setSelectedApplication(app)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteApplication(app.id)}
                            >
                              <Trash className="h-4 w-4" />
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

          {/* 申請歷史和進度記錄 */}
          <div>
            {selectedApplication ? (
              <div className="space-y-4">
                <ApplicationHistory applicationId={selectedApplication.id.toString()} />
                
                {/* 進度記錄 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      進度記錄
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {applicationProgressRecords.length > 0 ? (
                      <div className="space-y-3">
                        {applicationProgressRecords.map(record => (
                          <div key={record.id} className="border-l-2 border-blue-200 pl-4 pb-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{record.status}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  {record.date} {record.time && `${record.time}`}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => openEditDialog(record)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            {record.notes && (
                              <p className="text-sm text-gray-600 mb-1">{record.notes}</p>
                            )}
                            <p className="text-xs text-muted-foreground">更新者：{record.updatedBy}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground">尚無進度記錄</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>選擇申請案以查看詳細歷史記錄</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 編輯進度記錄對話框 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>編輯進度記錄</DialogTitle>
            </DialogHeader>
            {editingRecord && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">進度狀態</label>
                  <Select 
                    value={editingRecord.status} 
                    onValueChange={(value) => setEditingRecord(prev => prev ? {...prev, status: value} : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="待審核">待審核</SelectItem>
                      <SelectItem value="審核中">審核中</SelectItem>
                      <SelectItem value="補件中">補件中</SelectItem>
                      <SelectItem value="已核准">已核准</SelectItem>
                      <SelectItem value="已駁回">已駁回</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">日期</label>
                  <Input
                    type="date"
                    value={editingRecord.date}
                    onChange={(e) => setEditingRecord(prev => prev ? {...prev, date: e.target.value} : null)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    時間
                  </label>
                  <Input
                    type="time"
                    value={editingRecord.time}
                    onChange={(e) => setEditingRecord(prev => prev ? {...prev, time: e.target.value} : null)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">備註</label>
                  <Textarea
                    value={editingRecord.notes}
                    onChange={(e) => setEditingRecord(prev => prev ? {...prev, notes: e.target.value} : null)}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleEditProgressRecord}>
                    更新記錄
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">共 {filteredApplications.length} 筆申請案</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default ApplicationTracking;
