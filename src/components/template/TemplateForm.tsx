
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFiles } from "@/contexts/FileContext";
import { saveAs } from 'file-saver';
import { toast } from "sonner";
import { FileText } from 'lucide-react';
import TemplatePreview from './TemplatePreview';
import TagEditor from './TagEditor';
import PredefinedValues from './PredefinedValues';
import { SystemFile } from '@/types/program';

// Predefined values for common fields (這裡可以根據需求擴充)
const PREDEFINED_VALUES: Record<string, string[]> = {
  '姓名': ['王小明', '李小華', '張小美'],
  '日期': [new Date().toLocaleDateString()],
  '單位': ['資訊部', '人資部', '業務部', '行政部'],
  '職稱': ['經理', '主任', '專員', '助理'],
};

interface TemplateFormProps {
  template: SystemFile;
}

const TemplateForm: React.FC<TemplateFormProps> = ({ template }) => {
  const { generateDocxFromTemplate } = useFiles();
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleInputChange = (tagName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [tagName]: value
    }));
  };

  const handleGenerateDocument = async () => {
    const emptyFields = template.tags
      .filter(tag => !formData[tag.name] || formData[tag.name].trim() === '')
      .map(tag => tag.name);

    if (emptyFields.length > 0) {
      toast.error(`請填寫以下欄位：${emptyFields.join(', ')}`);
      return;
    }

    try {
      const docBlob = await generateDocxFromTemplate(template.id, formData);
      if (docBlob) {
        const fileName = `generated-${template.name}`;
        saveAs(docBlob, fileName);
        toast.success('文件已生成');
      }
    } catch (error) {
      console.error('生成文件失敗:', error);
      toast.error('生成文件失敗');
    }
  };

  const handleUpdateTags = (newTags: Array<{ id: number; name: string }>) => {
    // 在實際應用中，這裡應該調用後端 API 來更新模板的標記
    console.log('Updated tags:', newTags);
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-medium">
          <FileText className="h-5 w-5" />
          <h3>使用模板：{template.name}</h3>
        </div>
        <div className="flex gap-2">
          <TemplatePreview
            templateName={template.name}
            tags={template.tags}
          />
          <TagEditor
            templateId={template.id}
            tags={template.tags}
            onUpdateTags={handleUpdateTags}
          />
        </div>
      </div>
      
      <div className="grid gap-4">
        {template.tags.map((tag) => (
          <div key={tag.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`field-${tag.id}`}>{tag.name}</Label>
              {PREDEFINED_VALUES[tag.name] && (
                <PredefinedValues
                  tagName={tag.name}
                  values={PREDEFINED_VALUES[tag.name]}
                  onSelect={(value) => handleInputChange(tag.name, value)}
                />
              )}
            </div>
            <Input
              id={`field-${tag.id}`}
              placeholder={`請輸入${tag.name}`}
              value={formData[tag.name] || ''}
              onChange={(e) => handleInputChange(tag.name, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleGenerateDocument}>
          生成文件
        </Button>
      </div>
    </div>
  );
};

export default TemplateForm;
