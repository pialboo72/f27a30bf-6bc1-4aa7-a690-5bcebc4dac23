
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SystemFile, FileTag, FILE_CATEGORIES, FileCategory } from '@/types/program';
import { useFiles } from '@/contexts/FileContext';
import { Search, Folder, ArrowDown, ArrowRight } from 'lucide-react';

interface FileSelectorProps {
  selectedFiles: SystemFile[];
  onFileSelect: (files: SystemFile[]) => void;
}

export const FileSelector = ({
  selectedFiles,
  onFileSelect
}: FileSelectorProps) => {
  const { systemFiles } = useFiles();
  const [tempSelectedFiles, setTempSelectedFiles] = useState<SystemFile[]>(selectedFiles);
  const [fileCategories, setFileCategories] = useState<Record<number, FileCategory>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  // Group files by folder
  const filesByFolder = systemFiles.reduce((acc, file) => {
    const folders = file.folders || ['未分類'];
    folders.forEach(folder => {
      if (!acc[folder]) {
        acc[folder] = [];
      }
      if (file.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        acc[folder].push(file);
      }
    });
    return acc;
  }, {} as Record<string, SystemFile[]>);

  const handleFileSelect = (file: SystemFile, checked: boolean) => {
    if (checked) {
      setTempSelectedFiles([...tempSelectedFiles, file]);
    } else {
      setTempSelectedFiles(tempSelectedFiles.filter(f => f.id !== file.id));
    }
  };

  const toggleFolder = (folderName: string) => {
    setOpenFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  const handleSave = () => {
    const filesWithCategories = tempSelectedFiles.map(file => ({
      ...file,
      tags: [{ id: file.id, name: fileCategories[file.id] || FILE_CATEGORIES.OPTIONAL }]
    }));
    onFileSelect(filesWithCategories);
  };

  return (
    <div className="space-y-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">選擇文件</Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>選擇申請文件</SheetTitle>
            <SheetDescription>
              從檔案管理系統中選擇需要的文件
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜尋文件..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <ScrollArea className="h-[400px] mt-4">
            <div className="space-y-2">
              {Object.entries(filesByFolder).map(([folderName, folderFiles]) => (
                folderFiles.length > 0 && (
                  <Collapsible key={folderName} open={openFolders[folderName]}>
                    <CollapsibleTrigger 
                      className="flex items-center w-full p-2 hover:bg-accent rounded-lg"
                      onClick={() => toggleFolder(folderName)}
                    >
                      <Folder className="h-4 w-4 mr-2" />
                      <span className="flex-1 text-left">{folderName}</span>
                      {openFolders[folderName] ? (
                        <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-6 space-y-2">
                      {folderFiles.map((file) => (
                        <div key={file.id} className="flex flex-col gap-2 p-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={tempSelectedFiles.some(f => f.id === file.id)}
                                onCheckedChange={(checked) => handleFileSelect(file, checked as boolean)}
                              />
                              <span>{file.name}</span>
                            </div>
                          </div>
                          {tempSelectedFiles.some(f => f.id === file.id) && (
                            <Select
                              value={fileCategories[file.id]}
                              onValueChange={(value: FileCategory) => 
                                setFileCategories({...fileCategories, [file.id]: value})
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="選擇文件分類" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(FILE_CATEGORIES).map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )
              ))}
            </div>
          </ScrollArea>

          <SheetFooter className="mt-4">
            <Button onClick={handleSave}>確認選擇</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <div className="grid gap-2">
        {selectedFiles.map((file) => (
          <div key={file.id} className="flex items-center justify-between p-2 border rounded-lg">
            <div className="flex items-center gap-2">
              <span>{file.name}</span>
              {file.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
