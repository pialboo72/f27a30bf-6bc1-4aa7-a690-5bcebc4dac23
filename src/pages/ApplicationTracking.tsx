
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProgressTracking from "@/components/application/ProgressTracking";
import { Search, Eye, Filter } from "lucide-react";

// 模擬申請案例資料
const mockApplications = [
  {
    id: "APP-2024-001",
    title: "2024年度社區藝術推廣計畫",
    applicant: "台北市文化協會",
    submitDate: "2024-01-15",
    status: "審核中",
    statusColor: "bg-blue-100 text-blue-800",
    amount: 500000,
    category: "藝術文化"
  },
  {
    id: "APP-2024-002", 
    title: "偏鄉教育數位化改善專案",
    applicant: "花蓮縣教育基金會",
    submitDate: "2024-01-18",
    status: "待補件",
    statusColor: "bg-yellow-100 text-yellow-800",
    amount: 800000,
    category: "教育發展"
  },
  {
    id: "APP-2024-003",
    title: "綠能環保社區改造計畫",
    applicant: "高雄市環保協會",
    submitDate: "2024-01-20",
    status: "已核准",
    statusColor: "bg-green-100 text-green-800",
    amount: 1200000,
    category: "環境保護"
  }
];

const ApplicationTracking: React.FC = () => {
  const [applications] = useState(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "全部" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <MainLayout>
      <div className="fade-in space-y-6">
        <div>
          <h1 className="text-3xl font-bold">申請進度追蹤</h1>
          <p className="text-muted-foreground mt-1">
            查看和管理補助申請案件的處理進度
          </p>
        </div>

        {/* 搜尋和篩選 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="搜尋申請案件 (編號、標題、申請人)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="全部">全部狀態</option>
                  <option value="審核中">審核中</option>
                  <option value="待補件">待補件</option>
                  <option value="已核准">已核准</option>
                  <option value="已駁回">已駁回</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 申請案件列表 */}
          <Card>
            <CardHeader>
              <CardTitle>申請案件列表</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedApplication === app.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedApplication(app.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium">{app.title}</h3>
                          <Badge className={app.statusColor}>
                            {app.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          申請人: {app.applicant}
                        </p>
                        <p className="text-sm text-muted-foreground mb-1">
                          申請編號: {app.id}
                        </p>
                        <p className="text-sm text-muted-foreground mb-1">
                          申請金額: {formatAmount(app.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          提交日期: {app.submitDate}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 進度追蹤詳情 */}
          <div>
            {selectedApplication ? (
              <ProgressTracking applicationId={selectedApplication} />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      請選擇一個申請案件查看詳細進度
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ApplicationTracking;
