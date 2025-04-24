
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileConverter } from "@/components/FileConverter";
import { useFiles } from "@/contexts/FileContext";
import { toast } from "sonner";
import { Upload, FileText, Save, Download } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { SystemFile } from "@/types/program";

interface TemplateField {
  id: string;
  name: string;
  description: string;
  defaultValue: string;
}

interface DocumentTemplate {
  id: number;
  name: string;
  fileId: number | null;
  fields: TemplateField[];
}

const DocumentTemplate = () => {
  const { systemFiles, uploadFileWithConversion, generateDocxFromTemplate } = useFiles();
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<DocumentTemplate | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  
  const form = useForm({
    defaultValues: {
      templateName: "",
      fieldName: "",
      fieldDescription: "",
      fieldDefaultValue: "",
    }
  });

  // 從 localStorage 載入模板資料
  useEffect(() => {
    const savedTemplates = localStorage.getItem("documentTemplates");
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  // 儲存模板資料到 localStorage
  const saveTemplates = (newTemplates: DocumentTemplate[]) => {
    setTemplates(newTemplates);
    localStorage.setItem("documentTemplates", JSON.stringify(newTemplates));
  };

  // 處理檔案選擇
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      toast.success(`已選擇檔案: ${event.target.files[0].name}`);
    }
  };

  // 上傳模板檔案
  const uploadTemplate = async () => {
    if (!selectedFile) {
      toast.error("請先選擇檔案");
      return;
    }

    if (!form.getValues("templateName")) {
      toast.error("請輸入模板名稱");
      return;
    }

    try {
      // 上傳檔案
      const uploadedFile = await uploadFileWithConversion(selectedFile);
      
      if (uploadedFile) {
        // 建立新模板
        const newTemplate: DocumentTemplate = {
          id: Date.now(),
          name: form.getValues("templateName"),
          fileId: uploadedFile.id,
          fields: [],
        };

        saveTemplates([...templates, newTemplate]);
        setCurrentTemplate(newTemplate);
        form.reset();
        setSelectedFile(null);
        toast.success("模板上傳成功");
      }
    } catch (error) {
      console.error(error);
      toast.error("模板上傳失敗");
    }
  };

  // 添加欄位到模板
  const addFieldToTemplate = () => {
    if (!currentTemplate) {
      toast.error("請先選擇或建立模板");
      return;
    }
    
    const { fieldName, fieldDescription, fieldDefaultValue } = form.getValues();
    
    if (!fieldName) {
      toast.error("請輸入欄位名稱");
      return;
    }
    
    const newField: TemplateField = {
      id: `field_${Date.now()}`,
      name: fieldName,
      description: fieldDescription || "",
      defaultValue: fieldDefaultValue || "",
    };
    
    const updatedTemplate = {
      ...currentTemplate,
      fields: [...currentTemplate.fields, newField],
    };
    
    const updatedTemplates = templates.map(t => 
      t.id === currentTemplate.id ? updatedTemplate : t
    );
    
    saveTemplates(updatedTemplates);
    setCurrentTemplate(updatedTemplate);
    form.setValue("fieldName", "");
    form.setValue("fieldDescription", "");
    form.setValue("fieldDefaultValue", "");
    toast.success("欄位已添加到模板");
  };

  // 選擇模板
  const handleSelectTemplate = (templateId: string) => {
    const selected = templates.find(t => t.id === parseInt(templateId));
    setCurrentTemplate(selected || null);
    
    // 初始化欄位值
    if (selected) {
      const initialValues: Record<string, string> = {};
      selected.fields.forEach(field => {
        initialValues[field.id] = field.defaultValue;
      });
      setFieldValues(initialValues);
    } else {
      setFieldValues({});
    }
  };

  // 更新欄位值
  const handleFieldValueChange = (fieldId: string, value: string) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // 生成文件
  const generateDocument = async () => {
    if (!currentTemplate) {
      toast.error("請先選擇模板");
      return;
    }
    
    if (!currentTemplate.fileId) {
      toast.error("模板檔案不存在");
      return;
    }
    
    // 檢查必填欄位
    const emptyRequiredFields = currentTemplate.fields
      .filter(field => !fieldValues[field.id] && field.description.includes("*"));
      
    if (emptyRequiredFields.length > 0) {
      toast.error(`請填寫所有必填欄位: ${emptyRequiredFields.map(f => f.name).join(", ")}`);
      return;
    }
    
    try {
      const data: Record<string, string> = {};
      currentTemplate.fields.forEach(field => {
        data[field.name] = fieldValues[field.id] || field.defaultValue;
      });
      
      const documentBlob = await generateDocxFromTemplate(currentTemplate.fileId, data);
      
      if (documentBlob) {
        // 下載生成的文件
        const url = URL.createObjectURL(documentBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${currentTemplate.name}_生成文件.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("文件生成並下載成功");
      }
    } catch (error) {
      console.error(error);
      toast.error("文件生成失敗");
    }
  };

  return (
    <MainLayout>
      <div className="fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">文件模板管理</h1>
            <p className="text-muted-foreground mt-1">
              上傳文件模板、標記欄位位置，並生成客製化文件
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>文件模板管理</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="create" className="w-full">
                <TabsList>
                  <TabsTrigger value="create">建立模板</TabsTrigger>
                  <TabsTrigger value="generate">生成文件</TabsTrigger>
                  <TabsTrigger value="convert">檔案轉換</TabsTrigger>
                </TabsList>
                
                {/* 建立模板頁籤 */}
                <TabsContent value="create" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">上傳模板檔案</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="template-name">模板名稱</Label>
                          <Input 
                            id="template-name" 
                            placeholder="請輸入模板名稱" 
                            {...form.register("templateName")}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="template-file">選擇檔案</Label>
                          <Input 
                            id="template-file" 
                            type="file" 
                            onChange={handleFileSelect}
                            accept=".docx,.odt,.pdf"
                          />
                        </div>
                        
                        <Button onClick={uploadTemplate}>
                          <Upload className="mr-2 h-4 w-4" />
                          上傳模板
                        </Button>
                      </div>
                    </div>
                    
                    {currentTemplate && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">添加欄位</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="field-name">欄位名稱</Label>
                            <Input 
                              id="field-name" 
                              placeholder="請輸入欄位名稱" 
                              {...form.register("fieldName")}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="field-description">欄位說明</Label>
                            <Input 
                              id="field-description" 
                              placeholder="請輸入欄位說明 (加*表示必填)" 
                              {...form.register("fieldDescription")}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="field-default">預設值</Label>
                            <Input 
                              id="field-default" 
                              placeholder="請輸入預設值" 
                              {...form.register("fieldDefaultValue")}
                            />
                          </div>
                          
                          <Button onClick={addFieldToTemplate}>
                            <Plus className="mr-2 h-4 w-4" />
                            添加欄位
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {currentTemplate && currentTemplate.fields.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">模板欄位列表</h3>
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-muted">
                            <th className="border px-4 py-2 text-left">欄位名稱</th>
                            <th className="border px-4 py-2 text-left">說明</th>
                            <th className="border px-4 py-2 text-left">預設值</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentTemplate.fields.map((field) => (
                            <tr key={field.id} className="border-b">
                              <td className="border px-4 py-2">{field.name}</td>
                              <td className="border px-4 py-2">{field.description}</td>
                              <td className="border px-4 py-2">{field.defaultValue}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </TabsContent>
                
                {/* 生成文件頁籤 */}
                <TabsContent value="generate" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">選擇模板</h3>
                      <div className="space-y-4">
                        <Select onValueChange={handleSelectTemplate}>
                          <SelectTrigger>
                            <SelectValue placeholder="選擇模板" />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map((template) => (
                              <SelectItem key={template.id} value={template.id.toString()}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {currentTemplate && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">填寫欄位資料</h3>
                        <div className="space-y-4">
                          {currentTemplate.fields.map((field) => (
                            <div key={field.id} className="space-y-2">
                              <Label htmlFor={field.id}>
                                {field.name}
                                {field.description.includes("*") && <span className="text-red-500"> *</span>}
                              </Label>
                              {field.description.length > 0 && !field.description.includes("*") && (
                                <p className="text-sm text-muted-foreground">{field.description}</p>
                              )}
                              <Input
                                id={field.id}
                                placeholder={field.description}
                                defaultValue={field.defaultValue}
                                value={fieldValues[field.id] || ""}
                                onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
                              />
                            </div>
                          ))}
                          
                          {currentTemplate.fields.length > 0 && (
                            <Button onClick={generateDocument}>
                              <FileText className="mr-2 h-4 w-4" />
                              生成文件
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                {/* 檔案轉換頁籤 */}
                <TabsContent value="convert">
                  <FileConverter />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

// 添加 Plus 圖標元件
const Plus = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default DocumentTemplate;
