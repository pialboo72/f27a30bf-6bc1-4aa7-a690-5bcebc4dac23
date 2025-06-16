
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useFileManagementState } from "@/hooks/useFileManagementState";
import FolderSidebar from "@/components/files/FolderSidebar";
import FileList from "@/components/files/FileList";
import StorageUsage from "@/components/files/StorageUsage";
import UploadDialog from "@/components/files/UploadDialog";
import AddFolderDialog from "@/components/files/AddFolderDialog";
import FolderSelectDialog from "@/components/files/FolderSelectDialog";
import DeleteFileConfirmDialog from "@/components/files/DeleteFileConfirmDialog";
import { Button } from "@/components/ui/button";
import { Folder, Upload } from "lucide-react";

const FileManagement: React.FC = () => {
  const state = useFileManagementState();

  // 計算當前使用的儲存空間
  const totalUsedStorage = Math.round(
    state.filesWithUploadDate.reduce((total, file) => total + (file.size || 0), 0) / (1024 * 1024)
  );
  const maxStorage = 1000; // 預設 1GB，應該從後台設定讀取
  const fileCount = state.filesWithUploadDate.length;

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

        <StorageUsage 
          usedStorage={totalUsedStorage}
          maxStorage={maxStorage}
          fileCount={fileCount}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FolderSidebar
            folders={state.folderList}
            selectedFolder={state.selectedFolder}
            setSelectedFolder={state.setSelectedFolder}
          />
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
