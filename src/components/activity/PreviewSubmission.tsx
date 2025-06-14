
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
  return (
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
  );
};

export default PreviewSubmission;
