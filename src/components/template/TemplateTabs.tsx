
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Trash, Folder as FolderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SystemFile } from "@/types/program";
import { useFiles } from "@/contexts/FileContext";
import FolderTree, { buildFolderTree } from "./FolderTree";

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
  children
}: TemplateTabsProps) => {
  const { deleteSystemFile } = useFiles();

  const handleSelectTemplate = (template: SystemFile) => {
    setSelectedTemplate(template);
  };

  const handleDeleteTemplate = (template: SystemFile) => {
    if (selectedTemplate?.id === template.id) {
      setSelectedTemplate(null);
    }
    deleteSystemFile(template.id);
  };

  // 架構 folder tree
  const folderTree = buildFolderTree(templates);

  // 專門找出「未分類」的檔案
  const uncategorizedFiles = templates.filter(
    file =>
      !file.folders ||
      file.folders.length === 0 ||
      file.folders.includes("未分類")
  );

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
                {/* 階層式資料夾樹： */}
                <FolderTree
                  nodes={folderTree}
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={handleSelectTemplate}
                  onDeleteTemplate={handleDeleteTemplate}
                />

                {/* 「未分類」置底 */}
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
                              <Trash className="h-4 w-4 text-destructive" />
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
