
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SystemFile, FileTag } from '@/types/program';

interface FileSelectorProps {
  files: SystemFile[];
  selectedFiles: SystemFile[];
  onFileSelect: (files: SystemFile[]) => void;
}

// 模擬系統檔案資料
const mockSystemFiles: SystemFile[] = [
  {
    id: 1,
    name: '申請表.pdf',
    path: '/files/application.pdf',
    tags: [{ id: 1, name: '申請書' }]
  },
  {
    id: 2,
    name: '計畫書範本.docx',
    path: '/files/proposal-template.docx',
    tags: [{ id: 2, name: '必備附件' }]
  },
  {
    id: 3,
    name: '補充文件範本.docx',
    path: '/files/supplementary.docx',
    tags: [{ id: 3, name: '可選附件' }]
  }
];

export const FileSelector = ({
  selectedFiles,
  onFileSelect
}: FileSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {mockSystemFiles.map((file) => (
          <div key={file.id} className="flex items-center justify-between p-2 border rounded-lg">
            <div className="flex items-center gap-2">
              <div>{file.name}</div>
              {file.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
            <Select
              onValueChange={(value) => {
                const isSelected = value === 'selected';
                if (isSelected) {
                  onFileSelect([...selectedFiles, file]);
                } else {
                  onFileSelect(selectedFiles.filter(f => f.id !== file.id));
                }
              }}
              value={selectedFiles.some(f => f.id === file.id) ? 'selected' : 'unselected'}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="選擇狀態" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="selected">已選擇</SelectItem>
                <SelectItem value="unselected">未選擇</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
};
