import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SubsidyProgram } from "@/types/program";
import ProgramInfo from "./ProgramInfo";
import TemplateUploadSection from "./TemplateUploadSection";
import RequiredDocumentsSection from "./RequiredDocumentsSection";
import TemplateTestSection from "./TemplateTestSection";
import TemplateSelectDialog from "@/components/template/TemplateSelectDialog";
import { useFiles } from "@/contexts/FileContext";

interface ProgramTemplateManagerProps {
  program?: SubsidyProgram;
}

const ProgramTemplateManager: React.FC<ProgramTemplateManagerProps> = ({ program }) => {
  const { systemFiles, addSystemFile } = useFiles();
  const [selectedTemplate, setSelectedTemplate] = useState(program?.applicationTemplate || null);
  const [requiredDocs, setRequiredDocs] = useState<string[]>(program?.requiredDocuments || []);
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);

  // ============ 新增：當使用 TemplateUploader 區段上傳模板時也寫入全域文件模板 ============
  const handleUploadTemplate = (uploadedFile: any) => {
    setSelectedTemplate(uploadedFile);
    // 確保文件同步加入文件模板管理
    if (uploadedFile && !systemFiles.some(f => f.id === uploadedFile.id)) {
      addSystemFile(uploadedFile);
    }
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
      <ProgramInfo program={program} />

      {/* 申請書模板設定 */}
      <TemplateUploadSection 
        selectedTemplate={selectedTemplate}
        onTemplateChange={handleUploadTemplate}
      />

      {/* 新增：直接從文件模板選擇 */}
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={() => setSelectDialogOpen(true)}>
          從文件模板選擇
        </Button>
        <span className="text-sm text-muted-foreground">或是直接上傳 Word (.docx)</span>
      </div>
      <TemplateSelectDialog
        open={selectDialogOpen}
        onOpenChange={setSelectDialogOpen}
        templates={systemFiles}
        onSelect={file => setSelectedTemplate(file)}
      />

      {/* 必備文件設定 */}
      <RequiredDocumentsSection 
        requiredDocs={requiredDocs}
        onRequiredDocsChange={setRequiredDocs}
      />

      {/* 模板測試 */}
      {selectedTemplate && (
        <TemplateTestSection template={selectedTemplate} />
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
