
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SystemFile } from '@/types/program';
import { toast } from 'sonner';

interface FileContextType {
  systemFiles: SystemFile[];
  setSystemFiles: (files: SystemFile[]) => void;
  downloadFile: (fileId: number) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [systemFiles, setSystemFiles] = useState<SystemFile[]>([]);

  // Function to simulate file download
  const downloadFile = (fileId: number) => {
    // Find the file in system files
    const file = systemFiles.find(f => f.id === fileId);
    
    if (!file) {
      toast.error("檔案不存在");
      return;
    }

    // In a real application, this would trigger an actual file download
    // from the server or storage service. Here we'll simulate it.
    toast.success(`正在下載: ${file.name}`);
    
    // Simulate download process with a timeout
    setTimeout(() => {
      // Create a dummy download element
      const link = document.createElement('a');
      // Use file path as the "url" since the SystemFile doesn't have a url property
      link.href = file.path || '#'; // Use the file path if available or a placeholder
      link.setAttribute('download', file.name);
      
      // For demo purposes, if there's no real path, create a small text file
      if (!file.path) {
        const blob = new Blob([`This is a sample content for ${file.name}`], { type: 'text/plain' });
        link.href = URL.createObjectURL(blob);
      }
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      toast.success(`${file.name} 下載完成`);
    }, 1500);
  };

  return (
    <FileContext.Provider value={{ systemFiles, setSystemFiles, downloadFile }}>
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
