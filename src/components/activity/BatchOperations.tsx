
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Download, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BatchOperationsProps {
  selectedCount: number;
  onBatchDelete: () => void;
  onBatchExport: () => void;
  onBatchCopy: () => void;
  onClearSelection: () => void;
}

const BatchOperations: React.FC<BatchOperationsProps> = ({
  selectedCount,
  onBatchDelete,
  onBatchExport,
  onBatchCopy,
  onClearSelection
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 p-4 bg-muted rounded-md">
      <span className="text-sm text-muted-foreground">
        已選擇 {selectedCount} 個活動
      </span>
      <div className="flex gap-2 ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onBatchCopy}
        >
          <Copy className="h-4 w-4 mr-1" />
          批量複製
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              批量導出
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onBatchExport()}>
              導出為 TXT
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onBatchExport()}>
              導出為 PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="destructive"
          size="sm"
          onClick={onBatchDelete}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          批量刪除
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
        >
          取消選擇
        </Button>
      </div>
    </div>
  );
};

export default BatchOperations;
