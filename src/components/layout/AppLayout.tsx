
import React from 'react';
import { FileProvider } from '@/contexts/FileContext';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <FileProvider>
      {children}
    </FileProvider>
  );
};

