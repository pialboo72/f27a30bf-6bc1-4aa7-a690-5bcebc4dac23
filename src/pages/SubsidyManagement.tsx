
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Upload, Calendar, DollarSign, Building } from "lucide-react";
import { toast } from "sonner";

interface SubsidyCase {
  id: number;
  title: string;
  organization: string;
  amount: number;
  deadline: string;
  status: string;
  description: string;
  documents: string[];
}

const SubsidyManagement: React.FC = () => {
  const [subsidyCases, setSubsidyCases] = useState<SubsidyCase[]>([
    {
      id: 1,
      title: "文化藝術發展補助",
      organization: "文化部",
      amount: 500000,
      deadline: "2025-05-20",
      status: "進行中",
      description: "支持藝術創作與文化發展",
      documents: ["申請書範本.docx", "預算表.xlsx"]
    },
    {
      id: 2,
      title: "社區服務計劃補助",
      organization: "社會局",
      amount: 300000,
      deadline: "2025-06-15",
      status: "即將截止",
      description: "促進社區服務與志工參與",
      documents: ["計劃書範本.docx"]
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCase, setNewCase] = useState({
    title: "",
    organization: "",
    amount: "",
    deadline: "",
    description: ""
  });

  const handleAddCase = () => {
    if (!newCase.title || !newCase.organization || !newCase.amount) {
      toast.error("請填寫必要欄位");
      return;
    }

    const subsidyCase: SubsidyCase = {
      id: Date.now(),
      title: newCase.title,
      organization: newCase.organization,
      amount: parseInt(newCase.amount),
      deadline: newCase.deadline,
      status: "進行中",
      description: newCase.description,
      documents: []
    };

    setSubsidyCases([...subsidyCases, subsidyCase]);
    setNewCase({ title: "", organization: "", amount: "", deadline: "", description: "" });
    setShowAddForm(false);
    toast.success("補助案新增成功");
  };

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
          <Button onClick={() => setShowAddForm(true)}>
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

        {/* 新增補助案表單 */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>新增補助案</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>補助案名稱 *</Label>
                  <Input
                    value={newCase.title}
                    onChange={(e) => setNewCase({...newCase, title: e.target.value})}
                    placeholder="請輸入補助案名稱"
                  />
                </div>
                <div>
                  <Label>主辦機關 *</Label>
                  <Input
                    value={newCase.organization}
                    onChange={(e) => setNewCase({...newCase, organization: e.target.value})}
                    placeholder="請輸入主辦機關"
                  />
                </div>
                <div>
                  <Label>補助金額 *</Label>
                  <Input
                    type="number"
                    value={newCase.amount}
                    onChange={(e) => setNewCase({...newCase, amount: e.target.value})}
                    placeholder="請輸入補助金額"
                  />
                </div>
                <div>
                  <Label>申請截止日期</Label>
                  <Input
                    type="date"
                    value={newCase.deadline}
                    onChange={(e) => setNewCase({...newCase, deadline: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>補助說明</Label>
                <Textarea
                  value={newCase.description}
                  onChange={(e) => setNewCase({...newCase, description: e.target.value})}
                  placeholder="請輸入補助說明"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddCase}>新增</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  取消
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                    <p className="text-sm text-muted-foreground">相關文件</p>
                    <p className="font-medium">{subsidyCase.documents.length} 個檔案</p>
                  </div>
                </div>
                
                <p className="text-sm mb-4">{subsidyCase.description}</p>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    查看詳情
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-1" />
                    上傳文件
                  </Button>
                </div>
                
                {subsidyCase.documents.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">相關文件：</p>
                    <div className="flex flex-wrap gap-2">
                      {subsidyCase.documents.map((doc, index) => (
                        <Badge key={index} variant="outline">
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default SubsidyManagement;
