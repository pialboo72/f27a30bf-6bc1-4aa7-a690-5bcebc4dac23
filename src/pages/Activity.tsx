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

const ActivityForm: React.FC = () => {
  const [date, setDate] = useState<Date>();

  return (
    <div className="space-y-8">
      <div className="border-b pb-6">
        <h2 className="text-lg font-semibold mb-4">基本資料</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="activity-title">活動名稱</Label>
            <Input id="activity-title" placeholder="請輸入活動名稱" />
          </div>

          <div className="space-y-3">
            <Label htmlFor="activity-category">活動類別</Label>
            <Select>
              <SelectTrigger id="activity-category">
                <SelectValue placeholder="請選擇活動類別" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="culture">文化藝術</SelectItem>
                <SelectItem value="sports">體育活動</SelectItem>
                <SelectItem value="education">教育學習</SelectItem>
                <SelectItem value="community">社區服務</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="activity-date">活動日期</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: zhTW }) : "請選擇日期"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-3">
            <Label htmlFor="activity-location">活動地點</Label>
            <Input id="activity-location" placeholder="請輸入活動地點" />
          </div>
        </div>
      </div>

      <div className="border-b pb-6">
        <h2 className="text-lg font-semibold mb-4">活動內容</h2>
        <div className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="activity-purpose">活動目的</Label>
            <Textarea id="activity-purpose" placeholder="請詳述活動目的" rows={3} />
          </div>

          <div className="space-y-3">
            <Label htmlFor="activity-content">活動內容</Label>
            <Textarea id="activity-content" placeholder="請詳述活動內容" rows={5} />
          </div>

          <div className="space-y-3">
            <Label htmlFor="activity-target">參與對象</Label>
            <Input id="activity-target" placeholder="請輸入參與對象" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="activity-participants">預計參與人數</Label>
              <Input id="activity-participants" type="number" placeholder="請輸入預計人數" min="0" />
            </div>

            <div className="space-y-3">
              <Label htmlFor="activity-unit">主辦單位</Label>
              <Input id="activity-unit" placeholder="請輸入主辦單位" />
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
        <Button variant="outline">
          <Save className="mr-2 h-4 w-4" />
          儲存草稿
        </Button>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          生成申請文件
        </Button>
      </div>
    </div>
  );
};

const BudgetForm: React.FC = () => {
  const [budgetItems, setBudgetItems] = useState([
    { id: 1, name: "", item: "", quantity: 0, unit: "", unitPrice: 0, amount: 0, remarks: "" }
  ]);

  const handleAddItem = () => {
    const newId = budgetItems.length > 0 ? Math.max(...budgetItems.map(item => item.id)) + 1 : 1;
    setBudgetItems([...budgetItems, { 
      id: newId, 
      name: "", 
      item: "", 
      quantity: 0, 
      unit: "", 
      unitPrice: 0, 
      amount: 0, 
      remarks: "" 
    }]);
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
  };

  const calculateTotal = () => {
    return budgetItems.reduce((sum, item) => sum + item.amount, 0);
  };

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border px-4 py-2 text-left">項次</th>
              <th className="border px-4 py-2 text-left">名稱</th>
              <th className="border px-4 py-2 text-left">項目</th>
              <th className="border px-4 py-2 text-left">數量</th>
              <th className="border px-4 py-2 text-left">單位</th>
              <th className="border px-4 py-2 text-left">單價</th>
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
                    value={item.name}
                    onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                    className="border-0 p-0 h-8"
                    placeholder="請輸入名稱"
                  />
                </td>
                <td className="border px-4 py-2">
                  <Input
                    value={item.item}
                    onChange={(e) => handleUpdateItem(item.id, 'item', e.target.value)}
                    className="border-0 p-0 h-8"
                    placeholder="請輸入項目"
                  />
                </td>
                <td className="border px-4 py-2">
                  <Input
                    type="number"
                    value={item.quantity === 0 ? '' : item.quantity}
                    onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                    className="border-0 p-0 h-8"
                    placeholder="0"
                  />
                </td>
                <td className="border px-4 py-2">
                  <Input
                    value={item.unit}
                    onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                    className="border-0 p-0 h-8"
                    placeholder="單位"
                  />
                </td>
                <td className="border px-4 py-2">
                  <Input
                    type="number"
                    value={item.unitPrice === 0 ? '' : item.unitPrice}
                    onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
                    className="border-0 p-0 h-8"
                    placeholder="0"
                  />
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
              <td colSpan={6} className="border px-4 py-2 text-right font-medium">總計：</td>
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
        <Button>
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
      // 在這裡載入活動資料
      // 實際應用中需要與後端API整合
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
