
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useFiles } from "@/contexts/FileContext";
import { SystemFile } from "@/types/program";
import TemplateTabs from "@/components/template/TemplateTabs";
import TemplateUploader from "@/components/template/TemplateUploader";

const TABS = [
  { key: "unit", label: "補助單位文件" },
  { key: "common", label: "共通項目文件" },
  { key: "program", label: "個別補助案文件" },
];

const DocumentTemplate = () => {
  const { systemFiles } = useFiles();
  const [selectedTemplate, setSelectedTemplate] = useState<SystemFile | null>(null);
  const [tab, setTab] = useState("unit");

  const acceptedFormats = [".docx", ".doc", ".odt", ".odf", ".xls", ".xlsx"];

  // Filter files by tab category
  const templates = systemFiles.filter(file => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const matchCategory = file.category ? file.category === tab : true;
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
        {/* Tabs + uploader/list UI */}
        <TemplateTabs
          tab={tab}
          setTab={setTab}
          tabs={TABS}
          templates={templates}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
        >
          <TemplateUploader
            tab={tab}
            onUploadSuccess={setSelectedTemplate}
            acceptedFormats={acceptedFormats}
          />
        </TemplateTabs>
      </div>
    </MainLayout>
  );
};

export default DocumentTemplate;
