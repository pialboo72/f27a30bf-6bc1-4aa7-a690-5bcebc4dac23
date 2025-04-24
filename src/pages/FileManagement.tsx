import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { File, Folder, Upload, Plus, X, FileText, Download, CheckSquare } from "lucide-react";
import { useFiles } from '@/contexts/FileContext';
import { SystemFile, FileTag } from '@/types/program';

// 模擬文件數據
const mockFolders = [
  { id: 1, name: "申請表格範本", created: "2025-03-01", fileCount: 5 },
  { id: 2, name: "活動相關文件", created: "2025-03-15", fileCount: 3 },
  { id: 3, name: "宣傳資料", created: "2025-03-20", fileCount: 7 }
];

// 將模擬檔案調整為符合 SystemFile 接口
const mockFiles = [
  { 
    id: 1, 
    name: "文化部藝術補助申請表", 
    path: "/files/application-form.docx",
    tags: [{ id: 1, name: "申請表格" }],
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 245000, // Convert KB to bytes
    uploadDate: "2025-03-05",
    originalType: "docx", 
    uploaded: "2025-03-05", 
    folders: ["申請表格範本"],
    availableFormats: ["docx", "odt", "pdf"]
  },
  { 
    id: 2, 
    name: "經費核銷表", 
    path: "/files/expense-form.xlsx",
    tags: [{ id: 2, name: "財務" }],
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 120000,
    uploadDate: "2025-03-10",
    originalType: "xlsx", 
    uploaded: "2025-03-10", 
    folders: ["申請表格範本"],
    availableFormats: ["xlsx", "ods", "pdf"]
  },
  { 
    id: 3, 
    name: "活動場地規劃", 
    path: "/files/venue-plan.pdf",
    tags: [{ id: 3, name: "活動" }],
    type: "application/pdf",
    size: 1200000,
    uploadDate: "2025-03-18",
    originalType: "pdf", 
    uploaded: "2025-03-18", 
    folders: ["活動相關文件", "宣傳資料"],
    availableFormats: ["pdf"]
  },
  { 
    id: 4, 
    name: "宣傳海報範例", 
    path: "/files/poster-sample.jpg",
    tags: [{ id: 4, name: "宣傳" }],
    type: "image/jpeg",
    size: 3500000,
    uploadDate: "2025-03-22",
    originalType: "jpg", 
    uploaded: "2025-03-22", 
    folders: ["宣傳資料"],
    availableFormats: ["jpg", "png", "pdf"]
  }
];

// 檔案類型對應圖示顏色
const fileTypeColors: {[key: string]: string} = {
  docx: "text-blue-500",
  xlsx: "text-green-500",
  pdf: "text-red-500",
  jpg: "text-purple-500",
  png: "text-yellow-500",
  odt: "text-blue-400",
  ods: "text-green-400",
};

// 檔案格式轉換對照
const fileConversions: {[key: string]: string[]} = {
  docx: ["docx", "odt", "pdf"],
  odt: ["odt", "docx", "pdf"],
  xlsx: ["xlsx", "ods", "pdf"],
  ods: ["ods", "xlsx", "pdf"],
};

