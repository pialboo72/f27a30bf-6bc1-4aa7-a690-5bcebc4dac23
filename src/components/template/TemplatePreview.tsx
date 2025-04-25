
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TemplatePreviewProps {
  templateName: string;
  tags: Array<{ id: number; name: string }>;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ templateName, tags }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Eye className="h-4 w-4 mr-2" />
        預覽
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{templateName} - 標記預覽</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              此模板包含以下標記：
            </div>
            <div className="grid gap-2">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center gap-2 p-2 border rounded-md">
                  <span className="text-sm font-medium">{tag.name}</span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TemplatePreview;
