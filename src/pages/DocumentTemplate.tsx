
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MainLayout from "@/components/layout/MainLayout";
import { useFiles } from "@/contexts/FileContext";
import { toast } from "sonner";
import { Upload, FileText, AlertCircle, Trash } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SystemFile } from "@/types/program";
import TemplateForm from "@/components/template/TemplateForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // 假設有 shadcn/ui Tabs

const TABS = [
  { key: "unit", label: "補助單位文件" },
  { key: "common", label: "共通項目文件" },
  { key: "program", label: "個別補助案文件" },
];

const DocumentTemplate = () => {
  const { uploadFileWithConversion, systemFiles } = useFiles();
  const [selectedTemplate, setSelectedTemplate] = useState<SystemFile | null>(null);
  const [tab, setTab] = useState("unit");

  const acceptedFormats = [".docx", ".doc", ".odt", ".odf", ".xls", ".xlsx"];

  // 控制各分類的上傳與 filter
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !acceptedFormats.some(format => format.includes(fileExt))) {
      toast.error("不支援的檔案格式");
      return;
    }

    try {
      // 模擬文件類型
      const uploadedFile = await uploadFileWithConversion(file, tab);
      if (uploadedFile) {
        toast.success("模板上傳成功");
        setSelectedTemplate(uploadedFile);
      }
    } catch (error) {
      toast.error("檔案上傳失敗");
      console.error(error);
    }
  };

  const handleDeleteTemplate = (templateId: number) => {
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null);
    }
    toast.success("模板已刪除");
  };

  const handleSelectTemplate = (template: SystemFile) => {
    setSelectedTemplate(template);
  };

  // 假設有 category 屬性用來分群
  const templates = systemFiles.filter(file => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const matchCategory = file.category ? file.category === tab : true; // 預設所有
    return (
      ext && acceptedFormats.some(format => format.includes(ext)) && matchCategory
    );
  });

  return (
    <MainLayout>
      <div className="fade-in space-y-6">
        <div>
          <h1 className="text-3xl font-bold">文件模板管理</h1>
          <p className="text-muted-foreground mt-1">
            上傳和管理每種文件模板，支援以補助單位、共通項目或個別補助案類別區分
          </p>
        </div>

        {/* Tabs 控制：切換分類 */}
        <div className="mb-6">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="flex gap-2">
              {TABS.map(({ key, label }) => (
                <TabsTrigger key={key} value={key}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* 上傳新模板區塊 */}
            <Card>
              <CardHeader>
                <CardTitle>
                  上傳新模板
                  <span className="text-base ml-2 text-muted-foreground font-normal">
                    ({TABS.find(t => t.key === tab)?.label})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label
                    htmlFor="template-upload"
                    className="cursor-pointer block"
                  >
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-primary transition-colors">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        點擊或拖曳檔案至此處上傳
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        支援的格式：DOCX, DOC, ODT, ODF, XLS, XLSX
                      </p>
                    </div>
                  </label>
                  <Input
                    id="template-upload"
                    type="file"
                    className="hidden"
                    accept={acceptedFormats.join(",")}
                    onChange={handleFileUpload}
                  />
                </div>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <p className="font-medium">如何在模板中設定標記：</p>
                    <ol className="list-decimal ml-4 mt-2 space-y-1">
                      <li>在 Word 文件中使用雙大括號標記變數，例如：{'{{姓名}}'}</li>
                      <li>標記必須使用中文或英文，例如：{'{{申請日期}}'} 或 {'{{applicationDate}}'}</li>
                      <li>避免在標記中使用特殊符號或空格</li>
                      <li>標記名稱建議具有描述性，以便識別其用途</li>
                    </ol>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {templates.length > 0 && (
              <Card>
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
                            onClick={(e) => {
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

          <div>
            {selectedTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle>生成文件</CardTitle>
                </CardHeader>
                <CardContent>
                  <TemplateForm template={selectedTemplate} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DocumentTemplate;

