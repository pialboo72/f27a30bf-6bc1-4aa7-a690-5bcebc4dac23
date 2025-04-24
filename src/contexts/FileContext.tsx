
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SystemFile } from '@/types/program';
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

  // 檔案下載功能
  const downloadFile = (fileId: number) => {
    // Find the file in system files
    const file = systemFiles.find(f => f.id === fileId);
    
    if (!file) {
      toast.error("檔案不存在");
      return;
    }

    toast.success(`正在下載: ${file.name}`);
    
    // 模擬下載過程
    setTimeout(() => {
      // 建立下載元素
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

  // 檔案轉換功能
  const convertFile = async (file: File, targetFormat: string): Promise<File | null> => {
    // 在實際應用中，這裡應該調用後端 API 來處理檔案轉換
    // 這裡使用模擬方式實現
    
    try {
      toast.info(`正在將 ${file.name} 轉換為 ${targetFormat} 格式...`);
      
      // 模擬轉換過程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 取得檔案副檔名
      const originalExt = file.name.split('.').pop() || '';
      
      // 如果原始檔案格式與目標格式相同，則不需轉換
      if (originalExt.toLowerCase() === targetFormat.toLowerCase()) {
        toast.info("檔案已經是目標格式，無需轉換");
        return file;
      }
      
      // 建立新檔名
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const newFileName = `${baseName}.${targetFormat}`;
      
      // 讀取原始檔案內容
      const fileContent = await file.arrayBuffer();
      
      // 建立新檔案
      const newFile = new File([fileContent], newFileName, { type: getMimeType(targetFormat) });
      
      toast.success(`檔案已成功轉換為 ${targetFormat} 格式`);
      return newFile;
    } catch (error) {
      console.error('檔案轉換失敗:', error);
      toast.error('檔案轉換失敗');
      return null;
    }
  };

  // 上傳檔案並自動轉換
  const uploadFileWithConversion = async (file: File, targetFormat?: string): Promise<SystemFile | null> => {
    try {
      let fileToUpload = file;
      
      // 如果指定了目標格式，則進行轉換
      if (targetFormat) {
        const convertedFile = await convertFile(file, targetFormat);
        if (!convertedFile) {
          return null;
        }
        fileToUpload = convertedFile;
      }
      
      // 模擬上傳到服務器
      toast.info(`正在上傳 ${fileToUpload.name}...`);
      
      // 等待一小段時間模擬上傳過程
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 建立新的系統檔案記錄
      const newFile: SystemFile = {
        id: Date.now(),
        name: fileToUpload.name,
        path: URL.createObjectURL(fileToUpload),
        size: fileToUpload.size,
        type: fileToUpload.type,
        uploadDate: new Date().toISOString(),
        folders: ['已上傳'],
        tags: []
      };
      
      // 更新系統檔案列表
      setSystemFiles(prevFiles => [...prevFiles, newFile]);
      
      toast.success(`${fileToUpload.name} 已成功上傳`);
      return newFile;
    } catch (error) {
      console.error('檔案上傳失敗:', error);
      toast.error('檔案上傳失敗');
      return null;
    }
  };

  // 從模板生成 docx 文件
  const generateDocxFromTemplate = async (templateId: number, data: Record<string, string>): Promise<Blob | null> => {
    try {
      // 尋找模板檔案
      const templateFile = systemFiles.find(file => file.id === templateId);
      
      if (!templateFile) {
        toast.error("模板檔案不存在");
        return null;
      }
      
      toast.info("正在生成文件...");
      
      // 在實際應用中，應該讀取模板檔案內容並替換標記
      // 這裡使用 docx 套件直接生成新文件作為示範
      
      // 建立文件
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
      
      // 生成 docx 檔案
      const blob = await Packer.toBlob(doc);
      
      toast.success("文件生成成功");
      return blob;
    } catch (error) {
      console.error('文件生成失敗:', error);
      toast.error('文件生成失敗');
      return null;
    }
  };

  // 獲取MIME類型
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
