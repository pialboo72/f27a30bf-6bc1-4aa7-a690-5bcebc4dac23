
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SystemFile } from "@/types/program";
// import TemplateForm from "./TemplateForm"; // 如未來需顯示表單再開啟

interface SelectedTemplateGenerateCardProps {
  selectedTemplate: SystemFile;
}

const SelectedTemplateGenerateCard: React.FC<SelectedTemplateGenerateCardProps> = ({
  selectedTemplate,
}) => {
  if (!selectedTemplate) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>生成文件</CardTitle>
      </CardHeader>
      <CardContent>
        {/* <TemplateForm template={selectedTemplate} /> */}
      </CardContent>
    </Card>
  );
};

export default SelectedTemplateGenerateCard;
