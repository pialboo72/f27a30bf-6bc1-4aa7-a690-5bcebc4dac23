
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Edit, Copy, Upload, Check, X } from "lucide-react";

// 模擬補助計劃數據
const mockPrograms = [
  {
    id: 1,
    title: "文化部藝術發展補助",
    organization: "文化部",
    description: "支持國內藝術工作者及團體發展創作，提升文化藝術水準，促進藝文產業良性發展。",
    deadline: "2025/05/20",
    category: "文化藝術",
    tags: ["展演活動", "藝術創作", "人才培育"],
    maxAmount: 500000,
    status: "active"
  },
  {
    id: 2,
    title: "體育署全民運動補助",
    organization: "體育署",
    description: "促進全民運動參與，提升國民體適能，推廣各類運動項目，建構健康活力社會。",
    deadline: "2025/06/15",
    category: "體育",
    tags: ["運動賽事", "場地設備", "教練培訓"],
    maxAmount: 300000,
    status: "active"
  },
  {
    id: 3,
    title: "教育部學生社團活動補助",
    organization: "教育部",
    description: "鼓勵大專院校學生參與社團活動，發展多元能力，提升自主學習與公民參與素養。",
    deadline: "2025/07/01",
    category: "教育",
    tags: ["學生社團", "校園活動", "服務學習"],
    maxAmount: 150000,
    status: "draft"
  }
];

// 分類選項
const categories = ["文化藝術", "體育", "教育", "健康照護", "環境教育"];

const ProgramManagement = () => {
  const [programs, setPrograms] = useState(mockPrograms);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any>(null);
  const [deletingProgramId, setDeletingProgramId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("details");

  // 表單數據
  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    organization: "",
    description: "",
    deadline: "",
    category: "文化藝術",
    maxAmount: 0,
    tags: "",
    status: "draft"
  });

  // 附件上傳
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingProgramId, setUploadingProgramId] = useState<number | null>(null);

  // 處理輸入變更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "maxAmount" ? parseInt(value) || 0 : value
    });
  };

  // 打開新增對話框
  const handleAddNew = () => {
    setFormData({
      id: Date.now(),
      title: "",
      organization: "",
      description: "",
      deadline: "",
      category: "文化藝術",
      maxAmount: 0,
      tags: "",
      status: "draft"
    });
    setEditingProgram(null);
    setActiveTab("details");
    setDialogOpen(true);
  };

  // 打開編輯對話框
  const handleEdit = (program: any) => {
    setFormData({
      ...program,
      tags: program.tags.join(", ")
    });
    setEditingProgram(program);
    setActiveTab("details");
    setDialogOpen(true);
  };

  // 處理複製
  const handleCopy = (program: any) => {
    const newProgram = {
      ...program,
      id: Date.now(),
      title: `${program.title} (複製)`,
      status: "draft"
    };
    
    setPrograms([...programs, newProgram]);
    toast.success("成功複製補助計劃");
  };

  // 打開刪除對話框
  const handleDeleteConfirm = (id: number) => {
    setDeletingProgramId(id);
    setDeleteDialogOpen(true);
  };
  
  // 處理刪除
  const handleDelete = () => {
    if (deletingProgramId) {
      setPrograms(programs.filter(program => program.id !== deletingProgramId));
      setDeleteDialogOpen(false);
      setDeletingProgramId(null);
      toast.success("成功刪除補助計劃");
    }
  };

  // 處理保存
  const handleSave = () => {
    const formattedData = {
      ...formData,
      tags: formData.tags.split(",").map(tag => tag.trim())
    };

    if (editingProgram) {
      setPrograms(programs.map(prog => 
        prog.id === formattedData.id ? formattedData : prog
      ));
      toast.success("成功更新補助計劃");
    } else {
      setPrograms([...programs, formattedData]);
      toast.success("成功新增補助計劃");
    }
    
    setDialogOpen(false);
  };

  // 處理文件選擇
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 開啟上傳對話框
  const handleOpenUpload = (programId: number) => {
    setUploadingProgramId(programId);
    setSelectedFile(null);
    setUploadDialogOpen(true);
  };

  // 處理文件上傳
  const handleFileUpload = () => {
    if (selectedFile) {
      toast.success(`成功上傳檔案: ${selectedFile.name}`);
      setUploadDialogOpen(false);
      setSelectedFile(null);
    } else {
      toast.error("請先選擇檔案");
    }
  };

  return (
    <MainLayout>
      <div className="fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">補助計劃管理</h1>
            <p className="text-muted-foreground mt-1">管理所有補助計劃</p>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-1 h-4 w-4" />
            新增計劃
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>計劃名稱</TableHead>
                  <TableHead>機構</TableHead>
                  <TableHead>類別</TableHead>
                  <TableHead>截止日期</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.title}</TableCell>
                    <TableCell>{program.organization}</TableCell>
                    <TableCell>{program.category}</TableCell>
                    <TableCell>{program.deadline}</TableCell>
                    <TableCell>
                      <Badge variant={program.status === "active" ? "default" : "outline"}>
                        {program.status === "active" ? "已發布" : "草稿"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenUpload(program.id)}>
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(program)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleCopy(program)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteConfirm(program.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 新增/編輯對話框 */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingProgram ? "編輯補助計劃" : "新增補助計劃"}</DialogTitle>
              <DialogDescription>
                {editingProgram ? "更新補助計劃的詳細資料" : "填寫新補助計劃的詳細資料"}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">基本資料</TabsTrigger>
                <TabsTrigger value="advanced">進階設定</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">計劃名稱</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">主辦單位</Label>
                    <Input id="organization" name="organization" value={formData.organization} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">計劃說明</Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deadline">截止日期</Label>
                    <Input id="deadline" name="deadline" type="text" placeholder="YYYY/MM/DD" value={formData.deadline} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">類別</Label>
                    <select
                      id="category"
                      name="category"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxAmount">最高補助金額</Label>
                    <Input id="maxAmount" name="maxAmount" type="number" value={formData.maxAmount} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">狀態</Label>
                    <select
                      id="status"
                      name="status"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="draft">草稿</option>
                      <option value="active">已發布</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">標籤 (以逗號分隔)</Label>
                  <Input id="tags" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="例如: 藝術創作, 展演活動" />
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
              <Button onClick={handleSave}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 刪除確認對話框 */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>確認刪除</DialogTitle>
              <DialogDescription>
                您確定要刪除這個補助計劃嗎？此操作無法撤銷。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>取消</Button>
              <Button variant="destructive" onClick={handleDelete}>確認刪除</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 上傳對話框 */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>上傳申請表格</DialogTitle>
              <DialogDescription>
                上傳此補助計劃的申請表格檔案
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload">選擇檔案</Label>
                <Input 
                  id="file-upload" 
                  type="file" 
                  accept=".doc,.docx,.odt,.pdf"
                  onChange={handleFileChange} 
                />
                <p className="text-xs text-muted-foreground">
                  允許的檔案類型: .doc, .docx, .odt, .pdf
                </p>
              </div>
              
              {selectedFile && (
                <div className="text-sm p-2 bg-muted rounded-md">
                  已選擇: {selectedFile.name}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>取消</Button>
              <Button onClick={handleFileUpload} disabled={!selectedFile}>
                上傳
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default ProgramManagement;
