
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SubsidyProgram } from "@/types/program";
import ProgramInfo from "./ProgramInfo";
import TemplateUploadSection from "./TemplateUploadSection";
import RequiredDocumentsSection from "./RequiredDocumentsSection";
import TemplateTestSection from "./TemplateTestSection";

interface ProgramTemplateManagerProps {
  program?: SubsidyProgram;
}

const ProgramTemplateManager: React.FC<ProgramTemplateManagerProps> = ({ program }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(program?.applicationTemplate || null);
  const [requiredDocs, setRequiredDocs] = useState<string[]>(program?.requiredDocuments || []);

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
        onTemplateChange={setSelectedTemplate}
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
