
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SystemFile } from '@/types/program';
import { toast } from 'sonner';
import { Document, Packer, Paragraph, TextRun } from 'docx';

interface FileContextType {
  systemFiles: SystemFile[];
  setSystemFiles: (files: SystemFile[]) => void;
  downloadFile: (fileId: number) => void;
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

  return (
    <FileContext.Provider value={{
      systemFiles,
      setSystemFiles,
      downloadFile,
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
