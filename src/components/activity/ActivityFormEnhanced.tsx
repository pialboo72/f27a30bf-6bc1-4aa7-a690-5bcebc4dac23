import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Save, AlertCircle } from "lucide-react";
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
    subject: '',
    date: null as Date | null,
    dateRange: null as { start: Date; end: Date } | null,
    location: '',
    target: '',
    guidingUnit: '',
    organizingUnit: '',
    content: '',
    fundingSource: '',
    budget: '',
    expectedBenefits: '',
    subsidyUnits: [] as SubsidyUnitData[],
  });

  useEffect(() => {
    if (initialData) {
      console.log("正在載入活動資料到表單", initialData);
      setFormData({
        title: initialData.title || initialData.name || '',
        subject: initialData.subject || '',
        date: initialData.date ? new Date(initialData.date) : null,
        dateRange: null,
        location: initialData.location || '',
        target: initialData.target || '',
        guidingUnit: initialData.guidingUnit || '',
        organizingUnit: initialData.organizingUnit || initialData.unit || '',
        content: initialData.content || '',
        fundingSource: initialData.fundingSource || '',
        budget: initialData.budget || '',
        expectedBenefits: initialData.expectedBenefits || '',
        subsidyUnits: initialData.subsidyUnits || [],
      });
    } else if (isNew) {
      setFormData({
        title: '',
        subject: '',
        date: null,
        dateRange: null,
        location: '',
        target: '',
        guidingUnit: '',
        organizingUnit: '',
        content: '',
        fundingSource: '',
        budget: '',
        expectedBenefits: '',
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
    
    if (!formData.title || !formData.subject || !formData.date || !formData.location) {
      toast.error("請填寫所有必填欄位");
      return;
    }
    
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    
    if (isNew) {
      const activityId = new Date().getTime();
      const newActivity = {
        id: activityId,
        name: formData.title,
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

  const shouldShowAlert = !selectedProgram;

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
            <Label htmlFor="activity-subject">主旨 <span className="text-red-500">*</span></Label>
            <Input 
              id="activity-subject" 
              placeholder="請輸入活動主旨" 
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="activity-date">時間 <span className="text-red-500">*</span></Label>
            <DateRangeSelector onDateChange={handleDateChange} />
          </div>

          <div className="space-y-3">
            <Label htmlFor="activity-location">地點 <span className="text-red-500">*</span></Label>
            <Input 
              id="activity-location" 
              placeholder="請輸入活動地點" 
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="activity-target">對象</Label>
            <Input 
              id="activity-target" 
              placeholder="請輸入參與對象"
              value={formData.target}
              onChange={(e) => handleInputChange('target', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="guiding-unit">指導單位</Label>
            <Input 
              id="guiding-unit" 
              placeholder="請輸入指導單位"
              value={formData.guidingUnit}
              onChange={(e) => handleInputChange('guidingUnit', e.target.value)}
            />
          </div>

          <div className="space-y-3 md:col-span-2">
            <Label htmlFor="organizing-unit">主辦單位</Label>
            <Input 
              id="organizing-unit" 
              placeholder="請輸入主辦單位"
              value={formData.organizingUnit}
              onChange={(e) => handleInputChange('organizingUnit', e.target.value)}
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

      <div className="border-b pb-6">
        <h2 className="text-lg font-semibold mb-4">活動內容</h2>
        <div className="space-y-4">
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
        </div>
      </div>

      <div className="border-b pb-6">
        <h2 className="text-lg font-semibold mb-4">經費資訊</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="funding-source">活動經費來源</Label>
            <Input 
              id="funding-source" 
              placeholder="請輸入經費來源"
              value={formData.fundingSource}
              onChange={(e) => handleInputChange('fundingSource', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="budget">經費預算</Label>
            <Input 
              id="budget" 
              type="number"
              placeholder="請輸入預算金額"
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
            />
          </div>
        </div>

        <SubsidyUnit 
          subsidyUnits={formData.subsidyUnits}
          onUnitsChange={handleSubsidyUnitsChange}
        />
      </div>

      <div className="border-b pb-6">
        <h2 className="text-lg font-semibold mb-4">預期效益</h2>
        <div className="space-y-3">
          <Label htmlFor="expected-benefits">預期效益</Label>
          <Textarea 
            id="expected-benefits" 
            placeholder="請描述活動的預期效益" 
            rows={4}
            value={formData.expectedBenefits}
            onChange={(e) => handleInputChange('expectedBenefits', e.target.value)}
          />
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
