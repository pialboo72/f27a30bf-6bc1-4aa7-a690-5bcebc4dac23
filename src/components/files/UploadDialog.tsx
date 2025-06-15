
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: { id: number; name: string }[];
  selectedFolder: string;
  setSelectedFolder: (folder: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileUpload: () => void;
  fileConversions: { [key: string]: string[] };
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const UploadDialog: React.FC<UploadDialogProps> = ({
  open,
  onOpenChange,
  folders,
  selectedFolder,
  setSelectedFolder,
  selectedFile,
  setSelectedFile,
  handleFileChange,
  handleFileUpload,
  fileConversions
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              <p className="mb-1">已選擇: {selectedFile.name} ({formatFileSize(selectedFile.size)})</p>
              <p className="text-xs text-muted-foreground">
                {selectedFile.name.split('.').pop() && (selectedFile.name.split('.').pop() as string) in fileConversions ?
                  `此檔案格式將自動轉換為相容的其他格式 (${fileConversions[selectedFile.name.split('.').pop() as string].join(', ')})` :
                  '此檔案格式不支援自動轉換'
                }
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={handleFileUpload} disabled={!selectedFile}>
            上傳
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
