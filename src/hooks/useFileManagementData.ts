
import { useState, useEffect } from "react";
import { useFiles } from '@/contexts/FileContext';

// 模擬資料
const mockFolders = [
  { id: 1, name: "申請表格範本", created: "2025-03-01", fileCount: 5 },
  { id: 2, name: "活動相關文件", created: "2025-03-15", fileCount: 3 },
  { id: 3, name: "宣傳資料", created: "2025-03-20", fileCount: 7 }
];

const mockFiles = [
  { 
    id: 1, 
    name: "文化部藝術補助申請表", 
    path: "/files/application-form.docx",
    tags: [{ id: 1, name: "申請表格" }],
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 245000,
    uploadDate: "2025-03-05",
    originalType: "docx", 
    uploaded: "2025-03-05", 
    folders: ["申請表格範本"],
    availableFormats: ["docx", "odt", "pdf"]
  },
  { 
    id: 2, 
    name: "經費核銷表", 
    path: "/files/expense-form.xlsx",
    tags: [{ id: 2, name: "財務" }],
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 120000,
    uploadDate: "2025-03-10",
    originalType: "xlsx", 
    uploaded: "2025-03-10", 
    folders: ["申請表格範本"],
    availableFormats: ["xlsx", "ods", "pdf"]
  },
  { 
    id: 3, 
    name: "活動場地規劃", 
    path: "/files/venue-plan.pdf",
    tags: [{ id: 3, name: "活動" }],
    type: "application/pdf",
    size: 1200000,
    uploadDate: "2025-03-18",
    originalType: "pdf", 
    uploaded: "2025-03-18", 
    folders: ["活動相關文件", "宣傳資料"],
    availableFormats: ["pdf"]
  },
  { 
    id: 4, 
    name: "宣傳海報範例", 
    path: "/files/poster-sample.jpg",
    tags: [{ id: 4, name: "宣傳" }],
    type: "image/jpeg",
    size: 3500000,
    uploadDate: "2025-03-22",
    originalType: "jpg", 
    uploaded: "2025-03-22", 
    folders: ["宣傳資料"],
    availableFormats: ["jpg", "png", "pdf"]
  }
];

export function useFileManagementData() {
  const { setSystemFiles } = useFiles();
  const [folders, setFolders] = useState(mockFolders);
  const [files, setFiles] = useState<any[]>(mockFiles as any[]);

  useEffect(() => {
    setSystemFiles(files as any);
  }, [files, setSystemFiles]);

  const folderList = folders.map(folder => ({
    ...folder,
    fileCount: files.filter(file => file.folders.includes(folder.name)).length
  }));

  const filesWithUploadDate = files.map(f => ({
    ...f,
    uploadDate: f.uploadDate || f.uploaded || ""
  }));

  return {
    folders,
    setFolders,
    files,
    setFiles,
    folderList,
    filesWithUploadDate
  };
}
