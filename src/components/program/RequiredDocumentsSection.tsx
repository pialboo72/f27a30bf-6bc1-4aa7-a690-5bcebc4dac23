
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from 'lucide-react';

interface RequiredDocumentsSectionProps {
  requiredDocs: string[];
  onRequiredDocsChange: (docs: string[]) => void;
}

const RequiredDocumentsSection: React.FC<RequiredDocumentsSectionProps> = ({
  requiredDocs,
  onRequiredDocsChange
}) => {
  const [newRequiredDoc, setNewRequiredDoc] = useState('');

  const handleAddRequiredDoc = () => {
    if (newRequiredDoc.trim() && !requiredDocs.includes(newRequiredDoc.trim())) {
      onRequiredDocsChange([...requiredDocs, newRequiredDoc.trim()]);
      setNewRequiredDoc('');
    }
  };

  const handleRemoveRequiredDoc = (docToRemove: string) => {
    onRequiredDocsChange(requiredDocs.filter(doc => doc !== docToRemove));
  };

  return (
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
  );
};

export default RequiredDocumentsSection;
