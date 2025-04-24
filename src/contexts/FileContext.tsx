
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SystemFile } from '@/types/program';

interface FileContextType {
  systemFiles: SystemFile[];
  setSystemFiles: (files: SystemFile[]) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [systemFiles, setSystemFiles] = useState<SystemFile[]>([]);

  return (
    <FileContext.Provider value={{ systemFiles, setSystemFiles }}>
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

