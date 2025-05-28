
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ApplicationFormProps {
  programId?: string;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ programId }) => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<any[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [applicationData, setApplicationData] = useState({
    programId: programId || '',
    activityId: '',
    notes: '',
    documents: [] as string[]
  });

  useEffect(() => {
    // 載入活動列表
    const savedActivities = localStorage.getItem('activities');
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  const handleSubmit = () => {
    if (!selectedActivity) {
      toast.error("請選擇要申請的活動");
      return;
    }

    const activity = activities.find(a => a.id === parseInt(selectedActivity));
    if (!activity) {
      toast.error("找不到選擇的活動");
      return;
    }

    // 創建申請案
    const newApplication = {
      id: Date.now(),
      activityName: activity.name || activity.title,
      submitDate: new Date().toISOString().split('T')[0],
      amount: 50000, // 預設申請金額
      reviewAgency: programId === '1' ? '文化部' : '其他機關',
      lastUpdate: new Date().toISOString().split('T')[0],
      status: '待審核',
      programId: programId,
      activityId: selectedActivity,
      notes: applicationData.notes
    };

    // 儲存到申請進度追蹤
    const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
    existingApplications.push(newApplication);
    localStorage.setItem('applications', JSON.stringify(existingApplications));

    toast.success("申請已提交");
    navigate('/applications');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>提交補助申請</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>選擇活動</Label>
          <Select value={selectedActivity} onValueChange={setSelectedActivity}>
            <SelectTrigger>
              <SelectValue placeholder="請選擇要申請的活動" />
            </SelectTrigger>
            <SelectContent>
              {activities.map((activity) => (
                <SelectItem key={activity.id} value={activity.id.toString()}>
                  {activity.name || activity.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>申請說明</Label>
          <Textarea
            placeholder="請輸入申請說明..."
            value={applicationData.notes}
            onChange={(e) => setApplicationData(prev => ({ ...prev, notes: e.target.value }))}
            rows={4}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSubmit}>提交申請</Button>
          <Button variant="outline" asChild>
            <a href="/activity/new">新增活動後申請</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationForm;
