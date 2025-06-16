
import { toast } from "sonner";

const fileConversions: {[key: string]: string[]} = {
  docx: ["docx", "odt", "pdf"],
  odt: ["odt", "docx", "pdf"],
  xlsx: ["xlsx", "ods", "pdf"],
  ods: ["ods", "xlsx", "pdf"],
};

export function useFileManagementActions(files: any[], setFiles: (files: any[]) => void, folders: any[], setFolders: (folders: any[]) => void, setSystemFiles: (files: any[]) => void) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setSelectedFile: (file: File | null) => void) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = (selectedFile: File | null, selectedFolder: string) => {
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
    } else {
      toast.error("請先選擇檔案");
    }
  };

  const handleAddFolder = (newFolderName: string) => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now(),
        name: newFolderName.trim(),
        created: new Date().toISOString().split('T')[0],
        fileCount: 0
      };
      setFolders([...folders, newFolder]);
      toast.success(`已新增資料夾: ${newFolderName}`);
    } else {
      toast.error("資料夾名稱不能為空");
    }
  };

  const handleConfirmDeleteFile = (deleteTargetFile: {id: number, name: string} | null) => {
    if (deleteTargetFile) {
      const updatedFiles = files.filter(file => file.id !== deleteTargetFile.id);
      setFiles(updatedFiles);
      setSystemFiles(updatedFiles);
      toast.success("已刪除檔案");
    }
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
    handleFileChange,
    handleFileUpload,
    handleAddFolder,
    handleConfirmDeleteFile,
    downloadFile,
    fileConversions
  };
}
