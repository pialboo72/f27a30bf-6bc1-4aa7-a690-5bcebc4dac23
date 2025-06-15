
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteFileConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  fileName?: string;
}

const DeleteFileConfirmDialog: React.FC<DeleteFileConfirmDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  fileName,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>確定刪除檔案？</DialogTitle>
          <DialogDescription>
            {fileName ? (
              <>您將刪除 <b>{fileName}</b>，此操作無法復原。確定要刪除嗎？</>
            ) : (
              <>確定要刪除此檔案？此操作無法復原。</>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            確認刪除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFileConfirmDialog;
