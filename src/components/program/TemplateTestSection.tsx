
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TemplateForm from "../template/TemplateForm";
import { SystemFile } from "@/types/program";

interface TemplateTestSectionProps {
  template: SystemFile;
}

const TemplateTestSection: React.FC<TemplateTestSectionProps> = ({ template }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>模板測試</CardTitle>
      </CardHeader>
      <CardContent>
        <TemplateForm template={template} />
      </CardContent>
    </Card>
  );
};

export default TemplateTestSection;
