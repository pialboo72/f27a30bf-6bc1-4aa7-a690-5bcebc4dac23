
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, Calendar, DollarSign, Building, Edit } from "lucide-react";

interface SubsidyCase {
  id: number;
  title: string;
  organization: string;
  amount: number;
  deadline: string;
  status: string;
  description: string;
}

const SubsidyManagement: React.FC = () => {
  const navigate = useNavigate();
  const [subsidyCases, setSubsidyCases] = useState<SubsidyCase[]>([
    {
      id: 1,
      title: "文化藝術發展補助",
      organization: "文化部",
      amount: 500000,
      deadline: "2025-05-20",
      status: "進行中",
      description: "支持藝術創作與文化發展"
    },
    {
      id: 2,
      title: "社區服務計劃補助",
      organization: "社會局",
      amount: 300000,
      deadline: "2025-06-15",
      status: "即將截止",
      description: "促進社區服務與志工參與"
    }
  ]);

  return (
    <MainLayout>
      <div className="fade-in">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">補助管理</h1>
            <p className="text-muted-foreground mt-1">
              管理補助案件與相關文件
            </p>
          </div>
          <Button onClick={() => navigate("/admin/subsidies/create")}>
            <Plus className="h-4 w-4 mr-2" />
            新增補助案
          </Button>
        </div>

        {/* 統計卡片 */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-2xl font-bold">{subsidyCases.length}</p>
                <p className="text-xs text-muted-foreground">總補助案數</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-2xl font-bold">
                  {subsidyCases.filter(c => c.status === "進行中").length}
                </p>
                <p className="text-xs text-muted-foreground">進行中</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-2xl font-bold">
                  {subsidyCases.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">總補助金額</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-2xl font-bold">
                  {new Set(subsidyCases.map(c => c.organization)).size}
                </p>
                <p className="text-xs text-muted-foreground">參與機關</p>
              </div>
              <Building className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>

        {/* 補助案列表 */}
        <div className="grid gap-6">
          {subsidyCases.map((subsidyCase) => (
            <Card key={subsidyCase.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{subsidyCase.title}</CardTitle>
                    <p className="text-muted-foreground">{subsidyCase.organization}</p>
                  </div>
                  <Badge variant={subsidyCase.status === "進行中" ? "default" : "secondary"}>
                    {subsidyCase.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">補助金額</p>
                    <p className="font-medium">NT$ {subsidyCase.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">申請截止</p>
                    <p className="font-medium">{subsidyCase.deadline || "未設定"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">狀態</p>
                    <p className="font-medium">{subsidyCase.status}</p>
                  </div>
                </div>
                
                <p className="text-sm mb-4">{subsidyCase.description}</p>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/admin/subsidies/edit/${subsidyCase.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    編輯
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        查看詳情
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{subsidyCase.title} - 詳細資訊</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-sm text-muted-foreground">主辦機關</p>
                            <p className="font-medium">{subsidyCase.organization}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">補助金額</p>
                            <p className="font-medium">NT$ {subsidyCase.amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">申請截止</p>
                            <p className="font-medium">{subsidyCase.deadline}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">狀態</p>
                            <Badge>{subsidyCase.status}</Badge>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">說明</p>
                          <p className="mt-1">{subsidyCase.description}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default SubsidyManagement;
