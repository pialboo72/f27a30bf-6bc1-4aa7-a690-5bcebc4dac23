
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from 'lucide-react';
import { toast } from "sonner";

interface SubsidyUnitData {
  id: number;
  name: string;
  amount: number;
}

interface SubsidyUnitProps {
  subsidyUnits: SubsidyUnitData[];
  onUnitsChange: (units: SubsidyUnitData[]) => void;
}

const SubsidyUnit: React.FC<SubsidyUnitProps> = ({ subsidyUnits, onUnitsChange }) => {
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitAmount, setNewUnitAmount] = useState('');

  const handleAddUnit = () => {
    if (!newUnitName.trim() || !newUnitAmount.trim()) {
      toast.error('請填寫單位名稱和補助金額');
      return;
    }

    const amount = parseFloat(newUnitAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('請輸入有效的補助金額');
      return;
    }

    const newUnit: SubsidyUnitData = {
      id: Date.now(),
      name: newUnitName.trim(),
      amount: amount
    };

    onUnitsChange([...subsidyUnits, newUnit]);
    setNewUnitName('');
    setNewUnitAmount('');
    toast.success('已新增補助單位');
  };

  const handleRemoveUnit = (id: number) => {
    onUnitsChange(subsidyUnits.filter(unit => unit.id !== id));
    toast.success('已移除補助單位');
  };

  const handleUpdateUnit = (id: number, field: 'name' | 'amount', value: string) => {
    const updatedUnits = subsidyUnits.map(unit => {
      if (unit.id === id) {
        if (field === 'amount') {
          const numValue = parseFloat(value) || 0;
          return { ...unit, amount: numValue };
        }
        return { ...unit, [field]: value };
      }
      return unit;
    });
    onUnitsChange(updatedUnits);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">補助單位管理</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 現有補助單位列表 */}
        {subsidyUnits.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">現有補助單位</h4>
            {subsidyUnits.map(unit => (
              <div key={unit.id} className="flex items-center gap-3 p-3 border rounded-md">
                <div className="flex-1">
                  <Input
                    value={unit.name}
                    onChange={(e) => handleUpdateUnit(unit.id, 'name', e.target.value)}
                    placeholder="單位名稱"
                    className="mb-2"
                  />
                  <Input
                    type="number"
                    value={unit.amount}
                    onChange={(e) => handleUpdateUnit(unit.id, 'amount', e.target.value)}
                    placeholder="補助金額"
                    min="0"
                    step="1000"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveUnit(unit.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* 新增補助單位 */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">新增補助單位</h4>
          <div className="space-y-3">
            <Input
              value={newUnitName}
              onChange={(e) => setNewUnitName(e.target.value)}
              placeholder="輸入單位名稱（例如：文化部、教育部）"
            />
            <Input
              type="number"
              value={newUnitAmount}
              onChange={(e) => setNewUnitAmount(e.target.value)}
              placeholder="輸入補助金額"
              min="0"
              step="1000"
            />
            <Button onClick={handleAddUnit} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              新增補助單位
            </Button>
          </div>
        </div>

        {/* 總計顯示 */}
        {subsidyUnits.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center font-medium">
              <span>補助總金額：</span>
              <span className="text-lg text-primary">
                NT$ {subsidyUnits.reduce((total, unit) => total + unit.amount, 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubsidyUnit;
export type { SubsidyUnitData };
