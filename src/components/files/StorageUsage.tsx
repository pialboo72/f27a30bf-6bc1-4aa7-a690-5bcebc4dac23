
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HardDrive } from "lucide-react";

interface StorageUsageProps {
  usedStorage: number; // in MB
  maxStorage: number; // in MB
  fileCount: number;
}

const StorageUsage: React.FC<StorageUsageProps> = ({ usedStorage, maxStorage, fileCount }) => {
  const formatSize = (sizeInMB: number): string => {
    if (sizeInMB >= 1024) {
      return `${(sizeInMB / 1024).toFixed(1)} GB`;
    }
    return `${sizeInMB} MB`;
  };

  const percentage = Math.round((usedStorage / maxStorage) * 100);
  const getUsageColor = (percentage: number): string => {
    if (percentage >= 90) return "text-red-500";
    if (percentage >= 70) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <HardDrive className="mr-2 h-5 w-5" />
          儲存空間使用狀況
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className={`font-medium ${getUsageColor(percentage)}`}>
              已使用: {formatSize(usedStorage)}
            </span>
            <span className="text-muted-foreground">
              總容量: {formatSize(maxStorage)}
            </span>
          </div>
          <Progress value={percentage} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>檔案數量: {fileCount} 個</span>
            <span className={getUsageColor(percentage)}>
              {percentage}% 已使用
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageUsage;