const FileManagement: React.FC = () => {
  const { setSystemFiles } = useFiles();
  const [activeTab, setActiveTab] = useState("all");
  const [folders, setFolders] = useState(mockFolders);
  const [files, setFiles] = useState<Array<SystemFile & {
    originalType: string;
    size: string;
    uploaded: string;
    folders: string[];
    availableFormats: string[];
  }>>(mockFiles as any);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [folderSelectDialogOpen, setFolderSelectDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("全部");
  const [fileInProcess, setFileInProcess] = useState<any | null>(null);
  const [selectedFolders, setSelectedFolders] = useState<{[key: string]: boolean}>({});
  
  useEffect(() => {
    setSystemFiles(files as any);
  }, []);
  
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === "全部" || file.folders.includes(selectedFolder);
    return matchesSearch && matchesFolder;
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleFileUpload = () => {
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop() || "unknown";
      const fileName = selectedFile.name.split('.')[0];
      
      const supportsConversion = fileType in fileConversions;
      
      const newFile = {
        id: Date.now(),
        name: fileName,
        path: `/files/${fileName.toLowerCase().replace(/\s+/g, '-')}.${fileType}`,
        tags: [{ id: Date.now(), name: selectedFolder === "全部" ? "未分類" : selectedFolder }],
        type: getMimeType(fileType),
        size: selectedFile.size,
        uploadDate: new Date().toISOString().split('T')[0],
        originalType: fileType,
        uploaded: new Date().toISOString().split('T')[0],
        folders: selectedFolder === "全部" ? ["未分類"] : [selectedFolder],
        availableFormats: supportsConversion ? fileConversions[fileType] : [fileType]
      };
      
      const updatedFiles = [...files, newFile as any];
      setFiles(updatedFiles);
      setSystemFiles(updatedFiles as any);
      
      let successMessage = `成功上傳檔案: ${fileName}.${fileType}`;
      if (supportsConversion) {
        successMessage += `\n並自動轉換為 ${fileConversions[fileType].filter(f => f !== fileType).join(', ')} 格式`;
      }
      
      toast.success(successMessage);
      setUploadDialogOpen(false);
      setSelectedFile(null);
    } else {
      toast.error("請先選擇檔案");
    }
  };
  
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
  
  const handleDeleteFile = (id: number) => {
    const updatedFiles = files.filter(file => file.id !== id);
    setFiles(updatedFiles);
    setSystemFiles(updatedFiles);
    toast.success("已刪除檔案");
  };
  
  const handleOpenFolderSelect = (file: any) => {
    setFileInProcess(file);
    
    const initialSelection: {[key: string]: boolean} = {};
    folders.forEach(folder => {
      initialSelection[folder.name] = file.folders.includes(folder.name);
    });
    setSelectedFolders(initialSelection);
    
    setFolderSelectDialogOpen(true);
  };
  
  const toggleFolderSelection = (folderName: string) => {
    setSelectedFolders({
      ...selectedFolders,
      [folderName]: !selectedFolders[folderName]
    });
  };
  
  const saveFileFolders = () => {
    if (!fileInProcess) return;
    
    const selectedFolderNames = Object.keys(selectedFolders).filter(
      folderName => selectedFolders[folderName]
    );
    
    if (selectedFolderNames.length === 0) {
      selectedFolderNames.push("未分類");
    }
    
    const updatedFiles = files.map(file => {
      if (file.id === fileInProcess.id) {
        return {
          ...file,
          folders: selectedFolderNames,
          tags: [...file.tags, ...selectedFolderNames.map((name, index) => ({
            id: file.id * 100 + index,
            name
          }))].slice(0, selectedFolderNames.length)
        };
      }
      return file;
    });
    
    setFiles(updatedFiles);
    setSystemFiles(updatedFiles);
    setFolderSelectDialogOpen(false);
    setFileInProcess(null);
    toast.success("檔案資料夾已更新");
  };
  
  const downloadFile = (fileName: string, fileType: string) => {
    toast.success(`開始下載 ${fileName}.${fileType}`);
  };
  
  const getMimeType = (extension: string): string => {
    const mimeTypes: {[key: string]: string} = {
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      odt: "application/vnd.oasis.opendocument.text",
      ods: "application/vnd.oasis.opendocument.spreadsheet",
      txt: "text/plain"
    };
    return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
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
                    <span className="ml-auto text-xs text-muted-foreground">
                      {files.filter(file => file.folders.includes(folder.name)).length}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
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
                        <div key={file.id} className="p-4 hover:bg-muted/50">
                          <div className="flex items-center mb-2">
                            <div className="mr-4">
                              <File className={`h-8 w-8 ${fileTypeColors[file.originalType] || "text-gray-500"}`} />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{file.name}</p>
                              <div className="flex flex-wrap text-xs text-muted-foreground mt-1">
                                <span className="mr-3">大小: {file.size}</span>
                                <span className="mr-3">上傳於: {file.uploaded}</span>
                                <span className="mr-3">原始格式: {file.originalType}</span>
                                <span 
                                  className="cursor-pointer text-primary"
                                  onClick={() => handleOpenFolderSelect(file)}
                                >
                                  資料夾: {file.folders.join(", ")}
                                </span>
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
                          
                          <div className="mt-3 flex flex-wrap gap-2">
                            {file.availableFormats.map(format => (
                              <Button 
                                key={format} 
                                variant="outline" 
                                size="sm"
                                className="flex items-center"
                                onClick={() => downloadFile(file.name, format)}
                              >
                                <Download className="mr-1 h-4 w-4" />
                                <span>下載 {format.toUpperCase()}</span>
                              </Button>
                            ))}
                          </div>
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
        
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>上傳檔案</DialogTitle>
              <DialogDescription>
                選擇要上傳的檔案並指定資料夾，系統將自動轉換支援的格式
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
                <div className="text-sm p-3 bg-muted rounded-md">
                  <p className="mb-1">已選擇: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedFile.name.split('.').pop() in fileConversions ? 
                      `此檔案格式將自動轉���為相容的其他格式 (${fileConversions[selectedFile.name.split('.').pop() || ""].join(', ')})` : 
                      '此檔案格式不支援自動轉換'
                    }
                  </p>
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
        
        <Dialog open={folderSelectDialogOpen} onOpenChange={setFolderSelectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>選擇檔案資料夾</DialogTitle>
              <DialogDescription>
                檔案可以同時存在於多個資料夾中
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <p className="text-sm font-medium">檔案: {fileInProcess?.name}</p>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {folders.map(folder => (
                  <div key={folder.id} className="flex items-center space-x-2">
                    <Button
                      variant={selectedFolders[folder.name] ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => toggleFolderSelection(folder.name)}
                    >
                      {selectedFolders[folder.name] && <CheckSquare className="mr-2 h-4 w-4" />}
                      {!selectedFolders[folder.name] && <Folder className="mr-2 h-4 w-4" />}
                      {folder.name}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setFolderSelectDialogOpen(false)}>取消</Button>
              <Button onClick={saveFileFolders}>儲存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default FileManagement;
