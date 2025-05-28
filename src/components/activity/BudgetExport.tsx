
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';

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

    // 準備 Excel 資料
    const data = [
      [budgetTitle], // 標題行
      [], // 空行
      ['項次', '數量', '單位', '單價', '金額', '備註'], // 表頭
      ...budgetItems.map((item, index) => [
        index + 1,
        item.quantity,
        item.unit,
        item.unitPrice,
        item.amount,
        item.remarks
      ]),
      ['', '', '', '總計', budgetItems.reduce((sum, item) => sum + item.amount, 0), ''] // 總計行
    ];

    // 創建工作簿和工作表
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    // 設定欄寬
    ws['!cols'] = [
      { wch: 8 },  // 項次
      { wch: 10 }, // 數量
      { wch: 12 }, // 單位
      { wch: 15 }, // 單價
      { wch: 15 }, // 金額
      { wch: 20 }  // 備註
    ];

    // 設定標題行樣式（合併儲存格）
    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } });

    // 設定數字格式（千分位）
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let R = 3; R <= range.e.r; R++) {
      const unitPriceCell = XLSX.utils.encode_cell({ r: R, c: 3 });
      const amountCell = XLSX.utils.encode_cell({ r: R, c: 4 });
      
      if (ws[unitPriceCell]) {
        ws[unitPriceCell].z = '#,##0';
      }
      if (ws[amountCell]) {
        ws[amountCell].z = '#,##0';
      }
    }

    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, ws, '預算表');

    // 導出檔案
    const fileName = `${budgetTitle}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success('預算表已成功導出為 Excel 格式');
  };

  return (
    <Button onClick={exportToExcel} variant="outline" size="sm">
      <Download className="mr-2 h-4 w-4" />
      導出 Excel
    </Button>
  );
};

export default BudgetExport;
