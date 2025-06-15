
import { useState } from "react";

// FolderNode 型別（巢狀結構），每個節點有唯一 id, name, parentId
export interface FolderNode {
  id: string;
  name: string;
  parentId: string | null; // 根目錄為 null
  children?: FolderNode[];
}

export function useFolderTree(initialFolders: FolderNode[] = []) {
  const [folders, setFolders] = useState<FolderNode[]>(initialFolders);

  // 工具：將 flat array 轉為巢狀 tree
  function buildTree(
    flat: FolderNode[],
    parentId: string | null = null
  ): FolderNode[] {
    return flat
      .filter(f => f.parentId === parentId)
      .map(node => ({
        ...node,
        children: buildTree(flat, node.id)
      }));
  }

  function addFolder(name: string, parentId: string | null = null) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    setFolders(prev => [
      ...prev,
      { id, name, parentId }
    ]);
    return id;
  }

  return {
    folders,
    setFolders,
    addFolder,
    getTree: () => buildTree(folders),
  };
}
