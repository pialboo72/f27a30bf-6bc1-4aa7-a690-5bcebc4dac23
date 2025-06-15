import { useFiles } from "@/contexts/FileContext";
import { toast } from "sonner";
import { SystemFile, FileTag } from "@/types/program";
import { parseTemplateMarkers } from "@/utils/templateParser";

/**
 * Hook to handle file uploads with conversion and category.
 */
export const useFileUpload = () => {
  const { setSystemFiles } = useFiles();

  // File format conversion
  const convertFile = async (file: File, targetFormat: string): Promise<File | null> => {
    try {
      toast.info(`正在將 ${file.name} 轉換為 ${targetFormat} 格式...`);

      await new Promise(resolve => setTimeout(resolve, 1500));

      const originalExt = file.name.split('.').pop() || '';

      if (originalExt.toLowerCase() === targetFormat.toLowerCase()) {
        toast.info("檔案已經是目標格式，無需轉換");
        return file;
      }

      const baseName =
        file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const newFileName = `${baseName}.${targetFormat}`;

      const fileContent = await file.arrayBuffer();

      const newFile = new File([fileContent], newFileName, {
        type: getMimeType(targetFormat),
      });

      toast.success(`檔案已成功轉換為 ${targetFormat} 格式`);
      return newFile;
    } catch (error) {
      console.error("檔案轉換失敗:", error);
      toast.error("檔案轉換失敗");
      return null;
    }
  };

  // Upload file (with optional conversion and category)
  const uploadFileWithConversion = async (
    file: File,
    targetFormat?: string,
    category?: string
  ): Promise<SystemFile | null> => {
    try {
      let fileToUpload = file;

      if (targetFormat) {
        const convertedFile = await convertFile(file, targetFormat);
        if (!convertedFile) {
          return null;
        }
        fileToUpload = convertedFile;
      }

      // 標記解析（用 utility）
      const markerStrings = await parseTemplateMarkers(fileToUpload);

      const fileTags: FileTag[] = markerStrings.map((marker, index) => ({
        id: Date.now() + index,
        name: marker,
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
        folders: ["已上傳"],
        tags: fileTags,
        category, // 分群
      };

      setSystemFiles(prevFiles => [...prevFiles, newFile]);

      toast.success(`${fileToUpload.name} 已成功上傳`);
      return newFile;
    } catch (error) {
      console.error("檔案上傳失敗:", error);
      toast.error("檔案上傳失敗");
      return null;
    }
  };

  const getMimeType = (format: string): string => {
    switch (format.toLowerCase()) {
      case "docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      case "odt":
        return "application/vnd.oasis.opendocument.text";
      case "pdf":
        return "application/pdf";
      default:
        return "application/octet-stream";
    }
  };

  return {
    convertFile,
    uploadFileWithConversion,
  };
};
