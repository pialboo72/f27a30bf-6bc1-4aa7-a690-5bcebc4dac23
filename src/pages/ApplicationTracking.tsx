
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash } from "lucide-react";

type ApplicationStatus = "準備中" | "待送件" | "待核定" | "待核銷" | "待撥款" | "已結案";

interface Application {
  id: number;
  activityName: string;
  submitDate: string;
  status: string;
  amount: number;
  reviewAgency: string;
  lastUpdate: string;
  progress: ApplicationStatus;
}

const ApplicationTracking: React.FC = () => {
  // 模擬申請案數據
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      activityName: "青年藝術發展計劃",
      submitDate: "2025-03-15",
      status: "審核中",
      amount: 50000,
      reviewAgency: "文化部",
      lastUpdate: "2025-03-20",
      progress: "準備中"
    },
    {
      id: 2,
      activityName: "社區服務計劃",
      submitDate: "2025-03-10",
      status: "已核准",
      amount: 30000,
      reviewAgency: "教育部",
      lastUpdate: "2025-03-18",
      progress: "待核定"
    },
  ]);

  const getStatusBadge = (status: string) => {
    const styles = {
      "審核中": "bg-yellow-500",
      "已核准": "bg-green-500",
      "已駁回": "bg-red-500",
      "補件中": "bg-blue-500",
    };
    return styles[status as keyof typeof styles] || "bg-gray-500";
  };

  const getProgressBadge = (progress: ApplicationStatus) => {
    const styles = {
      "準備中": "bg-purple-500",
      "待送件": "bg-blue-500",
      "待核定": "bg-yellow-500",
      "待核銷": "bg-orange-500",
      "待撥款": "bg-teal-500",
      "已結案": "bg-green-500",
    };
    return styles[progress];
  };

  const handleProgressChange = (id: number, value: ApplicationStatus) => {
    const updatedApplications = applications.map(app => 
      app.id === id ? { ...app, progress: value, lastUpdate: new Date().toISOString().split('T')[0] } : app
    );
    setApplications(updatedApplications);
    toast.success("進度已更新");
  };

  const handleDeleteApplication = (id: number) => {
    if (window.confirm("確定要刪除此申請案嗎？")) {
      setApplications(applications.filter(app => app.id !== id));
      toast.success("申請案已刪除");
    }
  };

  return (
    <MainLayout>
      <div className="fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">申請進度追蹤</h1>
          <p className="text-muted-foreground mt-1">
            查看您的補助申請案件進度
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>活動名稱</TableHead>
                  <TableHead>申請日期</TableHead>
                  <TableHead>申請金額</TableHead>
                  <TableHead>審核機關</TableHead>
                  <TableHead>最後更新</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead>進度</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      {app.activityName}
                    </TableCell>
                    <TableCell>{app.submitDate}</TableCell>
                    <TableCell>NT$ {app.amount.toLocaleString()}</TableCell>
                    <TableCell>{app.reviewAgency}</TableCell>
                    <TableCell>{app.lastUpdate}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(app.status)}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={app.progress} 
                        onValueChange={(value: ApplicationStatus) => handleProgressChange(app.id, value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="選擇進度" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="準備中">準備中</SelectItem>
                          <SelectItem value="待送件">待送件</SelectItem>
                          <SelectItem value="待核定">待核定</SelectItem>
                          <SelectItem value="待核銷">待核銷</SelectItem>
                          <SelectItem value="待撥款">待撥款</SelectItem>
                          <SelectItem value="已結案">已結案</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteApplication(app.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ApplicationTracking;
