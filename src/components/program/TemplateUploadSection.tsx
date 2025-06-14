
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useFiles } from "@/contexts/FileContext";
import { FileText, Upload, Download, X } from 'lucide-react';
import { toast } from "sonner";
import { SystemFile } from "@/types/program";

interface TemplateUploadSectionProps {
  selectedTemplate: SystemFile | null;
  onTemplateChange: (template: SystemFile | null) => void;
}

const TemplateUploadSection: React.FC<TemplateUploadSectionProps> = ({
  selectedTemplate,
  onTemplateChange
}) => {
  const { uploadFileWithConversion } = useFiles();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.docx')) {
      toast.error('請上傳 Word 文件 (.docx)');
      return;
    }

    setIsUploading(true);
    try {
      const uploadedFile = await uploadFileWithConversion(file);
      if (uploadedFile) {
        onTemplateChange(uploadedFile);
        toast.success('模板上傳成功');
      }
    } catch (error) {
      toast.error('模板上傳失敗');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          申請書模板
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedTemplate ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-green-800">{selectedTemplate.name}</p>
                <p className="text-sm text-green-600">
                  檔案大小: {(selectedTemplate.size / 1024).toFixed(1)} KB
                </p>
                <p className="text-sm text-green-600">
                  包含 {selectedTemplate.tags.length} 個填寫欄位
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  下載
                </Button>
                <Button variant="outline" size="sm" onClick={() => onTemplateChange(null)}>
                  <X className="h-4 w-4 mr-1" />
                  移除
                </Button>
              </div>
            </div>
            
            {/* 顯示模板標記 */}
            <div className="mt-4">
              <Label className="text-sm font-medium">模板標記</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTemplate.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">尚未設定申請書模板</h3>
            <p className="text-muted-foreground mb-4">
              請上傳 Word 文件作為申請書模板，系統會自動識別其中的標記
            </p>
            <div className="flex justify-center">
              <Label htmlFor="template-upload" className="cursor-pointer">
                <Button disabled={isUploading} asChild>
                  <div>
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? '上傳中...' : '上傳模板'}
                  </div>
                </Button>
              </Label>
              <Input
                id="template-upload"
                type="file"
                accept=".docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TemplateUploadSection;
