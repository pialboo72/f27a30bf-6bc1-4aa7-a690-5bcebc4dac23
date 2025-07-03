
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";

interface PreviewSubmissionProps {
  activityData?: any;
  selectedProgram?: string;
  subsidyPrograms: Array<{ id: number; name: string }>;
}

const PreviewSubmission: React.FC<PreviewSubmissionProps> = ({
  activityData,
  selectedProgram,
  subsidyPrograms
}) => {
  const handleGeneratePDF = () => {
    if (!activityData || !selectedProgram) {
      toast.error("請先完成活動資料填寫並選擇補助計劃");
      return;
    }

    // Get budget data from localStorage
    const budgetItems = JSON.parse(localStorage.getItem('budgetItems') || '[]');
    const totalBudget = budgetItems.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);

    // Create integrated document content
    const documentContent = `活動申請書

=== 基本資料 ===
活動名稱：${activityData.title || ''}
主旨：${activityData.subject || ''}
時間：${activityData.date || ''}
地點：${activityData.location || ''}
對象：${activityData.target || ''}
指導單位：${activityData.guidingUnit || ''}
主辦單位：${activityData.organizingUnit || ''}

活動內容：
${activityData.content || ''}

經費來源：${activityData.fundingSource || ''}
經費預算：${activityData.budget || ''}

預期效益：
${activityData.expectedBenefits || ''}

申請補助計劃：${subsidyPrograms.find(p => p.id.toString() === selectedProgram)?.name || ''}

=== 預算明細 ===
${budgetItems.length > 0 ? budgetItems.map((item: any, index: number) => 
  `${index + 1}. ${item.item} 
     數量：${item.quantity} ${item.unit}
     單價：${item.unitPrice}
     小計：${item.amount}
     備註：${item.remarks || '無'}`
).join('\n\n') : '尚未填寫預算明細'}

預算總計：${totalBudget.toLocaleString()} 元

申請日期：${new Date().toLocaleDateString()}
申請狀態：準備提交`;

    // Create and download the integrated document
    const blob = new Blob([documentContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activityData.title || '活動申請'}_完整申請文件.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("完整申請文件已生成並下載");
  };

  const handleSubmitApplication = () => {
    if (!activityData || !selectedProgram) {
      toast.error("請先完成活動資料填寫並選擇補助計劃");
      return;
    }

    // Update activity status to submitted
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    const activityIndex = activities.findIndex((a: any) => a.id === activityData.id);
    if (activityIndex !== -1) {
      activities[activityIndex].status = '已提交';
      localStorage.setItem('activities', JSON.stringify(activities));
    }

    toast.success("申請已正式提交！");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          申請資料預覽
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedProgram && activityData ? (
          <div className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">整合文件內容預覽</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• 活動基本資料</p>
                <p>• 預算明細表</p>
                <p>• 上傳附件清單</p>
                <p>• 申請補助計劃資訊</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-medium">活動名稱</Label>
                <p className="text-sm">{activityData.title}</p>
              </div>
              <div>
                <Label className="font-medium">申請補助計劃</Label>
                <p className="text-sm">
                  {subsidyPrograms.find(p => p.id.toString() === selectedProgram)?.name}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSubmitApplication}>
                正式提交申請
              </Button>
              <Button variant="outline" onClick={handleGeneratePDF}>
                <Download className="mr-2 h-4 w-4" />
                下載完整文件
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              請先完成活動資料填寫並在「申請文件」頁籤中選擇補助計劃
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PreviewSubmission;
