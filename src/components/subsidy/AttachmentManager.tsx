
import React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { File, Trash2 } from "lucide-react";

interface Attachment {
  id: number;
  name: string;
  originalName: string;
  size: number;
  uploadDate: string;
}

interface AttachmentManagerProps {
  attachments: Attachment[];
  newAttachmentName: string;
  onNameChange: (name: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (id: number) => void;
}

const AttachmentManager: React.FC<AttachmentManagerProps> = ({
  attachments,
  newAttachmentName,
  onNameChange,
  onFileUpload,
  onRemove
}) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="附件名稱"
          value={newAttachmentName}
          onChange={(e) => onNameChange(e.target.value)}
        />
        <Input
          type="file"
          onChange={onFileUpload}
        />
      </div>
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <div key={attachment.id} className="flex items-center justify-between p-2 border rounded">
            <div className="flex items-center gap-2">
              <File className="h-4 w-4" />
              <span>{attachment.name}</span>
              <Badge variant="outline">{(attachment.size / 1024).toFixed(2)} KB</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(attachment.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttachmentManager;
