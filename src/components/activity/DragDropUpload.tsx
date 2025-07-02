
import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Upload, File } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DragDropUploadProps {
  onFileUpload: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
}

const DragDropUpload: React.FC<DragDropUploadProps> = ({
  onFileUpload,
  accept = ".json,.csv,.xlsx",
  multiple = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileUpload(files);
      toast.success(`成功上傳 ${files.length} 個檔案`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files);
      toast.success(`成功選擇 ${files.length} 個檔案`);
    }
  };

  return (
    <Card 
      className={cn(
        "border-2 border-dashed cursor-pointer transition-colors",
        isDragging 
          ? "border-primary bg-primary/5" 
          : "border-muted-foreground/25 hover:border-primary/50"
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <div className={cn(
          "rounded-full p-3 mb-4",
          isDragging ? "bg-primary/10" : "bg-muted"
        )}>
          <Upload className={cn(
            "h-6 w-6",
            isDragging ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {isDragging ? "放開以上傳檔案" : "拖拽檔案到此處"}
        </h3>
        <p className="text-muted-foreground mb-4">
          或點擊選擇檔案上傳
        </p>
        <p className="text-xs text-muted-foreground">
          支援格式: JSON, CSV, Excel
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};

export default DragDropUpload;
