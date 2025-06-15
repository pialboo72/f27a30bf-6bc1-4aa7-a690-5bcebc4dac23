
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Upload, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "sonner";
import { SystemFile } from "@/types/program";

interface TemplateUploaderProps {
  tab: string;
  onUploadSuccess: (file: SystemFile) => void;
  acceptedFormats: string[];
}

const TemplateUploader = ({ tab, onUploadSuccess, acceptedFormats }: TemplateUploaderProps) => {
  const { uploadFileWithConversion } = useFileUpload();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !acceptedFormats.some(format => format.includes(fileExt))) {
      toast.error("不支援的檔案格式");
      return;
    }

    try {
      const uploadedFile = await uploadFileWithConversion(file, undefined, tab);
      if (uploadedFile) {
        toast.success("模板上傳成功");
        onUploadSuccess(uploadedFile);
      }
    } catch (error) {
      toast.error("檔案上傳失敗");
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          上傳新模板
          <span className="text-base ml-2 text-muted-foreground font-normal">
            ({["補助單位文件", "共通項目文件", "個別補助案文件"].find((_, i) => ["unit", "common", "program"][i] === tab)})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label htmlFor="template-upload" className="cursor-pointer block">
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
  );
};

export default TemplateUploader;
