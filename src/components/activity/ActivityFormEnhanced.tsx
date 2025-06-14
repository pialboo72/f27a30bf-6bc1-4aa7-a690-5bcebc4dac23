
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Save, Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import SubsidyUnit, { SubsidyUnitData } from "@/components/activity/SubsidyUnit";

interface ActivityFormEnhancedProps {
  initialData?: any;
  isNew: boolean;
  selectedProgram?: string;
  onProgramSelect: (programId: string) => void;
}

const ActivityFormEnhanced: React.FC<ActivityFormEnhancedProps> = ({ 
  initialData, 
  isNew, 
  selectedProgram,
  onProgramSelect 
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: null as Date | null,
    dateRange: null as { start: Date; end: Date } | null,
    location: '',
    purpose: '',
    content: '',
    target: '',
    participants: '',
    unit: '',
    subsidyUnits: [] as SubsidyUnitData[],
  });

  // 當 initialData 變更時更新表單資料
  useEffect(() => {
    if (initialData) {
      console.log("正在載入活動資料到表單", initialData);
      setFormData({
        title: initialData.title || initialData.name || '',
        category: initialData.category || '',
        date: initialData.date ? new Date(initialData.date) : null,
        dateRange: null,
        location: initialData.location || '',
        purpose: initialData.purpose || '',
        content: initialData.content || '',
        target: initialData.target || '',
        participants: initialData.participants || '',
        unit: initialData.unit || '',
        subsidyUnits: initialData.subsidyUnits || [],
      });
    } else if (isNew) {
      // 新增活動時重置表單
      setFormData({
        title: '',
        category: '',
        date: null,
        dateRange: null,
        location: '',
        purpose: '',
        content: '',
        target: '',
        participants: '',
        unit: '',
        subsidyUnits: [],
      });
    }
  }, [initialData, isNew]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (dates: Date[] | { start: Date; end: Date } | null) => {
    if (!dates) {
      handleInputChange('date', null);
      return;
    }

    if (Array.isArray(dates)) {
      handleInputChange('date', dates);
    } else {
      handleInputChange('dateRange', dates);
    }
  };

  const handleSubsidyUnitsChange = (units: SubsidyUnitData[]) => {
    handleInputChange('subsidyUnits', units);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.date || !formData.location) {
      toast.error("請填寫所有必填欄位");
      return;
    }
    
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    
    if (isNew) {
      const activityId = new Date().getTime();
      const newActivity = {
        id: activityId,
        name: formData.title,
        category: formData.category,
        date: formData.date ? format(formData.date, 'yyyy-MM-dd') : '',
        status: '已提交',
        hasDocument: true,
        selectedProgram: selectedProgram,
        ...formData
      };
      
      activities.push(newActivity);
      localStorage.setItem('activities', JSON.stringify(activities));
      toast.success("活動資料已儲存");
    } else {
      // 更新現有活動
      const activityIndex = activities.findIndex((a: any) => a.id === initialData?.id);
      if (activityIndex !== -1) {
        activities[activityIndex] = {
          ...activities[activityIndex],
          name: formData.title,
          hasDocument: true,
          selectedProgram: selectedProgram,
          ...formData
        };
        localStorage.setItem('activities', JSON.stringify(activities));
        toast.success("活動資料已更新");
      }
    }
  };

  const shouldShowAlert = formData.category && !selectedProgram;

  return (
    <div className="space-y-8">
      <div className="border-b pb-6">
        <h2 className="text-lg font-semibold mb-4">基本資料</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="activity-title">活動名稱 <span className="text-red-500">*</span></Label>
            <Input 
              id="activity-title" 
              placeholder="請輸入活動名稱" 
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="activity-category">活動類別 <span className="text-red-500">*</span></Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger id="activity-category">
                <SelectValue placeholder="請選擇活動類別" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="文化藝術">文化藝術</SelectItem>
                <SelectItem value="體育活動">體育活動</SelectItem>
                <SelectItem value="教育學習">教育學習</SelectItem>
                <SelectItem value="社區服務">社區服務</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="activity-date">活動日期 <span className="text-red-500">*</span></Label>
            <DateRangeSelector onDateChange={handleDateChange} />
          </div>

          <div className="space-y-3">
            <Label htmlFor="activity-location">活動地點 <span className="text-red-500">*</span></Label>
            <Input 
              id="activity-location" 
              placeholder="請輸入活動地點" 
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
          </div>
        </div>

        {shouldShowAlert && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              建議前往「申請文件」頁籤選擇適合的補助計劃，系統會根據您的活動類別推薦相關計劃。
            </AlertDescription>
          </Alert>
        )}
      </div>

      <SubsidyUnit 
        subsidyUnits={formData.subsidyUnits}
        onUnitsChange={handleSubsidyUnitsChange}
      />

      <div className="border-b pb-6">
        <h2 className="text-lg font-semibold mb-4">活動內容</h2>
        <div className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="activity-purpose">活動目的</Label>
            <Textarea 
              id="activity-purpose" 
              placeholder="請詳述活動目的" 
              rows={3} 
              value={formData.purpose}
              onChange={(e) => handleInputChange('purpose', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="activity-content">活動內容</Label>
            <Textarea 
              id="activity-content" 
              placeholder="請詳述活動內容" 
              rows={5}
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="activity-target">參與對象</Label>
            <Input 
              id="activity-target" 
              placeholder="請輸入參與對象"
              value={formData.target}
              onChange={(e) => handleInputChange('target', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="activity-participants">預計參與人數</Label>
              <Input 
                id="activity-participants" 
                type="number" 
                placeholder="請輸入預計人數" 
                min="0"
                value={formData.participants}
                onChange={(e) => handleInputChange('participants', e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="activity-unit">主辦單位</Label>
              <Input 
                id="activity-unit" 
                placeholder="請輸入主辦單位"
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">附件上傳</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="attachment1">活動企劃書</Label>
            <div className="flex items-center space-x-2">
              <Input id="attachment1" type="file" className="flex-1" />
              <Button variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="attachment2">預算表</Label>
            <div className="flex items-center space-x-2">
              <Input id="attachment2" type="file" className="flex-1" />
              <Button variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" />
          儲存草稿
        </Button>
        <Button onClick={handleSubmit}>
          儲存並繼續
        </Button>
      </div>
    </div>
  );
};

export default ActivityFormEnhanced;
