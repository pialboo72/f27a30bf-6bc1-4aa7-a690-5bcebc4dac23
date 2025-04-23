
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import MainLayout from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/badge";

const ApplicationTracking: React.FC = () => {
  // 模擬申請案數據
  const applications = [
    {
      id: 1,
      activityName: "青年藝術發展計劃",
      submitDate: "2025-03-15",
      status: "審核中",
      amount: 50000,
      reviewer: "王科長",
      lastUpdate: "2025-03-20",
    },
    {
      id: 2,
      activityName: "社區服務計劃",
      submitDate: "2025-03-10",
      status: "已核准",
      amount: 30000,
      reviewer: "李科長",
      lastUpdate: "2025-03-18",
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      "審核中": "bg-yellow-500",
      "已核准": "bg-green-500",
      "已駁回": "bg-red-500",
      "補件中": "bg-blue-500",
    };
    return styles[status as keyof typeof styles] || "bg-gray-500";
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
                  <TableHead>審核人員</TableHead>
                  <TableHead>最後更新</TableHead>
                  <TableHead>狀態</TableHead>
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
                    <TableCell>{app.reviewer}</TableCell>
                    <TableCell>{app.lastUpdate}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(app.status)}>
                        {app.status}
                      </Badge>
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
