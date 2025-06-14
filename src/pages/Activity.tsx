
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import ActivityFormEnhanced from "@/components/activity/ActivityFormEnhanced";
import ActivityApplicationIntegration from "@/components/activity/ActivityApplicationIntegration";
import BudgetForm from "@/components/activity/BudgetForm";
import PreviewSubmission from "@/components/activity/PreviewSubmission";
import { useActivityData } from "@/hooks/useActivityData";

// 補助計畫選項
const subsidyPrograms = [
  { id: 1, name: "文化部藝術發展補助" },
  { id: 2, name: "體育署全民運動補助" },
  { id: 3, name: "教育部學生社團活動補助" },
  { id: 4, name: "衛生福利部社區健康促進補助" },
  { id: 5, name: "環保署環境教育活動補助" },
];

const Activity: React.FC = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const { activityData, setActivityData, isLoading } = useActivityData(id, isNew);
  const [selectedProgram, setSelectedProgram] = useState<string>('');

  React.useEffect(() => {
    if (activityData) {
      setSelectedProgram(activityData.selectedProgram || '');
    } else if (isNew) {
      setSelectedProgram('');
    }
  }, [activityData, isNew]);

  const handleProgramSelect = (programId: string) => {
    setSelectedProgram(programId);
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
                <PreviewSubmission 
                  activityData={activityData}
                  selectedProgram={selectedProgram}
                  subsidyPrograms={subsidyPrograms}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Activity;
