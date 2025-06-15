
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Folder } from "lucide-react";

interface FolderSidebarProps {
  folders: { id: number; name: string; created: string; fileCount: number }[];
  selectedFolder: string;
  setSelectedFolder: (folder: string) => void;
}

const FolderSidebar: React.FC<FolderSidebarProps> = ({
  folders,
  selectedFolder,
  setSelectedFolder,
}) => {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg">資料夾</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1 p-2">
          <Button
            variant={selectedFolder === "全部" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setSelectedFolder("全部")}
          >
            <Folder className="mr-2 h-4 w-4" />
            全部檔案
          </Button>
          {folders.map((folder) => (
            <Button
              key={folder.id}
              variant={selectedFolder === folder.name ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedFolder(folder.name)}
            >
              <Folder className="mr-2 h-4 w-4" />
              {folder.name}
              <span className="ml-auto text-xs text-muted-foreground">
                {folder.fileCount}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FolderSidebar;
