import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useFileManagementState } from "@/hooks/useFileManagementState";
import FolderSidebar from "@/components/files/FolderSidebar";
import FileList from "@/components/files/FileList";
import UploadDialog from "@/components/files/UploadDialog";
import AddFolderDialog from "@/components/files/AddFolderDialog";
import FolderSelectDialog from "@/components/files/FolderSelectDialog";
import DeleteFileConfirmDialog from "@/components/files/DeleteFileConfirmDialog";
import { Button } from "@/components/ui/button";
import { Folder, Upload } from "lucide-react";

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
  const state = useFileManagementState();

  return (
    <MainLayout>
      <div className="fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">附件與檔案</h1>
            <p className="text-muted-foreground mt-1">管理系統中的各類文件和檔案</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => state.setFolderDialogOpen(true)}>
              <Folder className="mr-1 h-4 w-4" />
              新增資料夾
            </Button>
            <Button onClick={() => state.setUploadDialogOpen(true)}>
              <Upload className="mr-1 h-4 w-4" />
              上傳檔案
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <FolderSidebar
            folders={state.folderList}
            selectedFolder={state.selectedFolder}
            setSelectedFolder={state.setSelectedFolder}
          />
          {/* File List */}
          <FileList
            files={state.filesWithUploadDate}
            filteredFiles={state.filteredFilesWithUploadDate}
            activeTab={state.activeTab}
            setActiveTab={state.setActiveTab}
            searchTerm={state.searchTerm}
            setSearchTerm={state.setSearchTerm}
            handleAskDeleteFile={state.handleAskDeleteFile}
            handleOpenFolderSelect={state.handleOpenFolderSelect}
            downloadFile={state.downloadFile}
            folders={state.folders}
          />
        </div>
        
        {/* Dialogs */}
        <UploadDialog
          open={state.uploadDialogOpen}
          onOpenChange={state.setUploadDialogOpen}
          folders={state.folders}
          selectedFolder={state.selectedFolder}
          setSelectedFolder={state.setSelectedFolder}
          selectedFile={state.selectedFile}
          setSelectedFile={state.setSelectedFile}
          handleFileChange={state.handleFileChange}
          handleFileUpload={state.handleFileUpload}
          fileConversions={state.fileConversions}
        />
        <AddFolderDialog
          open={state.folderDialogOpen}
          onOpenChange={state.setFolderDialogOpen}
          newFolderName={state.newFolderName}
          setNewFolderName={state.setNewFolderName}
          handleAddFolder={state.handleAddFolder}
        />
        <FolderSelectDialog
          open={state.folderSelectDialogOpen}
          onOpenChange={state.setFolderSelectDialogOpen}
          folders={state.folders}
          fileInProcess={state.fileInProcess}
          selectedFolders={state.selectedFolders}
          toggleFolderSelection={state.toggleFolderSelection}
          saveFileFolders={state.saveFileFolders}
        />
        <DeleteFileConfirmDialog
          open={state.deleteDialogOpen}
          onOpenChange={(open) => {
            state.setDeleteDialogOpen(open);
            if (!open) state.setDeleteTargetFile(null);
          }}
          onConfirm={state.handleConfirmDeleteFile}
          fileName={state.deleteTargetFile?.name}
        />
      </div>
    </MainLayout>
  );
};

export default FileManagement;
