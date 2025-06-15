
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { SystemFile } from "@/types/program";
import { useFiles } from "@/contexts/FileContext"; // (新增) 用於呼叫 delete

interface TemplateTabsProps {
  tab: string;
  setTab: (tab: string) => void;
  tabs: { key: string; label: string }[];
  templates: SystemFile[];
  selectedTemplate: SystemFile | null;
  setSelectedTemplate: (t: SystemFile | null) => void;
  children?: React.ReactNode; // uploader
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
    // 若目前選中的被刪除，將其取消選取
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null);
    }
    deleteSystemFile(templateId);
  };

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
      {/* 將卡片寬度撐滿外層，保持一致 */}
      <div className="space-y-6 w-full">
        {children}
        {templates.length > 0 && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>已上傳的模板</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`border rounded-lg p-4 transition-colors cursor-pointer hover:border-primary ${
                      selectedTemplate?.id === template.id ? 'border-primary bg-primary/5' : ''
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
            </CardContent>
          </Card>
        )}
      </div>
      {/* 右側詳細資訊仍置於原處 */}
      <div className="mt-6">
        {selectedTemplate && (
          <Card>
            <CardHeader>
              <CardTitle>生成文件</CardTitle>
            </CardHeader>
            <CardContent>
              {/* 這邊可插入 TemplateForm */}
              {/* <TemplateForm template={selectedTemplate} /> */}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TemplateTabs;

