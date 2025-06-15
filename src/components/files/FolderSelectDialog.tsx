
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckSquare, Folder } from "lucide-react";

interface Folder {
  id: number;
  name: string;
}

interface FolderSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: Folder[];
  fileInProcess: any;
  selectedFolders: { [key: string]: boolean };
  toggleFolderSelection: (folderName: string) => void;
  saveFileFolders: () => void;
}

const FolderSelectDialog: React.FC<FolderSelectDialogProps> = ({
  open,
  onOpenChange,
  folders,
  fileInProcess,
  selectedFolders,
  toggleFolderSelection,
  saveFileFolders
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
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
          {folders.map((folder) => (
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
        <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
        <Button onClick={saveFileFolders}>儲存</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default FolderSelectDialog;
