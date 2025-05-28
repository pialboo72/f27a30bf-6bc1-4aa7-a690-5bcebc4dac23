
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface BudgetItem {
  id: number;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
  remarks: string;
}

interface BudgetExportProps {
  budgetItems: BudgetItem[];
  budgetTitle?: string;
}

const BudgetExport: React.FC<BudgetExportProps> = ({ budgetItems, budgetTitle = "預算表" }) => {
  const exportToExcel = () => {
    if (budgetItems.length === 0) {
      toast.error('沒有預算項目可以導出');
      return;
    }

    // 創建 CSV 內容（可以用 Excel 打開）
    const headers = ['項次', '數量', '單位', '單價', '金額', '備註'];
    const csvContent = [
      `"${budgetTitle}"`,  // 標題行
      '',  // 空行
      headers.join(','),
      ...budgetItems.map((item, index) => 
        [
          index + 1,
          item.quantity,
          `"${item.unit}"`,
          item.unitPrice.toLocaleString(),
          item.amount.toLocaleString(),
          `"${item.remarks}"`
        ].join(',')
      ),
      ['', '', '', '總計', budgetItems.reduce((sum, item) => sum + item.amount, 0).toLocaleString(), ''].join(',')
    ].join('\n');

    // 創建和下載文件
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${budgetTitle}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('預算表已成功導出');
  };

  return (
    <Button onClick={exportToExcel} variant="outline" size="sm">
      <Download className="mr-2 h-4 w-4" />
      導出 Excel
    </Button>
  );
};

export default BudgetExport;
