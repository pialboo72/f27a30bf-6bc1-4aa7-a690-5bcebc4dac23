
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { File, Trash2, Plus, Edit2, Check, X } from "lucide-react";
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    // Default to the original file name
    const attachmentName = file.name;

    const newAttachment: Attachment = {
      id: Date.now(),
      name: attachmentName,
      originalName: file.name,
      size: file.size,
      uploadDate: new Date().toLocaleDateString()
    };

    setAttachments(prev => [...prev, newAttachment]);
    toast.success(`附件 "${attachmentName}" 已上傳`);
    
    // Reset file input
    event.target.value = '';
  };

  const handleRemoveAttachment = (id: number) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
    toast.success('附件已刪除');
  };

  const handleEditStart = (id: number, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleEditSave = (id: number) => {
    if (editingName.trim()) {
      setAttachments(prev => prev.map(att => 
        att.id === id ? { ...att, name: editingName.trim() } : att
      ));
      toast.success('附件名稱已更新');
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName('');
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
                <div className="flex items-center gap-2 flex-1">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    {editingId === attachment.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="h-8"
                          onKeyPress={(e) => e.key === 'Enter' && handleEditSave(attachment.id)}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditSave(attachment.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleEditCancel}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-medium">{attachment.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {attachment.originalName} • {(attachment.size / 1024).toFixed(2)} KB
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditStart(attachment.id, attachment.name)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
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
