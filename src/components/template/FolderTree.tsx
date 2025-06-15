
import React, { useState, Fragment } from "react";
import { ChevronDown, ChevronRight, Folder as FolderIcon, FileText } from "lucide-react";
import { SystemFile } from "@/types/program";
import { Button } from "@/components/ui/button";

// 將 flat folder 陣列 (["補助文件", "2024", "音樂組"]) 轉換成 tree 結構
export interface FolderNode {
  name: string;
  children?: FolderNode[];
  files?: SystemFile[];
}

function insertFileToTree(
  folders: string[],
  file: SystemFile,
  currentLevel: FolderNode[],
) {
  if (!folders.length) return;

  const folderName = folders[0];
  let node = currentLevel.find(n => n.name === folderName);
  if (!node) {
    node = { name: folderName, children: [], files: [] };
    currentLevel.push(node);
  }
  if (folders.length === 1) {
    node.files = node.files || [];
    node.files.push(file);
  } else {
    node.children = node.children || [];
    insertFileToTree(folders.slice(1), file, node.children);
  }
}

// 將所有檔案依照 folders 屬性建樹
export function buildFolderTree(files: SystemFile[]): FolderNode[] {
  const root: FolderNode[] = [];
  files.forEach(file => {
    if (file.folders && file.folders.length > 0 && !file.folders.includes('未分類')) {
      insertFileToTree(file.folders, file, root);
    }
  });
  return root;
}

// 展開所有層級用的遞迴元件
interface FolderTreeProps {
  nodes: FolderNode[];
  selectedTemplate: SystemFile | null;
  onSelectTemplate: (file: SystemFile) => void;
  onDeleteTemplate: (file: SystemFile) => void;
  level?: number;
}

const FolderTree: React.FC<FolderTreeProps> = ({
  nodes,
  selectedTemplate,
  onSelectTemplate,
  onDeleteTemplate,
  level = 0
}) => {
  // 每層用 local state 控管展開
  const [openFolders, setOpenFolders] = useState<{[folder: string]: boolean}>({});

  if (!nodes?.length) return null;

  return (
    <div className="space-y-2">
      {nodes.map((folder) => {
        const hasChildren = !!folder.children?.length;
        const hasFiles = !!folder.files?.length;
        const open = openFolders[folder.name] ?? true;
        return (
          <div key={folder.name} className="space-y-1">
            <div
              className={`flex items-center cursor-pointer group pl-${level * 4}`}
              onClick={() =>
                setOpenFolders(prev => ({
                  ...prev,
                  [folder.name]: !open
                }))
              }
            >
              {hasChildren || hasFiles ? (
                open ? (
                  <ChevronDown className="w-4 h-4 text-primary" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )
              ) : (
                <span className="inline-block w-4" />
              )}
              <FolderIcon className="w-4 h-4 text-primary mx-1" />
              <span className="font-semibold text-base group-hover:underline">{folder.name}</span>
            </div>
            {open && (
              <div className="pl-5 transition-all">
                {/* 子資料夾 */}
                {folder.children && <FolderTree
                  nodes={folder.children}
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={onSelectTemplate}
                  onDeleteTemplate={onDeleteTemplate}
                  level={level + 1}
                />}
                {/* 該層的檔案 */}
                {folder.files?.map(file => (
                  <div
                    key={file.id}
                    className={`border rounded-lg p-3 mt-1 flex items-center justify-between transition-colors cursor-pointer bg-white hover:border-primary ${
                      selectedTemplate?.id === file.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                    }`}
                    onClick={e => {
                      e.stopPropagation();
                      onSelectTemplate(file);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={e => {
                        e.stopPropagation();
                        onDeleteTemplate(file);
                      }}
                    >
                      <span className="sr-only">刪除</span>
                      {/* 用紅色 trash icon (不要直接在這引入 icon 以避免重複） */}
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
        );
      })}
    </div>
  );
};

export default FolderTree;
