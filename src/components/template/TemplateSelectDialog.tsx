
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Folder } from "lucide-react";
import { SystemFile } from "@/types/program";

interface TemplateSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: SystemFile[];
  onSelect: (file: SystemFile) => void;
}

function groupByFolder(templates: SystemFile[]) {
  const folderMap: Record<string, SystemFile[]> = {};
  const UNCATEGORIZED_KEY = "未分類";

  templates.forEach((template) => {
    if (template.folders && template.folders.length > 0) {
      template.folders.forEach(folder => {
        if (!folderMap[folder]) folderMap[folder] = [];
        folderMap[folder].push(template);
      });
    } else {
      if (!folderMap[UNCATEGORIZED_KEY]) folderMap[UNCATEGORIZED_KEY] = [];
      folderMap[UNCATEGORIZED_KEY].push(template);
    }
  });
  return folderMap;
}

const TemplateSelectDialog: React.FC<TemplateSelectDialogProps> = ({
  open,
  onOpenChange,
  templates,
  onSelect
}) => {
  const [search, setSearch] = useState("");
  const filteredTemplates = templates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  const folderMap = groupByFolder(filteredTemplates);
  const folderOrder = Object.keys(folderMap);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>選擇文件模板</DialogTitle>
          <DialogDescription>
            可從所有已上傳模板依資料夾瀏覽與搜尋
          </DialogDescription>
        </DialogHeader>
        <input
          className="border rounded px-2 py-1 w-full mb-3"
          placeholder="搜尋模板名稱..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="space-y-4 max-h-72 overflow-auto">
          {folderOrder.length === 0 && (
            <p className="text-sm text-muted-foreground">沒有符合的模板</p>
          )}
          {folderOrder.map(folder => (
            <div key={folder}>
              <div className="flex items-center gap-2 mb-1">
                <Folder className="h-4 w-4 text-primary" />
                <span className="font-semibold">{folder}</span>
              </div>
              <div className="pl-6 space-y-2">
                {folderMap[folder].map(tpl => (
                  <Card key={tpl.id} className="cursor-pointer hover:border-primary" onClick={() => {
                    onSelect(tpl);
                    onOpenChange(false);
                  }}>
                    <CardContent className="flex items-center py-2 px-4 gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span>{tpl.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {tpl.tags?.length || 0} 標記
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelectDialog;

