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
import DeleteFileConfirmDialog from "@/components/files/DeleteFileConfirmDialog";
import FolderSidebar from "@/components/files/FolderSidebar";
import FileList from "@/components/files/FileList";
import UploadDialog from "@/components/files/UploadDialog";
import AddFolderDialog from "@/components/files/AddFolderDialog";
import FolderSelectDialog from "@/components/files/FolderSelectDialog";

// 模擬文件數據
const mockFolders = [
  { id: 1, name: "申請表格範本", created: "2025-03-01", fileCount: 5 },
  { id: 2, name: "活動相關文件", created: "2025-03-15", fileCount: 3 },
  { id: 3, name: "宣傳資料", created: "2025-03-20", fileCount: 7 }
];

// 檔案大小格式化函數
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetFile, setDeleteTargetFile] = useState<null | { id: number, name: string }>(null);
  
  useEffect(() => {
    setSystemFiles(files as any);
  }, []);
  
  // Calculate file count for folders for sidebar rendering
  const folderList = folders.map(folder => ({
    ...folder,
    fileCount: files.filter(file => file.folders.includes(folder.name)).length
  }));
  
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
      
      const filesToUpload = [
        {
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
        }
      ];

      if (supportsConversion) {
        fileConversions[fileType]?.forEach((format, index) => {
          if (format !== fileType) {
            filesToUpload.push({
              id: Date.now() + index + 1,
              name: fileName,
              path: `/files/${fileName.toLowerCase().replace(/\s+/g, '-')}.${format}`,
              tags: [{ id: Date.now() + index + 1, name: selectedFolder === "全部" ? "未分類" : selectedFolder }],
              type: getMimeType(format),
              size: selectedFile.size,
              uploadDate: new Date().toISOString().split('T')[0],
              originalType: format,
              uploaded: new Date().toISOString().split('T')[0],
              folders: selectedFolder === "全部" ? ["未分類"] : [selectedFolder],
              availableFormats: [format]
            });
          }
        });
      }
      
      const updatedFiles = [...files, ...filesToUpload as any];
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
  
  const handleAskDeleteFile = (id: number, name: string) => {
    setDeleteTargetFile({ id, name });
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDeleteFile = () => {
    if (deleteTargetFile) {
      const updatedFiles = files.filter(file => file.id !== deleteTargetFile.id);
      setFiles(updatedFiles);
      setSystemFiles(updatedFiles);
      toast.success("已刪除檔案");
    }
    setDeleteDialogOpen(false);
    setDeleteTargetFile(null);
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
          {/* Sidebar */}
          <FolderSidebar
            folders={folderList}
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
          />
          {/* File List */}
          <FileList
            files={files}
            filteredFiles={filteredFiles}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleAskDeleteFile={handleAskDeleteFile}
            handleOpenFolderSelect={handleOpenFolderSelect}
            downloadFile={downloadFile}
            folders={folders}
          />
        </div>
        
        {/* Dialogs */}
        <UploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          folders={folders}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          handleFileChange={handleFileChange}
          handleFileUpload={handleFileUpload}
          fileConversions={fileConversions}
        />
        <AddFolderDialog
          open={folderDialogOpen}
          onOpenChange={setFolderDialogOpen}
          newFolderName={newFolderName}
          setNewFolderName={setNewFolderName}
          handleAddFolder={handleAddFolder}
        />
        <FolderSelectDialog
          open={folderSelectDialogOpen}
          onOpenChange={setFolderSelectDialogOpen}
          folders={folders}
          fileInProcess={fileInProcess}
          selectedFolders={selectedFolders}
          toggleFolderSelection={toggleFolderSelection}
          saveFileFolders={saveFileFolders}
        />
        <DeleteFileConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={(open) => {
            setDeleteDialogOpen(open);
            if (!open) setDeleteTargetFile(null);
          }}
          onConfirm={handleConfirmDeleteFile}
          fileName={deleteTargetFile?.name}
        />
      </div>
    </MainLayout>
  );
};

export default FileManagement;
