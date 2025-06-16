
import { useState } from "react";
import { useFileManagementData } from "./useFileManagementData";
import { useFileManagementActions } from "./useFileManagementActions";
import { useFiles } from '@/contexts/FileContext';

export function useFileManagementState() {
  const { setSystemFiles } = useFiles();
  const { folders, setFolders, files, setFiles, folderList, filesWithUploadDate } = useFileManagementData();
  const actions = useFileManagementActions(files, setFiles, folders, setFolders, setSystemFiles);
  
  const [activeTab, setActiveTab] = useState("all");
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

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === "全部" || file.folders.includes(selectedFolder);
    return matchesSearch && matchesFolder;
  });

  const filteredFilesWithUploadDate = filteredFiles.map(f => ({
    ...f,
    uploadDate: f.uploadDate || f.uploaded || ""
  }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    actions.handleFileChange(e, setSelectedFile);
  };

  const handleFileUpload = () => {
    actions.handleFileUpload(selectedFile, selectedFolder);
    setUploadDialogOpen(false);
    setSelectedFile(null);
  };

  const handleAddFolder = () => {
    actions.handleAddFolder(newFolderName);
    setFolderDialogOpen(false);
    setNewFolderName("");
  };

  const handleAskDeleteFile = (id: number, name: string) => {
    setDeleteTargetFile({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeleteFile = () => {
    actions.handleConfirmDeleteFile(deleteTargetFile);
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
  };

  return {
    activeTab, setActiveTab,
    folders, setFolders,
    filesWithUploadDate,
    filteredFilesWithUploadDate,
    searchTerm, setSearchTerm,
    uploadDialogOpen, setUploadDialogOpen,
    folderDialogOpen, setFolderDialogOpen,
    folderSelectDialogOpen, setFolderSelectDialogOpen,
    selectedFile, setSelectedFile,
    newFolderName, setNewFolderName,
    selectedFolder, setSelectedFolder,
    fileInProcess, setFileInProcess,
    selectedFolders, setSelectedFolders,
    deleteDialogOpen, setDeleteDialogOpen,
    deleteTargetFile, setDeleteTargetFile,
    folderList,
    handleFileChange,
    handleFileUpload,
    handleAddFolder,
    handleAskDeleteFile,
    handleConfirmDeleteFile,
    handleOpenFolderSelect,
    toggleFolderSelection,
    saveFileFolders,
    downloadFile: actions.downloadFile,
    fileConversions: actions.fileConversions
  };
}
