
import React, { useState } from "react";
import { FileText, Download, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SystemFile } from "@/types/program";
import DeleteFileConfirmDialog from "@/components/files/DeleteFileConfirmDialog";

interface FolderTreeFileProps {
  file: SystemFile;
  selectedFile: SystemFile | null;
  onSelectFile: (file: SystemFile) => void;
  onDeleteFile: (file: SystemFile) => void;
  expanded: Record<string, boolean>;
  setDragFileId: (id: number | null) => void;
  dragFileId: number | null;
  onMoveFile: (fileId: number, toFolderId: string) => void;
}

const FolderTreeFile: React.FC<FolderTreeFileProps> = ({
  file,
  selectedFile,
  onSelectFile,
  onDeleteFile,
  expanded,
  setDragFileId,
  dragFileId,
}) => {
  const [showTag, setShowTag] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // 處理「檔案拖曳」事件
  const handleDragStart = (e: React.DragEvent, fileId: number) => {
    setDragFileId(fileId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(fileId));
  };

  // 標記正被拖曳的檔案外觀
  const isDragging = dragFileId === file.id;

  return (
    <>
      <div
        className={`border rounded p-2 mt-1 flex items-center justify-between cursor-pointer ml-8 group
          ${selectedFile?.id === file.id ? "border-primary bg-primary/10" : "border-gray-200 bg-white"}
          ${isDragging ? "opacity-60 border-dashed border-2 border-primary" : ""}
        `}
        onClick={() => onSelectFile(file)}
        draggable
        onDragStart={e => handleDragStart(e, file.id)}
        onDragEnd={() => setDragFileId(null)}
      >
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span>{file.name}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={e => {
              e.stopPropagation();
              setShowTag(!showTag);
            }}
            aria-label="查看"
          >
            <Eye className="w-4 h-4 text-blue-700" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={e => {
              e.stopPropagation();
              // 呼叫下載
              const ext = file.name.split(".").pop() || "docx";
              const downloadName = `${file.name}.${ext}`;
              const link = document.createElement("a");
              link.href = file.path;
              link.download = downloadName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            aria-label="下載"
          >
            <Download className="w-4 h-4 text-green-700" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={e => {
              e.stopPropagation();
              setDeleteDialog(true);
            }}
            aria-label="刪除"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>
      {/* 標記顯示 */}
      {showTag && (
        <div className="ml-12 mt-1 mb-2 p-2 bg-muted rounded border border-gray-200">
          <p className="text-sm font-medium mb-1">已識別的標記：</p>
          <div className="flex flex-wrap gap-2">
            {file.tags && file.tags.length > 0 ? file.tags.map(tag => (
              <span key={tag.id} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">{tag.name}</span>
            )) : (
              <span className="text-muted-foreground text-sm">無標記</span>
            )}
          </div>
        </div>
      )}
      <DeleteFileConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        onConfirm={() => {
          onDeleteFile(file);
          setDeleteDialog(false);
        }}
        fileName={file.name}
      />
    </>
  );
};

export default FolderTreeFile;
