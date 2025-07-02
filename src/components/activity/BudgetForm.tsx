
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { toast } from "sonner";
import BudgetExport from './BudgetExport';
import BudgetTable from './BudgetTable';

interface BudgetItem {
  id: number;
  item: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
  remarks: string;
}

interface BudgetFormProps {
  activityData?: any;
  isNew: boolean;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ activityData, isNew }) => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [budgetTitle, setBudgetTitle] = useState<string>('');
  const [errors, setErrors] = useState<{[key: string]: {[key: string]: boolean}}>({});

  useEffect(() => {
    if (isNew) {
      setBudgetItems([{ id: 1, item: "", quantity: 0, unit: "", unitPrice: 0, amount: 0, remarks: "" }]);
      localStorage.removeItem('budgetItems');
    } else {
      const savedBudget = localStorage.getItem('budgetItems');
      if (savedBudget) {
        setBudgetItems(JSON.parse(savedBudget));
      } else {
        setBudgetItems([{ id: 1, item: "", quantity: 0, unit: "", unitPrice: 0, amount: 0, remarks: "" }]);
      }
    }

    if (activityData) {
      const activityName = activityData.title || activityData.name || '活動';
      setBudgetTitle(`${activityName}預算表`);
    }
  }, [isNew, activityData]);

  const handleAddItem = () => {
    const newId = budgetItems.length > 0 ? Math.max(...budgetItems.map(item => item.id)) + 1 : 1;
    setBudgetItems([...budgetItems, { 
      id: newId, 
      item: "",
      quantity: 0, 
      unit: "", 
      unitPrice: 0, 
      amount: 0, 
      remarks: "" 
    }]);
  };

  const validateItem = (item: BudgetItem) => {
    let itemErrors: {[key: string]: boolean} = {};
    
    if (!item.item.trim()) itemErrors.item = true;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let newErrors: {[key: string]: {[key: string]: boolean}} = {};
    let hasErrors = false;
    
    budgetItems.forEach((item) => {
      const itemErrors = validateItem(item);
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
      </div>
      
      <BudgetTable
        budgetItems={budgetItems}
        errors={errors}
        onUpdateItem={handleUpdateItem}
      />

      <div className="flex justify-between">
        <Button onClick={handleAddItem} variant="outline">
          新增項目
        </Button>
        <div className="flex gap-2">
          <BudgetExport budgetItems={budgetItems} budgetTitle={budgetTitle} />
          <Button onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" />
            儲存預算
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BudgetForm;
