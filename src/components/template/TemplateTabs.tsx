import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Trash, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { SystemFile } from "@/types/program";
import { useFiles } from "@/contexts/FileContext";

interface TemplateTabsProps {
  tab: string;
  setTab: (tab: string) => void;
  tabs: { key: string; label: string }[];
  templates: SystemFile[];
  selectedTemplate: SystemFile | null;
  setSelectedTemplate: (t: SystemFile | null) => void;
  children?: React.ReactNode;
}

// Helper to group templates by folder
function groupByFolder(templates: SystemFile[]) {
  const folderMap: Record<string, SystemFile[]> = {};
  const UNCATEGORIZED_KEY = "未分類";

  templates.forEach((template) => {
    if (template.folders && template.folders.length > 0) {
      template.folders.forEach(folder => {
        if (!folderMap[folder]) folderMap[folder] = [];
        folderMap[folder].push(template);
      });
    } else {
      if (!folderMap[UNCATEGORIZED_KEY]) folderMap[UNCATEGORIZED_KEY] = [];
      folderMap[UNCATEGORIZED_KEY].push(template);
    }
  });
  return folderMap;
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

  const handleDeleteTemplate = (templateId: number) => {
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null);
    }
    deleteSystemFile(templateId);
  };

  // 分組
  const folderMap = groupByFolder(templates);
  // folderOrder 修正排序（預設未分類在最後）
  const folderOrder = Object.keys(folderMap).sort((a, b) => {
    if (a === "未分類") return 1;
    if (b === "未分類") return -1;
    return a.localeCompare(b, 'zh-Hant');
  });

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
              {/* Tree/hierachical folder display */}
              <div className="space-y-4">
                {folderOrder.map(folder => (
                  <div key={folder}>
                    <div className="flex items-center gap-2 mb-2">
                      <Folder className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-base">{folder}</span>
                    </div>
                    <div className="space-y-4 pl-6">
                      {folderMap[folder].map((template) => (
                        <div
                          key={template.id}
                          className={`border rounded-lg p-4 transition-colors cursor-pointer hover:border-primary ${
                            selectedTemplate?.id === template.id ? 'border-primary bg-primary/5' : ''
                          }`}
                          onClick={() => setSelectedTemplate(template)}
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
                                if (selectedTemplate?.id === template.id) setSelectedTemplate(null);
                                handleDeleteTemplate(template.id);
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
                ))}
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
