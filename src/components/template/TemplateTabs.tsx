import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Folder as FolderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SystemFile } from "@/types/program";
import { useFiles } from "@/contexts/FileContext";
import FolderTree from "./FolderTree";
import { useFolderTree, FolderNode } from "@/hooks/useFolderTree";
import { Eye, Download, Trash2 } from "lucide-react";

interface TemplateTabsProps {
  tab: string;
  setTab: (tab: string) => void;
  tabs: { key: string; label: string }[];
  templates: SystemFile[];
  selectedTemplate: SystemFile | null;
  setSelectedTemplate: (t: SystemFile | null) => void;
  children?: React.ReactNode;
}

const TemplateTabs = ({
  tab,
  setTab,
  tabs,
  templates,
  selectedTemplate,
  setSelectedTemplate,
  children,
}: TemplateTabsProps) => {
  const { deleteSystemFile, updateSystemFile } = useFiles();

  // 根節點
  const initialFolders: FolderNode[] = [
    { id: "root", name: "檔案模板", parentId: null },
    // 可以自行新增子資料夾
  ];

  // 巢狀資料夾 hook
  const {
    folders,
    setFolders,
    addFolder,
    getTree,
  } = useFolderTree(initialFolders);

  // 展開狀態
  const [expandedFolders, setExpandedFolders] = useState<{ [key: string]: boolean }>({ root: true });

  // === 修正分派所有無效 folders 的檔案都放到 root ===
  // 找到所有目前已存在的 folderId
  const allFolderIds = folders.map(f => f.id);

  // 若檔案沒有 folders, 或 folders 內容不正確, 一律修改成 ["root"]
  const validTemplates = templates.map(file => {
    let folderId = file.folders?.[0];
    if (!folderId || !allFolderIds.includes(folderId)) {
      return { ...file, folders: ["root"] };
    }
    return file;
  });

  // 檔案移動到資料夾
  const moveFileToFolder = (fileId: number, toFolderId: string) => {
    const movedFile = validTemplates.find(f => f.id === fileId);
    if (movedFile) updateSystemFile(fileId, { ...movedFile, folders: [toFolderId] });
  };

  // 選擇檔案
  const handleSelectTemplate = (template: SystemFile) => setSelectedTemplate(template);

  // 刪除
  const handleDeleteTemplate = (template: SystemFile) => {
    if (selectedTemplate?.id === template.id) setSelectedTemplate(null);
    deleteSystemFile(template.id);
  };

  // 新增資料夾
  const handleAddFolder = (name: string, parentId: string | null) => {
    addFolder(name, parentId);
    setExpandedFolders(prev => ({
      ...prev,
      [parentId || "root"]: true,
    }));
  };

  // 取得 tree（根是 "root"）
  const folderTree = getTree();

  return (
    <div>
      <div className="mb-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex gap-2">
            {tabs.map(({ key, label }) => (
              <TabsTrigger key={key} value={key}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="space-y-6 w-full">
        {children}
        {templates.length > 0 && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>已上傳的模板</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {/* 階層式資料夾樹 Drag & Drop/操作 */}
                <FolderTree
                  tree={folderTree}
                  files={validTemplates}
                  selectedFile={selectedTemplate}
                  onSelectFile={handleSelectTemplate}
                  onDeleteFile={handleDeleteTemplate}
                  onAddFolder={handleAddFolder}
                  onMoveFile={moveFileToFolder}
                  expanded={expandedFolders}
                  setExpanded={setExpandedFolders}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="mt-6">
        {selectedTemplate && (
          <Card>
            <CardHeader>
              <CardTitle>生成文件</CardTitle>
            </CardHeader>
            <CardContent>
              {/* <TemplateForm template={selectedTemplate} /> */}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TemplateTabs;

// 檔案超過 240 行，建議分拆 refactor!
