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
import ActivityFormEnhanced from "@/components/activity/ActivityFormEnhanced";
import ActivityApplicationIntegration from "@/components/activity/ActivityApplicationIntegration";

// 補助計畫選項
const subsidyPrograms = [
  { id: 1, name: "文化部藝術發展補助" },
  { id: 2, name: "體育署全民運動補助" },
  { id: 3, name: "教育部學生社團活動補助" },
  { id: 4, name: "衛生福利部社區健康促進補助" },
  { id: 5, name: "環保署環境教育活動補助" },
];

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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<string>('');

  useEffect(() => {
    const loadActivityData = () => {
      if (!isNew && id) {
        const activities = JSON.parse(localStorage.getItem('activities') || '[]');
        const activity = activities.find((a: any) => a.id === parseInt(id));
        if (activity) {
          console.log("載入活動資料", activity);
          setActivityData(activity);
          setSelectedProgram(activity.selectedProgram || '');
        }
      } else if (isNew) {
        // 新增活動時清空相關資料
        setActivityData(null);
        setSelectedProgram('');
      }
      setIsLoading(false);
    };

    loadActivityData();
  }, [id, isNew]);

  const handleProgramSelect = (programId: string) => {
    setSelectedProgram(programId);
    // 同時更新活動資料中的選擇
    if (activityData) {
      setActivityData(prev => ({ ...prev, selectedProgram: programId }));
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div>載入中...</div>
        </div>
      </MainLayout>
    );
  }

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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="activity">活動資料</TabsTrigger>
                <TabsTrigger value="budget">預算表</TabsTrigger>
                <TabsTrigger value="application">申請文件</TabsTrigger>
                <TabsTrigger value="preview" disabled={!selectedProgram}>預覽送件</TabsTrigger>
              </TabsList>
              <TabsContent value="activity" className="mt-6">
                <ActivityFormEnhanced 
                  initialData={activityData} 
                  isNew={isNew}
                  selectedProgram={selectedProgram}
                  onProgramSelect={handleProgramSelect}
                />
              </TabsContent>
              <TabsContent value="budget" className="mt-6">
                <BudgetForm activityData={activityData} isNew={isNew} />
              </TabsContent>
              <TabsContent value="application" className="mt-6">
                <ActivityApplicationIntegration 
                  activityData={activityData}
                  selectedProgram={selectedProgram}
                  onProgramSelect={handleProgramSelect}
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>申請資料預覽</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedProgram ? (
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          請確認所有資料無誤後，即可正式提交申請。
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="font-medium">活動名稱</Label>
                            <p className="text-sm">{activityData?.title}</p>
                          </div>
                          <div>
                            <Label className="font-medium">申請補助計劃</Label>
                            <p className="text-sm">
                              {subsidyPrograms.find(p => p.id.toString() === selectedProgram)?.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button>正式提交申請</Button>
                          <Button variant="outline">儲存草稿</Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">請先在「申請文件」頁籤中選擇補助計劃</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Activity;
