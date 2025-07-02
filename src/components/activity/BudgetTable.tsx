
import React from 'react';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface BudgetItem {
  id: number;
  item: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
  remarks: string;
}

interface BudgetTableProps {
  budgetItems: BudgetItem[];
  errors: {[key: string]: {[key: string]: boolean}};
  onUpdateItem: (id: number, field: string, value: string | number) => void;
}

const BudgetTable: React.FC<BudgetTableProps> = ({
  budgetItems,
  errors,
  onUpdateItem
}) => {
  const calculateTotal = () => {
    return budgetItems.reduce((sum, item) => sum + item.amount, 0);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-muted">
            <th className="border border-gray-400 px-4 py-2 text-center font-medium">項次</th>
            <th className="border border-gray-400 px-4 py-2 text-center font-medium">項目 <span className="text-red-500">*</span></th>
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
                  value={item.item}
                  onChange={(e) => onUpdateItem(item.id, 'item', e.target.value)}
                  className={cn("border-0 p-0 h-8 text-center", errors[item.id]?.item ? "border-red-500 ring-1 ring-red-500" : "")}
                  placeholder="項目名稱"
                  required
                />
                {errors[item.id]?.item && <span className="text-xs text-red-500">必填</span>}
              </td>
              <td className="border border-gray-400 px-4 py-2">
                <Input
                  type="number"
                  value={item.quantity === 0 ? '' : item.quantity}
                  onChange={(e) => onUpdateItem(item.id, 'quantity', Number(e.target.value))}
                  className={cn("border-0 p-0 h-8 text-center", errors[item.id]?.quantity ? "border-red-500 ring-1 ring-red-500" : "")}
                  placeholder="0"
                  required
                />
                {errors[item.id]?.quantity && <span className="text-xs text-red-500">必填</span>}
              </td>
              <td className="border border-gray-400 px-4 py-2">
                <Input
                  value={item.unit}
                  onChange={(e) => onUpdateItem(item.id, 'unit', e.target.value)}
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
                  onChange={(e) => onUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
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
                  onChange={(e) => onUpdateItem(item.id, 'remarks', e.target.value)}
                  className="border-0 p-0 h-8 text-center"
                  placeholder="備註"
                />
              </td>
            </tr>
          ))}
          <tr className="bg-muted">
            <td colSpan={5} className="border border-gray-400 px-4 py-2 text-center font-bold">總計：</td>
            <td className="border border-gray-400 px-4 py-2 font-bold text-center">{calculateTotal().toLocaleString()}</td>
            <td className="border border-gray-400 px-4 py-2 text-center text-sm">各項經費得相互流用</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BudgetTable;
