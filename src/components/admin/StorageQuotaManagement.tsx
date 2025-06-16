
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { HardDrive, Edit2, Save, X } from "lucide-react";
import { toast } from "sonner";

interface UnitStorageQuota {
  id: number;
  unitName: string;
  usedStorage: number; // in MB
  maxStorage: number; // in MB
  fileCount: number;
}

const mockStorageData: UnitStorageQuota[] = [
  { id: 1, unitName: "文化部", usedStorage: 250, maxStorage: 1000, fileCount: 15 },
  { id: 2, unitName: "教育部", usedStorage: 800, maxStorage: 1500, fileCount: 32 },
  { id: 3, unitName: "內政部", usedStorage: 450, maxStorage: 800, fileCount: 21 },
  { id: 4, unitName: "經濟部", usedStorage: 120, maxStorage: 500, fileCount: 8 },
];

const StorageQuotaManagement: React.FC = () => {
  const [storageData, setStorageData] = useState<UnitStorageQuota[]>(mockStorageData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const formatSize = (sizeInMB: number): string => {
    if (sizeInMB >= 1024) {
      return `${(sizeInMB / 1024).toFixed(1)} GB`;
    }
    return `${sizeInMB} MB`;
  };

  const getUsagePercentage = (used: number, max: number): number => {
    return Math.round((used / max) * 100);
  };

  const getUsageColor = (percentage: number): string => {
    if (percentage >= 90) return "text-red-500";
    if (percentage >= 70) return "text-yellow-500";
    return "text-green-500";
  };

  const handleEdit = (id: number, currentValue: number) => {
    setEditingId(id);
    setEditValue(currentValue.toString());
  };

  const handleSave = (id: number) => {
    const newValue = parseInt(editValue);
    if (isNaN(newValue) || newValue <= 0) {
      toast.error("請輸入有效的容量數值");
      return;
    }

    setStorageData(prev => prev.map(item => 
      item.id === id ? { ...item, maxStorage: newValue } : item
    ));
    setEditingId(null);
    setEditValue("");
    toast.success("容量限制已更新");
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <HardDrive className="mr-2 h-5 w-5" />
          單位檔案容量管理
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {storageData.map((unit) => {
            const percentage = getUsagePercentage(unit.usedStorage, unit.maxStorage);
            const isEditing = editingId === unit.id;
            
            return (
              <div key={unit.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-lg">{unit.unitName}</h3>
                    <p className="text-sm text-muted-foreground">
                      檔案數量: {unit.fileCount} 個
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={percentage >= 90 ? "destructive" : percentage >= 70 ? "secondary" : "default"}>
                      {percentage}% 已使用
                    </Badge>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(unit.id, unit.maxStorage)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSave(unit.id)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={getUsageColor(percentage)}>
                      已使用: {formatSize(unit.usedStorage)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span>最大容量:</span>
                      {isEditing ? (
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          placeholder="MB"
                          className="w-20 h-6 text-xs"
                          type="number"
                          min="1"
                        />
                      ) : (
                        <span>{formatSize(unit.maxStorage)}</span>
                      )}
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageQuotaManagement;
