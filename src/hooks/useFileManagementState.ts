
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useFiles } from '@/contexts/FileContext';
import { SystemFile } from '@/types/program';

// 模擬資料
const fileConversions: {[key: string]: string[]} = {
  docx: ["docx", "odt", "pdf"],
  odt: ["odt", "docx", "pdf"],
  xlsx: ["xlsx", "ods", "pdf"],
  ods: ["ods", "xlsx", "pdf"],
};

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

export function useFileManagementState() {
  const { setSystemFiles } = useFiles();
  const [activeTab, setActiveTab] = useState("all");
  const [folders, setFolders] = useState(mockFolders);
  const [files, setFiles] = useState<any[]>(mockFiles as any[]);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [folderSelectDialogOpen, setFolderSelectDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("全部");
  const [fileInProcess, setFileInProcess] = useState<any | null>(null);
  const [selectedFolders, setSelectedFolders] = useState<{[key: string]: boolean}>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetFile, setDeleteTargetFile] = useState<null | { id: number, name: string }>(null);

  useEffect(() => {
    setSystemFiles(files as any);
  }, [files, setSystemFiles]);

  const folderList = folders.map(folder => ({
    ...folder,
    fileCount: files.filter(file => file.folders.includes(folder.name)).length
  }));

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === "全部" || file.folders.includes(selectedFolder);
    return matchesSearch && matchesFolder;
  });

  // 保證 uploadDate 不會缺漏
  const filesWithUploadDate = files.map(f => ({
    ...f,
    uploadDate: f.uploadDate || f.uploaded || ""
  }));

  const filteredFilesWithUploadDate = filteredFiles.map(f => ({
    ...f,
    uploadDate: f.uploadDate || f.uploaded || ""
  }));

  // 所有邏輯事件 function：
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const handleFileUpload = () => {
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop() || "unknown";
      const fileName = selectedFile.name.split('.')[0];

      const supportsConversion = fileType in fileConversions;
      const filesToUpload: any[] = [
        {
          id: Date.now(),
          name: fileName,
          path: `/files/${fileName.toLowerCase().replace(/\s+/g, '-')}.${fileType}`,
          tags: [{ id: Date.now(), name: selectedFolder === "全部" ? "未分類" : selectedFolder }],
          type: getMimeType(fileType),
          size: selectedFile.size,
          uploadDate: new Date().toISOString().split('T')[0],
          originalType: fileType,
          uploaded: new Date().toISOString().split('T')[0],
          folders: selectedFolder === "全部" ? ["未分類"] : [selectedFolder],
          availableFormats: supportsConversion ? fileConversions[fileType] : [fileType]
        }
      ];
      if (supportsConversion) {
        fileConversions[fileType]?.forEach((format, idx) => {
          if (format !== fileType) {
            filesToUpload.push({
              id: Date.now() + idx + 1,
              name: fileName,
              path: `/files/${fileName.toLowerCase().replace(/\s+/g, '-')}.${format}`,
              tags: [{ id: Date.now() + idx + 1, name: selectedFolder === "全部" ? "未分類" : selectedFolder }],
              type: getMimeType(format),
              size: selectedFile.size,
              uploadDate: new Date().toISOString().split('T')[0],
              originalType: format,
              uploaded: new Date().toISOString().split('T')[0],
              folders: selectedFolder === "全部" ? ["未分類"] : [selectedFolder],
              availableFormats: [format]
            });
          }
        });
      }
      const updatedFiles = [...files, ...filesToUpload];
      setFiles(updatedFiles);
      setSystemFiles(updatedFiles as any);
      let successMessage = `成功上傳檔案: ${fileName}.${fileType}`;
      if (supportsConversion) {
        successMessage += `\n並自動轉換為 ${fileConversions[fileType].filter(f => f !== fileType).join(', ')} 格式`;
      }
      toast.success(successMessage);
      setUploadDialogOpen(false);
      setSelectedFile(null);
    } else {
      toast.error("請先選擇檔案");
    }
  };

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now(),
        name: newFolderName.trim(),
        created: new Date().toISOString().split('T')[0],
        fileCount: 0
      };
      setFolders([...folders, newFolder]);
      toast.success(`已新增資料夾: ${newFolderName}`);
      setFolderDialogOpen(false);
      setNewFolderName("");
    } else {
      toast.error("資料夾名稱不能為空");
    }
  };
  const handleAskDeleteFile = (id: number, name: string) => {
    setDeleteTargetFile({ id, name });
    setDeleteDialogOpen(true);
  };
  const handleConfirmDeleteFile = () => {
    if (deleteTargetFile) {
      const updatedFiles = files.filter(file => file.id !== deleteTargetFile.id);
      setFiles(updatedFiles);
      setSystemFiles(updatedFiles);
      toast.success("已刪除檔案");
    }
    setDeleteDialogOpen(false);
    setDeleteTargetFile(null);
  };
  const handleOpenFolderSelect = (file: any) => {
    setFileInProcess(file);
    const initialSelection: {[key: string]: boolean} = {};
    folders.forEach(folder => {
      initialSelection[folder.name] = file.folders.includes(folder.name);
    });
    setSelectedFolders(initialSelection);
    setFolderSelectDialogOpen(true);
  };
  const toggleFolderSelection = (folderName: string) => {
    setSelectedFolders({
      ...selectedFolders,
      [folderName]: !selectedFolders[folderName]
    });
  };
  const saveFileFolders = () => {
    if (!fileInProcess) return;
    const selectedFolderNames = Object.keys(selectedFolders).filter(
      folderName => selectedFolders[folderName]
    );
    if (selectedFolderNames.length === 0) {
      selectedFolderNames.push("未分類");
    }
    const updatedFiles = files.map(file => {
      if (file.id === fileInProcess.id) {
        return {
          ...file,
          folders: selectedFolderNames,
          tags: [...file.tags, ...selectedFolderNames.map((name, index) => ({
            id: file.id * 100 + index,
            name
          }))].slice(0, selectedFolderNames.length)
        };
      }
      return file;
    });
    setFiles(updatedFiles);
    setSystemFiles(updatedFiles as any);
    setFolderSelectDialogOpen(false);
    setFileInProcess(null);
    toast.success("檔案資料夾已更新");
  };
  const downloadFile = (fileName: string, fileType: string) => {
    toast.success(`開始下載 ${fileName}.${fileType}`);
  };
  const getMimeType = (extension: string): string => {
    const mimeTypes: {[key: string]: string} = {
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      odt: "application/vnd.oasis.opendocument.text",
      ods: "application/vnd.oasis.opendocument.spreadsheet",
      txt: "text/plain"
    };
    return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
  };

  return {
    activeTab,
    setActiveTab,
    folders,
    setFolders,
    filesWithUploadDate,
    filteredFilesWithUploadDate,
    searchTerm,
    setSearchTerm,
    uploadDialogOpen,
    setUploadDialogOpen,
    folderDialogOpen,
    setFolderDialogOpen,
    folderSelectDialogOpen,
    setFolderSelectDialogOpen,
    selectedFile,
    setSelectedFile,
    newFolderName,
    setNewFolderName,
    selectedFolder,
    setSelectedFolder,
    fileInProcess,
    setFileInProcess,
    selectedFolders,
    setSelectedFolders,
    deleteDialogOpen,
    setDeleteDialogOpen,
    deleteTargetFile,
    setDeleteTargetFile,
    folderList,
    handleFileChange,
    handleFileUpload,
    handleAddFolder,
    handleAskDeleteFile,
    handleConfirmDeleteFile,
    handleOpenFolderSelect,
    toggleFolderSelection,
    saveFileFolders,
    downloadFile,
    fileConversions
  };
}
