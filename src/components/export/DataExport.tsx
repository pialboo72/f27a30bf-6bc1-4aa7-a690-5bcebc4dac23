
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Download, FileSpreadsheet, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";

interface ExportOptions {
  format: 'excel' | 'csv' | 'pdf';
  dataType: 'applications' | 'activities' | 'users' | 'statistics';
  dateRange: { start: Date; end: Date } | null;
  includeFields: string[];
}

const DataExport: React.FC = () => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'excel',
    dataType: 'applications',
    dateRange: null,
    includeFields: []
  });

  const dataTypeOptions = [
    { value: 'applications', label: '申請資料', icon: FileText },
    { value: 'activities', label: '活動資料', icon: Calendar },
    { value: 'users', label: '用戶資料', icon: FileText },
    { value: 'statistics', label: '統計報表', icon: FileSpreadsheet }
  ];

  const getAvailableFields = (dataType: string) => {
    switch (dataType) {
      case 'applications':
        return [
          { id: 'title', label: '申請標題' },
          { id: 'category', label: '申請類別' },
          { id: 'status', label: '申請狀態' },
          { id: 'submitDate', label: '提交日期' },
          { id: 'amount', label: '申請金額' },
          { id: 'applicant', label: '申請人' },
          { id: 'organization', label: '申請單位' }
        ];
      case 'activities':
        return [
          { id: 'name', label: '活動名稱' },
          { id: 'category', label: '活動類別' },
          { id: 'date', label: '活動日期' },
          { id: 'location', label: '活動地點' },
          { id: 'participants', label: '參與人數' },
          { id: 'budget', label: '活動預算' }
        ];
      case 'users':
        return [
          { id: 'name', label: '用戶姓名' },
          { id: 'email', label: '電子郵件' },
          { id: 'role', label: '用戶角色' },
          { id: 'joinDate', label: '加入日期' },
          { id: 'lastLogin', label: '最後登入' }
        ];
      default:
        return [];
    }
  };

  const handleFieldToggle = (fieldId: string, checked: boolean) => {
    setExportOptions(prev => ({
      ...prev,
      includeFields: checked
        ? [...prev.includeFields, fieldId]
        : prev.includeFields.filter(id => id !== fieldId)
    }));
  };

  const handleExport = async () => {
    if (exportOptions.includeFields.length === 0) {
      toast.error('請至少選擇一個要導出的欄位');
      return;
    }

    // 模擬導出過程
    toast.success('正在準備導出文件...');
    
    setTimeout(() => {
      const fileName = `${exportOptions.dataType}_${new Date().toISOString().split('T')[0]}.${exportOptions.format}`;
      toast.success(`文件 ${fileName} 已準備完成`);
      
      // 實際實現中，這裡應該觸發文件下載
      const link = document.createElement('a');
      link.href = '#'; // 實際的文件 URL
      link.download = fileName;
      // link.click();
    }, 2000);
  };

  const availableFields = getAvailableFields(exportOptions.dataType);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Download className="mr-2 h-5 w-5" />
          數據導出
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label>導出格式</Label>
            <Select
              value={exportOptions.format}
              onValueChange={(value: 'excel' | 'csv' | 'pdf') => 
                setExportOptions(prev => ({ ...prev, format: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                <SelectItem value="csv">CSV (.csv)</SelectItem>
                <SelectItem value="pdf">PDF (.pdf)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>數據類型</Label>
            <Select
              value={exportOptions.dataType}
              onValueChange={(value: 'applications' | 'activities' | 'users' | 'statistics') => 
                setExportOptions(prev => ({ ...prev, dataType: value, includeFields: [] }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dataTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label>選擇欄位</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableFields.map(field => (
              <div key={field.id} className="flex items-center space-x-2">
                <Checkbox
                  id={field.id}
                  checked={exportOptions.includeFields.includes(field.id)}
                  onCheckedChange={(checked) => handleFieldToggle(field.id, checked as boolean)}
                />
                <Label htmlFor={field.id} className="text-sm">
                  {field.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="selectAll" />
          <Label htmlFor="selectAll" className="text-sm font-medium">
            全選
          </Label>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleExport} className="w-full md:w-auto">
            <Download className="mr-2 h-4 w-4" />
            開始導出
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataExport;
