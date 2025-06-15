import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Folder as FolderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SystemFile } from "@/types/program";
import { useFiles } from "@/contexts/FileContext";
import FolderTree from "./FolderTree";
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

const TemplateTabs = ({
  tab,
  setTab,
  tabs,
  templates,
  selectedTemplate,
  setSelectedTemplate,
  children,
}: TemplateTabsProps) => {
  const { deleteSystemFile } = useFiles();

  // Sample: 根節點只有一個「檔案模板」（id: "root"）
  const initialFolders: FolderNode[] = [
    { id: "root", name: "檔案模板", parentId: null },
    // 你可以預設初始資料夾，例如
    // { id: "year-2024", name: "2024", parentId: "root" },
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

  // 處理檔案—巢狀對應：假設每個 file.folders = [folderId]
  const folderFiles = (folderId: string) => templates.filter(f => f.folders && f.folders[0] === folderId);

  // 找出未分類
  const uncategorizedFiles = templates.filter(
    file =>
      !file.folders ||
      file.folders.length === 0 ||
      file.folders[0] === "uncategorized" ||
      !folders.some(f => f.id === file.folders[0])
  );

  // 上傳文件的資料夾選擇Dialog（省略，僅展示如何取得 folder id）
  // 實作時應將 TemplateUploader 支援 props: folders/tree, 選擇存放 folderId

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
                {/* 階層式資料夾樹 */}
                <FolderTree
                  tree={folderTree}
                  files={templates}
                  selectedFile={selectedTemplate}
                  onSelectFile={handleSelectTemplate}
                  onDeleteFile={handleDeleteTemplate}
                  onAddFolder={handleAddFolder}
                  expanded={expandedFolders}
                  setExpanded={setExpandedFolders}
                />
                {/* 未分類檔案 */}
                {uncategorizedFiles.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <FolderIcon className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-base">未分類</span>
                    </div>
                    <div className="space-y-2 pl-6">
                      {uncategorizedFiles.map((template) => (
                        <div
                          key={template.id}
                          className={`border rounded-lg p-3 transition-colors cursor-pointer hover:border-primary ${
                            selectedTemplate?.id === template.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                          }`}
                          onClick={() => handleSelectTemplate(template)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-primary" />
                              <span className="font-medium">{template.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={e => {
                                e.stopPropagation();
                                handleDeleteTemplate(template);
                              }}
                            >
                              {/* 用紅色 trash icon 省略 */}
                              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-destructive">
                                <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="2"/>
                                <path d="M10 10v6M14 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M5 6l1-3h12l1 3" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </Button>
                          </div>
                          <div className="bg-muted p-3 rounded-md">
                            <p className="text-sm font-medium mb-2">已識別的標記：</p>
                            <div className="flex flex-wrap gap-2">
                              {template.tags.map((tag) => (
                                <span
                                  key={tag.id}
                                  className="bg-primary/10 text-primary px-2 py-1 rounded text-sm"
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
