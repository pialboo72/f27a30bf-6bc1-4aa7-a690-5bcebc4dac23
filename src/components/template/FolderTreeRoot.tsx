
import React, { useState } from "react";
import { SystemFile } from "@/types/program";
import { FolderNode } from "@/hooks/useFolderTree";
import FolderTreeFolder from "./FolderTreeFolder";

interface FolderTreeRootProps {
  tree: FolderNode[];
  files: SystemFile[];
  selectedFile: SystemFile | null;
  onSelectFile: (file: SystemFile) => void;
  onDeleteFile: (file: SystemFile) => void;
  onAddFolder: (name: string, parentId: string | null) => void;
  onMoveFile: (fileId: number, toFolderId: string) => void;
  expanded: Record<string, boolean>;
  setExpanded: (exp: Record<string, boolean>) => void;
}

const FolderTreeRoot: React.FC<FolderTreeRootProps> = (props) => {
  // 新增全域拖曳中的 file id 狀態，from root
  const [dragFileId, setDragFileId] = useState<number | null>(null);

  if (!props.tree.length) return null;
  return (
    <>
      {props.tree.map(folder => (
        <FolderTreeFolder
          key={folder.id}
          folder={folder}
          files={props.files}
          selectedFile={props.selectedFile}
          onSelectFile={props.onSelectFile}
          onDeleteFile={props.onDeleteFile}
          onAddFolder={props.onAddFolder}
          onMoveFile={props.onMoveFile}
          expanded={props.expanded}
          setExpanded={props.setExpanded}
          dragFileId={dragFileId}
          setDragFileId={setDragFileId}
        />
      ))}
    </>
  );
};

export default FolderTreeRoot;
