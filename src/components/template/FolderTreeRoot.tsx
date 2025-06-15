
import React from "react";
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
        />
      ))}
    </>
  );
};

export default FolderTreeRoot;
