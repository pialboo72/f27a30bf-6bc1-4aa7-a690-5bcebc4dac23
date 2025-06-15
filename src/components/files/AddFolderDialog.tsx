
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newFolderName: string;
  setNewFolderName: (name: string) => void;
  handleAddFolder: () => void;
}

const AddFolderDialog: React.FC<AddFolderDialogProps> = ({
  open,
  onOpenChange,
  newFolderName,
  setNewFolderName,
  handleAddFolder
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={handleAddFolder}>建立</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFolderDialog;
