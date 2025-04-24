import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Calendar as CalendarIcon, FileText, Save, Upload } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { useFiles } from "@/contexts/FileContext";
import { DateRangeSelector } from "@/components/DateRangeSelector";

const ActivityForm: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
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
    subsidyUnit: '',
    subsidyAmount: 0,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 驗證必填欄位
    if (!formData.title || !formData.category || !formData.date || !formData.location) {
      toast.error("請填寫所有必填欄位");
      return;
    }
    
    // 儲存活動資料到 localStorage，實際應用中應使用後端 API
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
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

      <div className="border-b pb-6">
        <h2 className="text-lg font-semibold mb-4">補助單位資料</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="subsidy-unit">補助單位</Label>
            <Input
              id="subsidy-unit"
              value={formData.subsidyUnit}
              onChange={(e) => handleInputChange('subsidyUnit', e.target.value)}
              placeholder="請輸入補助單位名稱"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="subsidy-amount">補助金額</Label>
            <Input
              id="subsidy-amount"
              type="number"
              value={formData.subsidyAmount === 0 ? '' : formData.subsidyAmount}
              onChange={(e) => handleInputChange('subsidyAmount', Number(e.target.value))}
              placeholder="請輸入補助金額"
            />
          </div>
        </div>
      </div>

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

const BudgetForm: React.FC = () => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: 1, quantity: 0, unit: "", unitPrice: 0, amount: 0, remarks: "" }
  ]);
  const [budgetSaved, setBudgetSaved] = useState<boolean>(false);
  const [errors, setErrors] = useState<{[key: string]: {[key: string]: boolean}}>({});

  useEffect(() => {
    const savedBudget = localStorage.getItem('budgetItems');
    if (savedBudget) {
      setBudgetItems(JSON.parse(savedBudget));
    }
  }, []);

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
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border px-4 py-2 text-left">項次</th>
              <th className="border px-4 py-2 text-left">數量 <span className="text-red-500">*</span></th>
              <th className="border px-4 py-2 text-left">單位 <span className="text-red-500">*</span></th>
              <th className="border px-4 py-2 text-left">單價 <span className="text-red-500">*</span></th>
              <th className="border px-4 py-2 text-left">金額</th>
              <th className="border px-4 py-2 text-left">備註</th>
            </tr>
          </thead>
          <tbody>
            {budgetItems.map((item, index) => (
              <tr key={item.id} className="border-b">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">
                  <Input
                    type="number"
                    value={item.quantity === 0 ? '' : item.quantity}
                    onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                    className={cn("border-0 p-0 h-8", errors[item.id]?.quantity ? "border-red-500 ring-1 ring-red-500" : "")}
                    placeholder="0"
                    required
                  />
                  {errors[item.id]?.quantity && <span className="text-xs text-red-500">必填</span>}
                </td>
                <td className="border px-4 py-2">
                  <Input
                    value={item.unit}
                    onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                    className={cn("border-0 p-0 h-8", errors[item.id]?.unit ? "border-red-500 ring-1 ring-red-500" : "")}
                    placeholder="單位"
                    required
                  />
                  {errors[item.id]?.unit && <span className="text-xs text-red-500">必填</span>}
                </td>
                <td className="border px-4 py-2">
                  <Input
                    type="number"
                    value={item.unitPrice === 0 ? '' : item.unitPrice}
                    onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
                    className={cn("border-0 p-0 h-8", errors[item.id]?.unitPrice ? "border-red-500 ring-1 ring-red-500" : "")}
                    placeholder="0"
                    required
                  />
                  {errors[item.id]?.unitPrice && <span className="text-xs text-red-500">必填</span>}
                </td>
                <td className="border px-4 py-2 font-medium">
                  {item.amount.toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  <Input
                    value={item.remarks}
                    onChange={(e) => handleUpdateItem(item.id, 'remarks', e.target.value)}
                    className="border-0 p-0 h-8"
                    placeholder="備註"
                  />
                </td>
              </tr>
            ))}
            <tr className="bg-muted">
              <td colSpan={4} className="border px-4 py-2 text-right font-medium">總計：</td>
              <td className="border px-4 py-2 font-bold">{calculateTotal().toLocaleString()}</td>
              <td className="border px-4 py-2"></td>
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

  useEffect(() => {
    if (!isNew) {
      const activities = JSON.parse(localStorage.getItem('activities') || '[]');
      const activity = activities.find((a: any) => a.id === parseInt(id || '0'));
      if (activity) {
        console.log("載入活動資料", activity);
      }
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
            <CardTitle>青年藝術發展計劃</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="activity" className="w-full">
              <TabsList>
                <TabsTrigger value="activity">活動資料</TabsTrigger>
                <TabsTrigger value="budget">預算表</TabsTrigger>
              </TabsList>
              <TabsContent value="activity" className="mt-6">
                <ActivityForm />
              </TabsContent>
              <TabsContent value="budget" className="mt-6">
                <BudgetForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Activity;
