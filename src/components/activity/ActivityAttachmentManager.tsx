
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { File, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface Attachment {
  id: number;
  name: string;
  originalName: string;
  size: number;
  uploadDate: string;
}

interface ActivityAttachmentManagerProps {
  activityId?: string;
}

const ActivityAttachmentManager: React.FC<ActivityAttachmentManagerProps> = ({ activityId }) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [newAttachmentName, setNewAttachmentName] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const attachmentName = newAttachmentName.trim() || file.name;

    const newAttachment: Attachment = {
      id: Date.now(),
      name: attachmentName,
      originalName: file.name,
      size: file.size,
      uploadDate: new Date().toLocaleDateString()
    };

    setAttachments(prev => [...prev, newAttachment]);
    setNewAttachmentName('');
    toast.success(`附件 "${attachmentName}" 已上傳`);
    
    // Reset file input
    event.target.value = '';
  };

  const handleRemoveAttachment = (id: number) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
    toast.success('附件已刪除');
  };

  const handleAddMore = () => {
    document.getElementById('attachment-upload')?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>附件上傳</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="attachment-name">附件名稱</Label>
            <Input
              id="attachment-name"
              placeholder="請輸入附件名稱（可選）"
              value={newAttachmentName}
              onChange={(e) => setNewAttachmentName(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Input
            id="attachment-upload"
            type="file"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button 
            variant="outline" 
            onClick={handleAddMore}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            新增附件
          </Button>
        </div>

        {attachments.length > 0 && (
          <div className="space-y-2">
            <Label>已上傳附件</Label>
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{attachment.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {attachment.originalName} • {(attachment.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                  <Badge variant="outline">{attachment.uploadDate}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAttachment(attachment.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityAttachmentManager;
