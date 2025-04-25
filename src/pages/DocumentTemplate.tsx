
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MainLayout from "@/components/layout/MainLayout";
import { useFiles } from "@/contexts/FileContext";
import { toast } from "sonner";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DocumentTemplate = () => {
  const { uploadFileWithConversion } = useFiles();

  const acceptedFormats = [
    ".docx",
    ".doc",
    ".odt",
    ".odf",
    ".xls",
    ".xlsx"
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !acceptedFormats.some(format => format.includes(fileExt))) {
      toast.error("不支援的檔案格式");
      return;
    }

    try {
      const uploadedFile = await uploadFileWithConversion(file);
      if (uploadedFile) {
        toast.success("模板上傳成功");
      }
    } catch (error) {
      toast.error("檔案上傳失敗");
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <div className="fade-in space-y-6">
        <div>
          <h1 className="text-3xl font-bold">文件模板管理</h1>
          <p className="text-muted-foreground mt-1">
            上傳和管理可用於自動填充的文件模板
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>上傳新模板</CardTitle>
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
      </div>
    </MainLayout>
  );
};

export default DocumentTemplate;
