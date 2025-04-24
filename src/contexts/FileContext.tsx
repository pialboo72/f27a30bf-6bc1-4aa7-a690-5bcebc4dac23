
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SystemFile } from '@/types/program';
import { toast } from 'sonner';

interface FileContextType {
  systemFiles: SystemFile[];
  setSystemFiles: (files: SystemFile[]) => void;
  downloadFile: (fileId: string) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [systemFiles, setSystemFiles] = useState<SystemFile[]>([]);

  // Function to simulate file download
  const downloadFile = (fileId: string) => {
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
      link.href = file.url || '#'; // Use the file URL if available or a placeholder
      link.setAttribute('download', file.name);
      
      // For demo purposes, if there's no real URL, create a small text file
      if (!file.url) {
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
