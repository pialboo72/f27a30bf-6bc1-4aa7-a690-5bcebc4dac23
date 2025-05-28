import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Save, Upload } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import SubsidyUnit, { SubsidyUnitData } from "@/components/activity/SubsidyUnit";
import BudgetExport from "@/components/activity/BudgetExport";

const ActivityForm: React.FC<{ initialData?: any; isNew: boolean }> = ({ initialData, isNew }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: initialData?.title || initialData?.name || '',
    category: initialData?.category || '',
    date: initialData?.date ? new Date(initialData.date) : null,
    dateRange: null as { start: Date; end: Date } | null,
    location: initialData?.location || '',
    purpose: initialData?.purpose || '',
    content: initialData?.content || '',
    target: initialData?.target || '',
    participants: initialData?.participants || '',
    unit: initialData?.unit || '',
    subsidyUnits: initialData?.subsidyUnits || [] as SubsidyUnitData[],
  });

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
        ...formData
      };
      
      activities.push(newActivity);
      localStorage.setItem('activities', JSON.stringify(activities));
      toast.success("活動資料已送出");
    } else {
      // 更新現有活動
      const activityIndex = activities.findIndex((a: any) => a.id === initialData?.id);
      if (activityIndex !== -1) {
        activities[activityIndex] = {
          ...activities[activityIndex],
          name: formData.title,
          ...formData
        };
        localStorage.setItem('activities', JSON.stringify(activities));
        toast.success("活動資料已更新");
      }
    }
    
    navigate('/activities');
  };

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
          送出
        </Button>
      </div>
    </div>
  );
};

interface BudgetItem {
  id: number;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
  remarks: string;
}

