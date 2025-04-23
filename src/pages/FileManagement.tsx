
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MainLayout from "@/components/layout/MainLayout";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { File, Folder, Upload, Plus, X } from "lucide-react";

// 模擬文件數據
const mockFolders = [
  { id: 1, name: "申請表格範本", created: "2025-03-01", fileCount: 5 },
  { id: 2, name: "活動相關文件", created: "2025-03-15", fileCount: 3 },
  { id: 3, name: "宣傳資料", created: "2025-03-20", fileCount: 7 }
];

const mockFiles = [
  { id: 1, name: "文化部藝術補助申請表.docx", type: "docx", size: "245 KB", uploaded: "2025-03-05", folder: "申請表格範本" },
  { id: 2, name: "經費核銷表.xlsx", type: "xlsx", size: "120 KB", uploaded: "2025-03-10", folder: "申請表格範本" },
  { id: 3, name: "活動場地規劃.pdf", type: "pdf", size: "1.2 MB", uploaded: "2025-03-18", folder: "活動相關文件" },
  { id: 4, name: "宣傳海報範例.jpg", type: "jpg", size: "3.5 MB", uploaded: "2025-03-22", folder: "宣傳資料" }
];

const FileManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [folders, setFolders] = useState(mockFolders);
  const [files, setFiles] = useState(mockFiles);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("全部");
  
  // 過濾文件
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === "全部" || file.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });
  
  // 處理文件選擇
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // 處理文件上傳
  const handleFileUpload = () => {
    if (selectedFile) {
      const newFile = {
        id: Date.now(),
        name: selectedFile.name,
        type: selectedFile.name.split('.').pop() || "unknown",
        size: `${(selectedFile.size / 1024).toFixed(0)} KB`,
        uploaded: new Date().toISOString().split('T')[0],
        folder: selectedFolder === "全部" ? "未分類" : selectedFolder
      };
      
      setFiles([...files, newFile]);
      toast.success(`成功上傳檔案: ${selectedFile.name}`);
      setUploadDialogOpen(false);
      setSelectedFile(null);
    } else {
      toast.error("請先選擇檔案");
    }
  };
  
  // 處理新增資料夾
  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now(),
        name: newFolderName.trim(),
        created: new Date().toISOString().split('T')[0],
        fileCount: 0
      };
      
      setFolders([...folders, newFolder]);
      toast.success(`已新增資料夾: ${newFolderName}`);
      setFolderDialogOpen(false);
      setNewFolderName("");
    } else {
      toast.error("資料夾名稱不能為空");
    }
  };
  
  // 處理刪除文件
  const handleDeleteFile = (id: number) => {
    setFiles(files.filter(file => file.id !== id));
    toast.success("已刪除檔案");
  };
  
  return (
    <MainLayout>
      <div className="fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">附件與檔案</h1>
            <p className="text-muted-foreground mt-1">管理系統中的各類文件和檔案</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setFolderDialogOpen(true)}>
              <Folder className="mr-1 h-4 w-4" />
              新增資料夾
            </Button>
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Upload className="mr-1 h-4 w-4" />
              上傳檔案
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* 左側資料夾列表 */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">資料夾</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 p-2">
                <Button 
                  variant={selectedFolder === "全部" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedFolder("全部")}
                >
                  <Folder className="mr-2 h-4 w-4" />
                  全部檔案
                </Button>
                {folders.map(folder => (
                  <Button
                    key={folder.id}
                    variant={selectedFolder === folder.name ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedFolder(folder.name)}
                  >
                    <Folder className="mr-2 h-4 w-4" />
                    {folder.name}
                    <span className="ml-auto text-xs text-muted-foreground">{folder.fileCount}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* 右側檔案列表 */}
          <Card className="md:col-span-3">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">檔案列表</CardTitle>
                <div className="relative w-64">
                  <Input
                    placeholder="搜尋檔案..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="px-6">
                  <TabsList className="w-full justify-start border-b rounded-none">
                    <TabsTrigger value="all">全部</TabsTrigger>
                    <TabsTrigger value="docs">文件</TabsTrigger>
                    <TabsTrigger value="images">圖片</TabsTrigger>
                    <TabsTrigger value="others">其他</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="all" className="m-0">
                  {filteredFiles.length > 0 ? (
                    <div className="divide-y">
                      {filteredFiles.map(file => (
                        <div key={file.id} className="flex items-center p-4 hover:bg-muted/50">
                          <div className="mr-4">
                            <File className="h-8 w-8 text-blue-500" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{file.name}</p>
                            <div className="flex text-xs text-muted-foreground mt-1">
                              <span className="mr-3">{file.size}</span>
                              <span className="mr-3">上傳於: {file.uploaded}</span>
                              <span>資料夾: {file.folder}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteFile(file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <File className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">沒有找到檔案</h3>
                      <p className="text-sm text-muted-foreground">
                        上傳新檔案或嘗試其他搜索條件
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="docs" className="m-0 py-4 px-6">
                  <div className="text-center p-8">
                    <p>文件分類檢視</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="images" className="m-0 py-4 px-6">
                  <div className="text-center p-8">
                    <p>圖片分類檢視</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="others" className="m-0 py-4 px-6">
                  <div className="text-center p-8">
                    <p>其他檔案分類檢視</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* 上傳對話框 */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>上傳檔案</DialogTitle>
              <DialogDescription>
                選擇要上傳的檔案並指定資料夾
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="folder-select" className="text-sm font-medium">
                  選擇資料夾
                </label>
                <select
                  id="folder-select"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                >
                  <option value="未分類">未分類</option>
                  {folders.map(folder => (
                    <option key={folder.id} value={folder.name}>{folder.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="file-upload" className="text-sm font-medium">
                  選擇檔案
                </label>
                <Input 
                  id="file-upload" 
                  type="file" 
                  onChange={handleFileChange} 
                />
              </div>
              
              {selectedFile && (
                <div className="text-sm p-2 bg-muted rounded-md">
                  已選擇: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
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
        
        {/* 新增資料夾對話框 */}
        <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新增資料夾</DialogTitle>
              <DialogDescription>
                建立新資料夾以組織您的檔案
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-2">
              <label htmlFor="folder-name" className="text-sm font-medium">
                資料夾名稱
              </label>
              <Input 
                id="folder-name" 
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="輸入資料夾名稱"
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setFolderDialogOpen(false)}>取消</Button>
              <Button onClick={handleAddFolder}>建立</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default FileManagement;
