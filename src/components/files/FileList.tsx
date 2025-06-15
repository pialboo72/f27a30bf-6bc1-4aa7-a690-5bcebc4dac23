
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { File, X, Download, CheckSquare, Folder } from "lucide-react";

interface FileTypeColorMap { [key: string]: string }
const fileTypeColors: FileTypeColorMap = {
  docx: "text-blue-500",
  xlsx: "text-green-500",
  pdf: "text-red-500",
  jpg: "text-purple-500",
  png: "text-yellow-500",
  odt: "text-blue-400",
  ods: "text-green-400",
};

export type FileForList = {
  id: number,
  name: string,
  path: string,
  tags: { id: number, name: string }[],
  type: string,
  size: number,
  uploadDate: string,
  originalType: string,
  uploaded: string,
  folders: string[],
  availableFormats: string[]
};

interface FileListProps {
  files: FileForList[];
  filteredFiles: FileForList[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  handleAskDeleteFile: (id: number, name: string) => void;
  handleOpenFolderSelect: (file: FileForList) => void;
  downloadFile: (fileName: string, fileType: string) => void;
  folders: { id: number; name: string }[];
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const FileList: React.FC<FileListProps> = ({
  files,
  filteredFiles,
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  handleAskDeleteFile,
  handleOpenFolderSelect,
  downloadFile,
  folders
}) => {
  return (
    <Card className="md:col-span-3">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">檔案列表</CardTitle>
          <div className="relative w-64">
            <Input
              placeholder="搜尋檔案..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="w-full justify-start border-b rounded-none">
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="docs">文件</TabsTrigger>
              <TabsTrigger value="images">圖片</TabsTrigger>
              <TabsTrigger value="others">其他</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="m-0">
            {filteredFiles.length > 0 ? (
              <div className="divide-y">
                {filteredFiles.map(file => (
                  <div key={file.id} className="p-4 hover:bg-muted/50">
                    <div className="flex items-center mb-2">
                      <div className="mr-4">
                        <File className={`h-8 w-8 ${fileTypeColors[file.originalType] || "text-gray-500"}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{file.name}</p>
                        <div className="flex flex-wrap text-xs text-muted-foreground mt-1">
                          <span className="mr-3">大小: {formatFileSize(file.size)}</span>
                          <span className="mr-3">上傳於: {file.uploaded}</span>
                          <span className="mr-3">原始格式: {file.originalType}</span>
                          <span
                            className="cursor-pointer text-primary"
                            onClick={() => handleOpenFolderSelect(file)}
                          >
                            資料夾: {file.folders.join(", ")}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleAskDeleteFile(file.id, file.name)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {file.availableFormats.map(format => (
                        <Button
                          key={format}
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                          onClick={() => downloadFile(file.name, format)}
                        >
                          <Download className="mr-1 h-4 w-4" />
                          <span>下載 {format.toUpperCase()}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <File className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">沒有找到檔案</h3>
                <p className="text-sm text-muted-foreground">
                  上傳新檔案或嘗試其他搜索條件
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="docs" className="m-0 py-4 px-6">
            <div className="text-center p-8">
              <p>文件分類檢視</p>
            </div>
          </TabsContent>

          <TabsContent value="images" className="m-0 py-4 px-6">
            <div className="text-center p-8">
              <p>圖片分類檢視</p>
            </div>
          </TabsContent>

          <TabsContent value="others" className="m-0 py-4 px-6">
            <div className="text-center p-8">
              <p>其他檔案分類檢視</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FileList;