const BudgetForm: React.FC<{ activityData?: any; isNew: boolean }> = ({ activityData, isNew }) => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [budgetTitle, setBudgetTitle] = useState<string>('');
  const [budgetSaved, setBudgetSaved] = useState<boolean>(false);
  const [errors, setErrors] = useState<{[key: string]: {[key: string]: boolean}}>({});

  useEffect(() => {
    // 清空或載入預算資料
    if (isNew) {
      // 新增活動時清空預算表
      setBudgetItems([{ id: 1, quantity: 0, unit: "", unitPrice: 0, amount: 0, remarks: "" }]);
      setBudgetTitle('');
      localStorage.removeItem('budgetItems');
    } else {
      // 編輯活動時載入已存在的預算資料
      const savedBudget = localStorage.getItem('budgetItems');
      if (savedBudget) {
        setBudgetItems(JSON.parse(savedBudget));
      } else {
        setBudgetItems([{ id: 1, quantity: 0, unit: "", unitPrice: 0, amount: 0, remarks: "" }]);
      }
    }

    // 設定預算表標題
    if (activityData) {
      const unitName = activityData.unit || '申請單位';
      const activityName = activityData.title || activityData.name || '活動名稱';
      setBudgetTitle(`${unitName}${activityName}預算表`);
    }
  }, [isNew, activityData]);

  const handleAddItem = () => {
    const newId = budgetItems.length > 0 ? Math.max(...budgetItems.map(item => item.id)) + 1 : 1;
    setBudgetItems([...budgetItems, { 
      id: newId, 
      quantity: 0, 
      unit: "", 
      unitPrice: 0, 
      amount: 0, 
      remarks: "" 
    }]);
  };

  const validateItem = (item: BudgetItem, index: number) => {
    let itemErrors: {[key: string]: boolean} = {};
    
    if (item.quantity <= 0) itemErrors.quantity = true;
    if (!item.unit.trim()) itemErrors.unit = true;
    if (item.unitPrice <= 0) itemErrors.unitPrice = true;
    
    return itemErrors;
  };

  const handleUpdateItem = (id: number, field: string, value: string | number) => {
    const updatedItems = budgetItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        if (field === 'quantity' || field === 'unitPrice') {
          const quantity = field === 'quantity' ? Number(value) : item.quantity;
          const unitPrice = field === 'unitPrice' ? Number(value) : item.unitPrice;
          updatedItem.amount = quantity * unitPrice;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setBudgetItems(updatedItems);
    
    if (errors[id] && errors[id][field]) {
      const newErrors = {...errors};
      delete newErrors[id][field];
      if (Object.keys(newErrors[id]).length === 0) {
        delete newErrors[id];
      }
      setErrors(newErrors);
    }
  };

  const calculateTotal = () => {
    return budgetItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let newErrors: {[key: string]: {[key: string]: boolean}} = {};
    let hasErrors = false;
    
    budgetItems.forEach((item, index) => {
      const itemErrors = validateItem(item, index);
      if (Object.keys(itemErrors).length > 0) {
        newErrors[item.id] = itemErrors;
        hasErrors = true;
      }
    });
    
    setErrors(newErrors);
    
    if (hasErrors) {
      toast.error("請填寫所有必填欄位");
      return;
    }
    
    localStorage.setItem('budgetItems', JSON.stringify(budgetItems));
    toast.success("預算已成功儲存");
    setBudgetSaved(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <Label htmlFor="budget-title">預算表標題</Label>
          <Input
            id="budget-title"
            value={budgetTitle}
            onChange={(e) => setBudgetTitle(e.target.value)}
            placeholder="請輸入預算表標題"
            className="mt-2"
          />
        </div>
        <BudgetExport budgetItems={budgetItems} budgetTitle={budgetTitle} />
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-muted">
              <th className="border border-gray-400 px-4 py-2 text-center font-medium">項次</th>
              <th className="border border-gray-400 px-4 py-2 text-center font-medium">數量 <span className="text-red-500">*</span></th>
              <th className="border border-gray-400 px-4 py-2 text-center font-medium">單位 <span className="text-red-500">*</span></th>
              <th className="border border-gray-400 px-4 py-2 text-center font-medium">單價 <span className="text-red-500">*</span></th>
              <th className="border border-gray-400 px-4 py-2 text-center font-medium">金額</th>
              <th className="border border-gray-400 px-4 py-2 text-center font-medium">備註</th>
            </tr>
          </thead>
          <tbody>
            {budgetItems.map((item, index) => (
              <tr key={item.id} className="border-b">
                <td className="border border-gray-400 px-4 py-2 text-center">{index + 1}</td>
                <td className="border border-gray-400 px-4 py-2">
                  <Input
                    type="number"
                    value={item.quantity === 0 ? '' : item.quantity}
                    onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                    className={cn("border-0 p-0 h-8 text-center", errors[item.id]?.quantity ? "border-red-500 ring-1 ring-red-500" : "")}
                    placeholder="0"
                    required
                  />
                  {errors[item.id]?.quantity && <span className="text-xs text-red-500">必填</span>}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  <Input
                    value={item.unit}
                    onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                    className={cn("border-0 p-0 h-8 text-center", errors[item.id]?.unit ? "border-red-500 ring-1 ring-red-500" : "")}
                    placeholder="單位"
                    required
                  />
                  {errors[item.id]?.unit && <span className="text-xs text-red-500">必填</span>}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  <Input
                    type="number"
                    value={item.unitPrice === 0 ? '' : item.unitPrice}
                    onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
                    className={cn("border-0 p-0 h-8 text-center", errors[item.id]?.unitPrice ? "border-red-500 ring-1 ring-red-500" : "")}
                    placeholder="0"
                    required
                  />
                  {errors[item.id]?.unitPrice && <span className="text-xs text-red-500">必填</span>}
                </td>
                <td className="border border-gray-400 px-4 py-2 font-medium text-center">
                  {item.amount.toLocaleString()}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  <Input
                    value={item.remarks}
                    onChange={(e) => handleUpdateItem(item.id, 'remarks', e.target.value)}
                    className="border-0 p-0 h-8 text-center"
                    placeholder="備註"
                  />
                </td>
              </tr>
            ))}
            <tr className="bg-muted">
              <td colSpan={4} className="border border-gray-400 px-4 py-2 text-center font-bold">總計：</td>
              <td className="border border-gray-400 px-4 py-2 font-bold text-center">{calculateTotal().toLocaleString()}</td>
              <td className="border border-gray-400 px-4 py-2"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-between">
        <Button onClick={handleAddItem} variant="outline">
          新增項目
        </Button>
        <Button onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" />
          儲存預算
        </Button>
      </div>
    </div>
  );
};

const Activity: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  const [activityData, setActivityData] = useState<any>(null);

  useEffect(() => {
    if (!isNew && id) {
      const activities = JSON.parse(localStorage.getItem('activities') || '[]');
      const activity = activities.find((a: any) => a.id === parseInt(id));
      if (activity) {
        console.log("載入活動資料", activity);
        setActivityData(activity);
      }
    } else if (isNew) {
      // 新增活動時清空相關資料
      setActivityData(null);
    }
  }, [id, isNew]);

  return (
    <MainLayout>
      <div className="fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              {isNew ? "新增活動資料" : "編輯活動資料"}
            </h1>
            <p className="text-muted-foreground mt-1">
              填寫活動相關資料，系統將自動生成申請文件
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>活動申請表單</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="activity" className="w-full">
              <TabsList>
                <TabsTrigger value="activity">活動資料</TabsTrigger>
                <TabsTrigger value="budget">預算表</TabsTrigger>
              </TabsList>
              <TabsContent value="activity" className="mt-6">
                <ActivityForm initialData={activityData} isNew={isNew} />
              </TabsContent>
              <TabsContent value="budget" className="mt-6">
                <BudgetForm activityData={activityData} isNew={isNew} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Activity;
