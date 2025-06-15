
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FolderNode } from "@/hooks/useFolderTree";

interface MoveFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderTree: FolderNode[];
  currentFolderId: string | null;
  onMove: (targetFolderId: string) => void;
}

function FolderTreeRadio({
  nodes,
  selected,
  onSelect
}: {
  nodes: FolderNode[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <ul>
      {nodes.map(node => (
        <li key={node.id} className="mb-1">
          <label className="flex items-center gap-2 pl-2 cursor-pointer">
            <input
              type="radio"
              checked={selected === node.id}
              onChange={() => onSelect(node.id)}
            />
            <span>{node.name}</span>
          </label>
          {node.children && node.children.length > 0 && (
            <div className="ml-4 border-l border-gray-200 pl-3">
              <FolderTreeRadio nodes={node.children} selected={selected} onSelect={onSelect} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

const MoveFileDialog: React.FC<MoveFileDialogProps> = ({
  open,
  onOpenChange,
  folderTree,
  currentFolderId,
  onMove,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(currentFolderId || null);

  React.useEffect(() => {
    setSelectedId(currentFolderId || null);
  }, [currentFolderId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>移動檔案至資料夾</DialogTitle>
          <DialogDescription>
            請選擇一個要移動此檔案到的目標資料夾
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-72 overflow-auto my-2">
          <FolderTreeRadio
            nodes={folderTree}
            selected={selectedId}
            onSelect={setSelectedId}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={() => {
              if (selectedId && selectedId !== currentFolderId) {
                onMove(selectedId);
                onOpenChange(false);
              }
            }}
            disabled={!selectedId || selectedId === currentFolderId}
          >
            移動
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveFileDialog;
