
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FolderTree from "./FolderTree";
import { SystemFile } from "@/types/program";
import { FolderNode } from "@/hooks/useFolderTree";

interface UploadedTemplateListProps {
  templates: SystemFile[];
  tree: FolderNode[];
  files: SystemFile[];
  selectedTemplate: SystemFile | null;
  onSelectFile: (file: SystemFile) => void;
  onDeleteFile: (file: SystemFile) => void;
  onAddFolder: (name: string, parentId: string | null) => void;
  onMoveFile: (fileId: number, toFolderId: string) => void;
  expanded: Record<string, boolean>;
  setExpanded: (exp: Record<string, boolean>) => void;
}

const UploadedTemplateList: React.FC<UploadedTemplateListProps> = ({
  templates,
  tree,
  files,
  selectedTemplate,
  onSelectFile,
  onDeleteFile,
  onAddFolder,
  onMoveFile,
  expanded,
  setExpanded,
}) => {
  if (templates.length === 0) return null;
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>已上傳的模板</CardTitle>
      </CardHeader>
      <CardContent>
        <FolderTree
          tree={tree}
          files={files}
          selectedFile={selectedTemplate}
          onSelectFile={onSelectFile}
          onDeleteFile={onDeleteFile}
          onAddFolder={onAddFolder}
          onMoveFile={onMoveFile}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      </CardContent>
    </Card>
  );
};

export default UploadedTemplateList;
