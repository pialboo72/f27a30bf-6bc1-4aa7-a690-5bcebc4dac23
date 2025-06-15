
import React, { useState } from "react";
import { Folder as FolderIcon, ChevronDown, ChevronRight, FileText, FolderPlus, Download, Eye, Trash2 } from "lucide-react";
import { SystemFile } from "@/types/program";
import { Button } from "@/components/ui/button";
import { FolderNode } from "@/hooks/useFolderTree";
import DeleteFileConfirmDialog from "@/components/files/DeleteFileConfirmDialog";

interface FolderTreeProps {
  tree: FolderNode[];
  files: SystemFile[];
  selectedFile: SystemFile | null;
  onSelectFile: (file: SystemFile) => void;
  onDeleteFile: (file: SystemFile) => void;
  onAddFolder: (name: string, parentId: string | null) => void;
  onMoveFile: (fileId: number, toFolderId: string) => void;
  expanded: Record<string, boolean>;
  setExpanded: (exp: Record<string, boolean>) => void;
  parentId?: string | null;
}

const FolderTree: React.FC<FolderTreeProps> = ({
  tree,
  files,
  selectedFile,
  onSelectFile,
  onDeleteFile,
  onAddFolder,
  onMoveFile,
  expanded,
  setExpanded,
  parentId = null,
}) => {
  const [creatingFolderId, setCreatingFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [showTagId, setShowTagId] = useState<number | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; file?: SystemFile }>({ open: false, file: undefined });

  // 目前被拖曳的檔案 ID
  const [dragFileId, setDragFileId] = useState<number | null>(null);

  if (!tree.length) return null;

  // 處理「檔案拖曳」事件
  const handleDragStart = (e: React.DragEvent, fileId: number) => {
    setDragFileId(fileId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(fileId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    const fileId = Number(e.dataTransfer.getData("text/plain"));
    if (fileId && folderId) {
      onMoveFile(fileId, folderId);
    }
    setDragFileId(null);
  };

  return (
    <div>
      {tree.map(folder => (
        <div
          key={folder.id}
          style={{ marginLeft: parentId ? 20 : 0 }}
          className="mb-1"
          onDragOver={handleDragOver}
          onDrop={e => handleDrop(e, folder.id)}
        >
          <div className="flex items-center group gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() =>
                setExpanded({
                  ...expanded,
                  [folder.id]: !expanded[folder.id],
                })
              }
            >
              {expanded[folder.id] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <FolderIcon className="h-5 w-5 text-primary mr-1" />
            <span className="font-semibold">{folder.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => setCreatingFolderId(folder.id)}
            >
              <FolderPlus className="h-4 w-4" />
            </Button>
          </div>
          {/* 新增子資料夾 */}
          {creatingFolderId === folder.id && (
            <div className="flex items-center gap-1 ml-8 my-1">
              <input
                className="border px-1 py-0.5 text-sm rounded"
                placeholder="輸入資料夾名稱"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                autoFocus
              />
              <Button
                size="sm"
                onClick={() => {
                  if (newFolderName.trim()) {
                    onAddFolder(newFolderName, folder.id);
                    setNewFolderName("");
                    setCreatingFolderId(null);
                  }
                }}
              >
                新增
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setCreatingFolderId(null)}>取消</Button>
            </div>
          )}
          {expanded[folder.id] && (
            <div>
              {/* 子資料夾（遞迴） */}
              {folder.children && folder.children.length > 0 && (
                <FolderTree
                  tree={folder.children}
                  files={files}
                  selectedFile={selectedFile}
                  onSelectFile={onSelectFile}
                  onDeleteFile={onDeleteFile}
                  onAddFolder={onAddFolder}
                  onMoveFile={onMoveFile}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  parentId={folder.id}
                />
              )}
              {/* 檔案列表 */}
              {files.filter(f => f.folders?.[0] === folder.id).map(file => (
                <div
                  key={file.id}
                  className={`border rounded p-2 mt-1 flex items-center justify-between cursor-pointer ml-8 group
                    ${selectedFile?.id === file.id ? "border-primary bg-primary/10" : "border-gray-200 bg-white"}
                    ${dragFileId === file.id ? "opacity-60 border-dashed border-2 border-primary" : ""}
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
                    {/* 查看 */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={e => {
                        e.stopPropagation();
                        setShowTagId(showTagId === file.id ? null : file.id);
                      }}
                      aria-label="查看"
                    >
                      <Eye className="w-4 h-4 text-blue-700" />
                    </Button>
                    {/* 下載 */}
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
                    {/* 刪除 */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={e => {
                        e.stopPropagation();
                        setDeleteDialog({ open: true, file });
                      }}
                      aria-label="刪除"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              {/* 標記區塊－只針對當前 showTagId 打開 */}
              {files.filter(f => f.folders?.[0] === folder.id && showTagId === f.id).map(file => (
                <div key={`tags-${file.id}`} className="ml-12 mt-1 mb-2 p-2 bg-muted rounded border border-gray-200">
                  <p className="text-sm font-medium mb-1">已識別的標記：</p>
                  <div className="flex flex-wrap gap-2">
                    {file.tags && file.tags.length > 0 ? file.tags.map(tag => (
                      <span key={tag.id} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">{tag.name}</span>
                    )) : (
                      <span className="text-muted-foreground text-sm">無標記</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {/* 檔案刪除確認對話框 */}
      <DeleteFileConfirmDialog
        open={deleteDialog.open}
        onOpenChange={open => setDeleteDialog({ open })}
        onConfirm={() => {
          if (deleteDialog.file) {
            onDeleteFile(deleteDialog.file);
          }
          setDeleteDialog({ open: false, file: undefined });
        }}
        fileName={deleteDialog.file?.name}
      />
    </div>
  );
};

export default FolderTree;
