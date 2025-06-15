
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SystemFile } from '@/types/program';
import { toast } from 'sonner';
import { Document, Packer, Paragraph, TextRun } from 'docx';

interface FileContextType {
  systemFiles: SystemFile[];
  setSystemFiles: React.Dispatch<React.SetStateAction<SystemFile[]>>;
  downloadFile: (fileId: number) => void;
  generateDocxFromTemplate: (templateId: number, data: Record<string, string>) => Promise<Blob | null>;
  deleteSystemFile: (fileId: number) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

// ====== 預設三組範例模板（供參考）======
const nowStr = new Date().toISOString();
const EXAMPLE_FILES: SystemFile[] = [
  {
    id: 1001,
    name: "單位申請書範例.docx",
    path: "", // 實際應用會在 upload 時加 URL，可留空
    size: 12345,
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    uploadDate: nowStr,
    folders: ["已上傳"],
    tags: [
      { id: 1, name: "{{單位名稱}}" },
      { id: 2, name: "{{申請日期}}" },
    ],
    category: "unit"
  },
  {
    id: 1002,
    name: "共通項目範例.docx",
    path: "",
    size: 23456,
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    uploadDate: nowStr,
    folders: ["已上傳"],
    tags: [
      { id: 3, name: "{{負責人}}" },
      { id: 4, name: "{{聯絡電話}}" },
    ],
    category: "common"
  },
  {
    id: 1003,
    name: "個別補助案範本.docx",
    path: "",
    size: 34567,
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    uploadDate: nowStr,
    folders: ["已上傳"],
    tags: [
      { id: 5, name: "{{申請單位}}" },
      { id: 6, name: "{{案號}}" },
      { id: 7, name: "{{專案名稱}}" },
    ],
    category: "program"
  }
];
// =======================================

export const FileProvider = ({ children }: { children: ReactNode }) => {
  // 在初始狀態加入範例模板
  const [systemFiles, setSystemFiles] = useState<SystemFile[]>(EXAMPLE_FILES);

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

  const deleteSystemFile = (fileId: number) => {
    setSystemFiles((prev) => prev.filter(f => f.id !== fileId));
    toast.success("模板已刪除");
  };

  return (
    <FileContext.Provider value={{
      systemFiles,
      setSystemFiles,
      downloadFile,
      generateDocxFromTemplate,
      deleteSystemFile
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

// ... 其餘內容維持不變

