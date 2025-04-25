
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface TagEditorProps {
  templateId: number;
  tags: Array<{ id: number; name: string }>;
  onUpdateTags: (newTags: Array<{ id: number; name: string }>) => void;
}

const TagEditor: React.FC<TagEditorProps> = ({ templateId, tags, onUpdateTags }) => {
  const [open, setOpen] = useState(false);
  const [editedTags, setEditedTags] = useState(tags);
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim()) {
      setEditedTags([...editedTags, { id: Date.now(), name: newTag.trim() }]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagId: number) => {
    setEditedTags(editedTags.filter(tag => tag.id !== tagId));
  };

  const handleSave = () => {
    onUpdateTags(editedTags);
    toast.success('已更新模板標記');
    setOpen(false);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Tag className="h-4 w-4 mr-2" />
        編輯標記
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>編輯模板標記</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="新增標記"
              />
              <Button onClick={handleAddTag}>新增</Button>
            </div>
            <div className="space-y-2">
              {editedTags.map((tag) => (
                <div key={tag.id} className="flex items-center justify-between p-2 border rounded-md">
                  <span>{tag.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTag(tag.id)}
                  >
                    移除
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>
              儲存變更
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TagEditor;
