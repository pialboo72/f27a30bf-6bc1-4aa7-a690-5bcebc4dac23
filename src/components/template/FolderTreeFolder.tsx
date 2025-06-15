
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Folder as FolderIcon, ChevronDown, ChevronRight, FolderPlus } from "lucide-react";
import FolderTreeFile from "./FolderTreeFile";
import { FolderNode } from "@/hooks/useFolderTree";
import { SystemFile } from "@/types/program";

interface FolderTreeFolderProps {
  folder: FolderNode;
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

const FolderTreeFolder: React.FC<FolderTreeFolderProps> = ({
  folder,
  files,
  selectedFile,
  onSelectFile,
  onDeleteFile,
  onAddFolder,
  onMoveFile,
  expanded,
  setExpanded,
  parentId,
}) => {
  const [creatingFolderId, setCreatingFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [dragFileId, setDragFileId] = useState<number | null>(null);

  // 處理「檔案拖曳」事件
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
    <div
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
          {folder.children && folder.children.length > 0 && folder.children.map(child => (
            <FolderTreeFolder
              key={child.id}
              folder={child}
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
          ))}
          {/* 檔案列表 */}
          {files.filter(f => f.folders?.[0] === folder.id).map(file => (
            <FolderTreeFile
              key={file.id}
              file={file}
              selectedFile={selectedFile}
              onSelectFile={onSelectFile}
              onDeleteFile={onDeleteFile}
              expanded={expanded}
              setDragFileId={setDragFileId}
              dragFileId={dragFileId}
              onMoveFile={onMoveFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderTreeFolder;
