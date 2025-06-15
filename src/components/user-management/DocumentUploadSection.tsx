
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { UnitFormValues } from "@/schemas/user-management-schemas";
import { UnitDocument } from "@/types/user-management";
import { Upload, X, FileText, CreditCard, Award } from "lucide-react";
import { toast } from "sonner";

interface DocumentUploadSectionProps {
  unitForm: UseFormReturn<UnitFormValues>;
}

const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({ unitForm }) => {
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  
  const documents = unitForm.watch("documents") || [];

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'establishment':
        return '立案證書';
      case 'bankbook':
        return '存摺';
      case 'certificate':
        return '負責人當選證書';
      default:
        return '文件';
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'establishment':
        return <FileText className="h-4 w-4" />;
      case 'bankbook':
        return <CreditCard className="h-4 w-4" />;
      case 'certificate':
        return <Award className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleFileUpload = async (file: File, type: string) => {
    setUploadingType(type);
    
    try {
      // 模擬文件上傳
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newDocument: UnitDocument = {
        id: Date.now().toString(),
        name: file.name,
        type: type as 'establishment' | 'bankbook' | 'certificate',
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
      };

      const currentDocuments = unitForm.getValues("documents") || [];
      
      // 如果是立案證書或負責人當選證書，只能有一個
      if (type === 'establishment' || type === 'certificate') {
        const filteredDocuments = currentDocuments.filter(doc => doc.type !== type);
        unitForm.setValue("documents", [...filteredDocuments, newDocument]);
      } else {
        // 存摺可以有多個
        unitForm.setValue("documents", [...currentDocuments, newDocument]);
      }
      
      toast.success(`${getDocumentTypeLabel(type)}上傳成功`);
    } catch (error) {
      toast.error("文件上傳失敗，請重試");
    } finally {
      setUploadingType(null);
    }
  };

  const removeDocument = (documentId: string) => {
    const currentDocuments = unitForm.getValues("documents") || [];
    const filteredDocuments = currentDocuments.filter(doc => doc.id !== documentId);
    unitForm.setValue("documents", filteredDocuments);
    toast.success("文件已移除");
  };

  const renderUploadButton = (type: string, label: string, multiple: boolean = false) => {
    const existingDocs = documents.filter(doc => doc.type === type);
    const canUpload = multiple || existingDocs.length === 0;
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{label}</span>
          {canUpload && (
            <div className="relative">
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file, type);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={uploadingType === type}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadingType === type}
              >
                <Upload className="h-4 w-4 mr-1" />
                {uploadingType === type ? "上傳中..." : "上傳"}
              </Button>
            </div>
          )}
        </div>
        
        {existingDocs.length > 0 && (
          <div className="space-y-2">
            {existingDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-2 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  {getDocumentIcon(doc.type)}
                  <span className="text-sm">{doc.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {getDocumentTypeLabel(doc.type)}
                  </Badge>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDocument(doc.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">相關文件上傳</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderUploadButton('establishment', '立案證書')}
        {renderUploadButton('bankbook', '存摺', true)}
        {renderUploadButton('certificate', '負責人當選證書')}
      </CardContent>
    </Card>
  );
};

export default DocumentUploadSection;
