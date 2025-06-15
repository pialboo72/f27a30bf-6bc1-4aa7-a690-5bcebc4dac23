
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadedTemplateList from "./UploadedTemplateList";
import SelectedTemplateGenerateCard from "./SelectedTemplateGenerateCard";
import { SystemFile } from "@/types/program";
import { useFiles } from "@/contexts/FileContext";
import { useFolderTree, FolderNode } from "@/hooks/useFolderTree";

interface TemplateTabsProps {
  tab: string;
  setTab: (tab: string) => void;
  tabs: { key: string; label: string }[];
  templates: SystemFile[];
  selectedTemplate: SystemFile | null;
  setSelectedTemplate: (t: SystemFile | null) => void;
  children?: React.ReactNode;
}

const ROOT_FOLDERS: Record<string, FolderNode[]> = {
  unit: [{ id: "root-unit", name: "單位模板", parentId: null }],
  common: [{ id: "root-common", name: "共通模板", parentId: null }],
  program: [{ id: "root-program", name: "個案模板", parentId: null }],
};

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

  // 針對三個分頁分開資料夾樹
  const [folderStates, setFolderStates] = useState<{
    [key: string]: ReturnType<typeof useFolderTree>
  }>({
    unit: useFolderTree(ROOT_FOLDERS.unit),
    common: useFolderTree(ROOT_FOLDERS.common),
    program: useFolderTree(ROOT_FOLDERS.program),
  });

  // 各分類資料夾展開狀態
  const [expandedByTab, setExpandedByTab] = useState<{
    [key: string]: { [key: string]: boolean }
  }>({
    unit: { "root-unit": true },
    common: { "root-common": true },
    program: { "root-program": true },
  });

  // active folderTree hook for current tab
  const folderTreeHook = folderStates[tab];
  const setExpandedFolders = (updater: any) => {
    setExpandedByTab(prev => ({
      ...prev,
      [tab]: typeof updater === "function" ? updater(prev[tab]) : updater,
    }));
  };

  // 確保 templates 只映射到當前分頁有效資料夾
  const folders = folderTreeHook.folders;
  const allFolderIds = folders.map(f => f.id);
  const validTemplates = templates.map(file => {
    let folderId = file.folders?.[0];
    // 修正：只配屬於本分類根下的資料夾
    const categoryRootId =
      tab === "unit"
        ? "root-unit"
        : tab === "common"
        ? "root-common"
        : "root-program";
    // 必須第一層就是自己類別 root
    if (!folderId || !allFolderIds.includes(folderId)) {
      return { ...file, folders: [categoryRootId] };
    }
    return file;
  });

  // 文件移動
  const moveFileToFolder = (fileId: number, toFolderId: string) => {
    const movedFile = validTemplates.find(f => f.id === fileId);
    if (movedFile) updateSystemFile(fileId, { ...movedFile, folders: [toFolderId] });
  };

  // 資料夾新增
  const handleAddFolder = (name: string, parentId: string | null) => {
    folderTreeHook.addFolder(name, parentId);
    setExpandedFolders(prev => ({
      ...prev,
      [parentId || (tab === "unit"
        ? "root-unit"
        : tab === "common"
        ? "root-common"
        : "root-program"
      )]: true,
    }));
  };

  // select/delete
  const handleSelectTemplate = (template: SystemFile) => setSelectedTemplate(template);
  const handleDeleteTemplate = (template: SystemFile) => {
    if (selectedTemplate?.id === template.id) setSelectedTemplate(null);
    deleteSystemFile(template.id);
  };

  // 取得樹
  const folderTree = folderTreeHook.getTree();

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
        <UploadedTemplateList
          templates={templates}
          tree={folderTree}
          files={validTemplates}
          selectedTemplate={selectedTemplate}
          onSelectFile={handleSelectTemplate}
          onDeleteFile={handleDeleteTemplate}
          onAddFolder={handleAddFolder}
          onMoveFile={moveFileToFolder}
          expanded={expandedByTab[tab]}
          setExpanded={setExpandedFolders}
        />
      </div>
      <div className="mt-6">
        {selectedTemplate && (
          <SelectedTemplateGenerateCard selectedTemplate={selectedTemplate} />
        )}
      </div>
    </div>
  );
};

export default TemplateTabs;
