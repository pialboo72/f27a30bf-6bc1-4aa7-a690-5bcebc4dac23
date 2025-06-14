
import React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { File, Trash2 } from "lucide-react";

interface SubsidyDocument {
  id: number;
  name: string;
  originalName: string;
  type: 'application' | 'reimbursement';
  uploadDate: string;
  size: number;
}

interface DocumentManagerProps {
  documents: SubsidyDocument[];
  newDocumentName: string;
  onNameChange: (name: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (id: number) => void;
  placeholder: string;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({
  documents,
  newDocumentName,
  onNameChange,
  onFileUpload,
  onRemove,
  placeholder
}) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={newDocumentName}
          onChange={(e) => onNameChange(e.target.value)}
        />
        <Input
          type="file"
          onChange={onFileUpload}
        />
      </div>
      <div className="space-y-2">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
            <div className="flex items-center gap-2">
              <File className="h-4 w-4" />
              <span>{doc.name}</span>
              <Badge variant="outline">{(doc.size / 1024).toFixed(2)} KB</Badge>
              <Badge>{doc.uploadDate}</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(doc.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentManager;
