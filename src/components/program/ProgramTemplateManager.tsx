
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useFiles } from "@/contexts/FileContext";
import { FileText, Upload, Download, Settings, Plus, X } from 'lucide-react';
import { toast } from "sonner";
import TemplateForm from "../template/TemplateForm";
import { SubsidyProgram } from "@/types/program";

interface ProgramTemplateManagerProps {
  program?: SubsidyProgram;
}

const ProgramTemplateManager: React.FC<ProgramTemplateManagerProps> = ({ program }) => {
  const { systemFiles, uploadFileWithConversion } = useFiles();
  const [selectedTemplate, setSelectedTemplate] = useState(program?.applicationTemplate || null);
  const [requiredDocs, setRequiredDocs] = useState<string[]>(program?.requiredDocuments || []);
  const [newRequiredDoc, setNewRequiredDoc] = useState('');
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
        setSelectedTemplate(uploadedFile);
        toast.success('模板上傳成功');
      }
    } catch (error) {
      toast.error('模板上傳失敗');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddRequiredDoc = () => {
    if (newRequiredDoc.trim() && !requiredDocs.includes(newRequiredDoc.trim())) {
      setRequiredDocs([...requiredDocs, newRequiredDoc.trim()]);
      setNewRequiredDoc('');
    }
  };

  const handleRemoveRequiredDoc = (docToRemove: string) => {
    setRequiredDocs(requiredDocs.filter(doc => doc !== docToRemove));
  };

  const handleSaveTemplate = () => {
    // 在實際應用中，這裡應該調用 API 保存模板設定
    const updatedProgram = {
      ...program,
      applicationTemplate: selectedTemplate,
      requiredDocuments: requiredDocs
    };
    
    console.log('儲存模板設定:', updatedProgram);
    toast.success('模板設定已儲存');
  };

  if (!program) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">找不到指定的補助計劃</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 補助計劃資訊 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {program.title} - 模板設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">主辦機關</Label>
              <p className="text-sm text-muted-foreground">{program.organization}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">申請截止日期</Label>
              <p className="text-sm text-muted-foreground">{program.deadline}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">最高補助金額</Label>
              <p className="text-sm text-muted-foreground">NT$ {program.maxAmount.toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">補助類別</Label>
              <Badge variant="outline">{program.category}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 申請書模板設定 */}
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
                  <Button variant="outline" size="sm" onClick={() => setSelectedTemplate(null)}>
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

      {/* 必備文件設定 */}
      <Card>
        <CardHeader>
          <CardTitle>必備附件設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="輸入必備文件名稱"
              value={newRequiredDoc}
              onChange={(e) => setNewRequiredDoc(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddRequiredDoc()}
            />
            <Button onClick={handleAddRequiredDoc}>
              <Plus className="h-4 w-4 mr-1" />
              新增
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label>必備文件清單</Label>
            {requiredDocs.length > 0 ? (
              <div className="space-y-2">
                {requiredDocs.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <span className="text-sm">{doc}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRequiredDoc(doc)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">尚未設定必備文件</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 模板測試 */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>模板測試</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateForm template={selectedTemplate} />
          </CardContent>
        </Card>
      )}

      {/* 操作按鈕 */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          取消
        </Button>
        <Button onClick={handleSaveTemplate}>
          儲存設定
        </Button>
      </div>
    </div>
  );
};

export default ProgramTemplateManager;
