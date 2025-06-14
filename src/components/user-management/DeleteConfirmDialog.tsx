
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  isDeleting: boolean;
  setIsDeleting: (deleting: boolean) => void;
  deleteTarget: { type: 'unit' | 'user'; id: number } | null;
  handleDelete: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isDeleting,
  setIsDeleting,
  deleteTarget,
  handleDelete
}) => {
  return (
    <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>確認刪除</DialogTitle>
          <DialogDescription>
            您確定要刪除此{deleteTarget?.type === 'unit' ? '單位' : '用戶'}嗎？此操作無法撤銷。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDeleting(false)}>
            取消
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            確認刪除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
