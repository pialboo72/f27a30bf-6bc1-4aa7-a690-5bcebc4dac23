
import React, { useState } from "react";
import { Folder as FolderIcon, ChevronDown, ChevronRight, FileText, FolderPlus } from "lucide-react";
import { SystemFile } from "@/types/program";
import { Button } from "@/components/ui/button";
import { FolderNode } from "@/hooks/useFolderTree";

interface FolderTreeProps {
  tree: FolderNode[];
  files: SystemFile[];
  selectedFile: SystemFile | null;
  onSelectFile: (file: SystemFile) => void;
  onDeleteFile: (file: SystemFile) => void;
  onAddFolder: (name: string, parentId: string | null) => void;
  onAddFolderClick?: (parentId: string | null) => void;
  expanded: Record<string, boolean>;
  setExpanded: (exp: Record<string, boolean>) => void;
  parentId?: string | null; // for recursion
}

const FolderTree: React.FC<FolderTreeProps> = ({
  tree,
  files,
  selectedFile,
  onSelectFile,
  onDeleteFile,
  onAddFolder,
  onAddFolderClick,
  expanded,
  setExpanded,
  parentId = null,
}) => {
  const [creatingFolderId, setCreatingFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");

  if (!tree.length) return null;

  return (
    <div>
      {tree.map(folder => (
        <div key={folder.id} style={{ marginLeft: parentId ? 20 : 0 }} className="mb-1">
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
              {/* 子資料夾 */}
              {folder.children && folder.children.length > 0 && (
                <FolderTree
                  tree={folder.children}
                  files={files}
                  selectedFile={selectedFile}
                  onSelectFile={onSelectFile}
                  onDeleteFile={onDeleteFile}
                  onAddFolder={onAddFolder}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  parentId={folder.id}
                />
              )}
              {/* 檔案列表 */}
              {files.filter(f => f.folders?.[0] === folder.id).map(file => (
                <div
                  key={file.id}
                  className={`border rounded p-2 mt-1 flex items-center justify-between cursor-pointer ml-8 ${
                    selectedFile?.id === file.id ? "border-primary bg-primary/10" : "border-gray-200 bg-white"
                  }`}
                  onClick={() => onSelectFile(file)}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>{file.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={e => {
                      e.stopPropagation();
                      onDeleteFile(file);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-destructive">
                      <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="2"/>
                      <path d="M10 10v6M14 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M5 6l1-3h12l1 3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FolderTree;
