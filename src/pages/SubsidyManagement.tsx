
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, Calendar, DollarSign, Building, Edit, Clock, Users } from "lucide-react";

interface SubsidyCase {
  id: number;
  title: string;
  organization: string;
  amount: number;
  startDate: string;
  deadline: string;
  status: string;
  description: string;
  category: string;
  eligibleApplicants: string;
  subsidyScope: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
}

const SubsidyManagement: React.FC = () => {
  const navigate = useNavigate();
  const [subsidyCases, setSubsidyCases] = useState<SubsidyCase[]>([
    {
      id: 1,
      title: "文化藝術發展補助",
      organization: "文化部",
      amount: 500000,
      startDate: "2025-04-01",
      deadline: "2025-05-20",
      status: "進行中",
      description: "支持藝術創作與文化發展",
      category: "文化藝術",
      eligibleApplicants: "非營利組織、藝術團體",
      subsidyScope: "活動費用、設備採購",
      contactPerson: "王承辦",
      contactPhone: "02-1234-5678",
      contactEmail: "contact@culture.gov.tw"
    },
    {
      id: 2,
      title: "社區服務計劃補助",
      organization: "社會局",
      amount: 300000,
      startDate: "2025-05-01",
      deadline: "2025-06-15",
      status: "即將截止",
      description: "促進社區服務與志工參與",
      category: "社會福利",
      eligibleApplicants: "社區發展協會、志工團體",
      subsidyScope: "人事費用、活動材料",
      contactPerson: "李承辦",
      contactPhone: "02-2345-6789",
      contactEmail: "service@social.gov.tw"
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
                  <div className="flex gap-2">
                    <Badge variant="outline">{subsidyCase.category}</Badge>
                    <Badge variant={subsidyCase.status === "進行中" ? "default" : "secondary"}>
                      {subsidyCase.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">補助金額</p>
                    <p className="font-medium">NT$ {subsidyCase.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">申請開始</p>
                    <p className="font-medium">{subsidyCase.startDate || "未設定"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">申請截止</p>
                    <p className="font-medium">{subsidyCase.deadline || "未設定"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">聯絡人</p>
                    <p className="font-medium">{subsidyCase.contactPerson || "未設定"}</p>
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
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>{subsidyCase.title} - 詳細資訊</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-sm text-muted-foreground">主辦機關</p>
                            <p className="font-medium">{subsidyCase.organization}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">補助類別</p>
                            <Badge variant="outline">{subsidyCase.category}</Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">補助金額</p>
                            <p className="font-medium">NT$ {subsidyCase.amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">狀態</p>
                            <Badge>{subsidyCase.status}</Badge>
                          </div>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-sm text-muted-foreground">申請開始日期</p>
                            <p className="font-medium">{subsidyCase.startDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">申請截止日期</p>
                            <p className="font-medium">{subsidyCase.deadline}</p>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-sm text-muted-foreground">申請資格對象</p>
                            <p className="font-medium">{subsidyCase.eligibleApplicants}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">補助範圍</p>
                            <p className="font-medium">{subsidyCase.subsidyScope}</p>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <p className="text-sm text-muted-foreground mb-2">聯絡資訊</p>
                          <div className="grid gap-2 md:grid-cols-3">
                            <div>
                              <p className="text-xs text-muted-foreground">聯絡人</p>
                              <p className="text-sm font-medium">{subsidyCase.contactPerson}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">電話</p>
                              <p className="text-sm font-medium">{subsidyCase.contactPhone}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">信箱</p>
                              <p className="text-sm font-medium">{subsidyCase.contactEmail}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">補助說明</p>
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
