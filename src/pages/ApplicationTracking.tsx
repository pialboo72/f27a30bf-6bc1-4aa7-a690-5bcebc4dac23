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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { Trash } from "lucide-react";

interface Application {
  id: number;
  activityName: string;
  submitDate: string;
  amount: number;
  reviewAgency: string;
  lastUpdate: string;
  status: string;
}

const ApplicationTracking: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      activityName: "青年藝術發展計劃",
      submitDate: "2025-03-15",
      amount: 50000,
      reviewAgency: "文化部",
      lastUpdate: "2025-03-20",
      status: "審核中"
    },
    {
      id: 2,
      activityName: "社區服務計劃",
      submitDate: "2025-03-10",
      amount: 30000,
      reviewAgency: "教育部",
      lastUpdate: "2025-03-18",
      status: "已核准"
    },
  ]);

  const handleDeleteApplication = (id: number) => {
    if (window.confirm("確定要刪除此申請案嗎？")) {
      setApplications(applications.filter(app => app.id !== id));
      toast.success("申請案已刪除");
    }
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setApplications(applications.map(app => 
      app.id === id ? { 
        ...app, 
        status: newStatus,
        lastUpdate: new Date().toISOString().split('T')[0]
      } : app
    ));
    toast.success("狀態已更新");
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
                      <Select
                        value={app.status}
                        onValueChange={(value) => handleStatusChange(app.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="選擇狀態" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="待審核">待審核</SelectItem>
                          <SelectItem value="審核中">審核中</SelectItem>
                          <SelectItem value="補件中">補件中</SelectItem>
                          <SelectItem value="已核准">已核准</SelectItem>
                          <SelectItem value="已駁回">已駁回</SelectItem>
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
