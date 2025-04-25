
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SystemFile, FileTag } from '@/types/program';
import { toast } from 'sonner';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

interface FileContextType {
  systemFiles: SystemFile[];
  setSystemFiles: (files: SystemFile[]) => void;
  downloadFile: (fileId: number) => void;
  convertFile: (file: File, targetFormat: string) => Promise<File | null>;
  uploadFileWithConversion: (file: File, targetFormat?: string) => Promise<SystemFile | null>;
  generateDocxFromTemplate: (templateId: number, data: Record<string, string>) => Promise<Blob | null>;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [systemFiles, setSystemFiles] = useState<SystemFile[]>([]);

  const downloadFile = (fileId: number) => {
    const file = systemFiles.find(f => f.id === fileId);
    
    if (!file) {
      toast.error("檔案不存在");
      return;
    }

    toast.success(`正在下載: ${file.name}`);
    
    setTimeout(() => {
      const link = document.createElement('a');
      const blob = new Blob([`${file.name} 文件內容`], { type: 'text/plain' });
      link.href = URL.createObjectURL(blob);
      link.download = `${file.name}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`${file.name} 下載完成`);
    }, 1500);
  };

  const convertFile = async (file: File, targetFormat: string): Promise<File | null> => {
    try {
      toast.info(`正在將 ${file.name} 轉換為 ${targetFormat} 格式...`);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const originalExt = file.name.split('.').pop() || '';
      
      if (originalExt.toLowerCase() === targetFormat.toLowerCase()) {
        toast.info("檔案已經是目標格式，無需轉換");
        return file;
      }
      
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const newFileName = `${baseName}.${targetFormat}`;
      
      const fileContent = await file.arrayBuffer();
      
      const newFile = new File([fileContent], newFileName, { type: getMimeType(targetFormat) });
      
      toast.success(`檔案已成功轉換為 ${targetFormat} 格式`);
      return newFile;
    } catch (error) {
      console.error('檔案轉換失敗:', error);
      toast.error('檔案轉換失敗');
      return null;
    }
  };

  const parseTemplateMarkers = async (file: File): Promise<string[]> => {
    try {
      // 在實際實現中，這裡應該使用 docx 庫解析 Word 文件中的標記
      // 目前我們返回一些模擬的標記
      return ['{{姓名}}', '{{日期}}', '{{申請單位}}'];
    } catch (error) {
      console.error('解析模板標記失敗:', error);
      return [];
    }
  };

  const uploadFileWithConversion = async (file: File, targetFormat?: string): Promise<SystemFile | null> => {
    try {
      let fileToUpload = file;
      
      if (targetFormat) {
        const convertedFile = await convertFile(file, targetFormat);
        if (!convertedFile) {
          return null;
        }
        fileToUpload = convertedFile;
      }
      
      // 解析標記
      const markerStrings = await parseTemplateMarkers(fileToUpload);
      
      // 將字串標記轉換為 FileTag 物件陣列
      const fileTags: FileTag[] = markerStrings.map((marker, index) => ({
        id: Date.now() + index, // 使用時間戳加索引作為臨時 ID
        name: marker
      }));
      
      toast.info(`正在上傳 ${fileToUpload.name}...`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newFile: SystemFile = {
        id: Date.now(),
        name: fileToUpload.name,
        path: URL.createObjectURL(fileToUpload),
        size: fileToUpload.size,
        type: fileToUpload.type,
        uploadDate: new Date().toISOString(),
        folders: ['已上傳'],
        tags: fileTags
      };
      
      setSystemFiles(prevFiles => [...prevFiles, newFile]);
      
      toast.success(`${fileToUpload.name} 已成功上傳`);
      return newFile;
    } catch (error) {
      console.error('檔案上傳失敗:', error);
      toast.error('檔案上傳失敗');
      return null;
    }
  };

  const generateDocxFromTemplate = async (templateId: number, data: Record<string, string>): Promise<Blob | null> => {
    try {
      const templateFile = systemFiles.find(file => file.id === templateId);
      
      if (!templateFile) {
        toast.error("模板檔案不存在");
        return null;
      }
      
      toast.info("正在生成文件...");
      
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun("文件生成範例"),
                  new TextRun({
                    text: "\n\n",
                    break: 2,
                  }),
                ],
              }),
              ...Object.entries(data).map(([key, value]) => 
                new Paragraph({
                  children: [
                    new TextRun(`${key}: `),
                    new TextRun({
                      text: value,
                      bold: true,
                    }),
                  ],
                })
              ),
            ],
          },
        ],
      });
      
      const blob = await Packer.toBlob(doc);
      
      toast.success("文件生成成功");
      return blob;
    } catch (error) {
      console.error('文件生成失敗:', error);
      toast.error('文件生成失敗');
      return null;
    }
  };

  const getMimeType = (format: string): string => {
    switch (format.toLowerCase()) {
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'odt':
        return 'application/vnd.oasis.opendocument.text';
      case 'pdf':
        return 'application/pdf';
      default:
        return 'application/octet-stream';
    }
  };

  return (
    <FileContext.Provider value={{ 
      systemFiles, 
      setSystemFiles, 
      downloadFile, 
      convertFile,
      uploadFileWithConversion,
      generateDocxFromTemplate
    }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = () => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};
