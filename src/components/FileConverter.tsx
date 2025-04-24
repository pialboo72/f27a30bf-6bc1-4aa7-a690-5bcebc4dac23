
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Download } from "lucide-react";
import { toast } from "sonner";
import { useFiles } from "@/contexts/FileContext";

interface FileConverterProps {
  onFileConverted?: (file: File) => void;
}

export const FileConverter = ({ onFileConverted }: FileConverterProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>("docx");
  const [isConverting, setIsConverting] = useState(false);
  
  const { convertFile } = useFiles();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleConvert = async () => {
    if (!file) {
      toast.error("請先選擇檔案");
      return;
    }
    
    setIsConverting(true);
    
    try {
      const convertedFile = await convertFile(file, targetFormat);
      
      if (convertedFile && onFileConverted) {
        onFileConverted(convertedFile);
      }
      
      if (convertedFile) {
        // 建立下載連結
        const url = URL.createObjectURL(convertedFile);
        const link = document.createElement('a');
        link.href = url;
        link.download = convertedFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success(`檔案已轉換為 ${targetFormat} 格式並下載`);
      }
    } catch (error) {
      console.error(error);
      toast.error("檔案轉換失敗");
    } finally {
      setIsConverting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>檔案格式轉換</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-upload">選擇檔案</Label>
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            accept=".docx,.odt,.pdf,.txt"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="target-format">目標格式</Label>
          <Select value={targetFormat} onValueChange={setTargetFormat}>
            <SelectTrigger id="target-format">
              <SelectValue placeholder="選擇目標格式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="docx">Word 文件 (DOCX)</SelectItem>
              <SelectItem value="odt">OpenDocument 文本 (ODT)</SelectItem>
              <SelectItem value="pdf">PDF 文件</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleConvert} 
          disabled={!file || isConverting}
        >
          {isConverting ? "轉換中..." : "轉換檔案"}
          {isConverting ? <Download className="ml-2 h-4 w-4 animate-bounce" /> : <Download className="ml-2 h-4 w-4" />}
        </Button>
        
        {file && (
          <div className="text-sm text-gray-500">
            已選擇: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </div>
        )}
      </CardContent>
    </Card>
  );
};
