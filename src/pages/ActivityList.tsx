import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Plus, Pencil, Copy, Trash2, Download, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { useFiles } from "@/contexts/FileContext";

const ActivityList: React.FC = () => {
  const { downloadFile } = useFiles();
  
  // 模擬活動數據
  const activities = [
    {
      id: 1,
      name: "青年藝術發展計劃",
      category: "文化藝術",
      date: "2025-05-01",
      status: "草稿",
    },
    {
      id: 2,
      name: "社區服務計劃",
      category: "社區服務",
      date: "2025-06-15",
      status: "已提交",
    },
  ];

  const handleDelete = (id: number) => {
    // 實際應用中需要與後端API整合
    toast.success("活動已刪除");
  };

  const handleCopy = (id: number) => {
    // 實際應用中需要與後端API整合
    toast.success("活動已複製");
  };

  const handleDownload = (id: number) => {
    downloadFile(id);
  };

  const handlePrint = (id: number) => {
    // Implement print functionality
    window.print();
    toast.success("正在列印文件");
  };

  return (
    <MainLayout>
      <div className="fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">活動管理</h1>
            <p className="text-muted-foreground mt-1">
              在這裡管理您的所有活動申請案
            </p>
          </div>
          <Button asChild>
            <Link to="/activity/new">
              <Plus className="mr-2 h-4 w-4" />
              新增活動
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>活動名稱</TableHead>
                  <TableHead>類別</TableHead>
                  <TableHead>活動日期</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      {activity.name}
                    </TableCell>
                    <TableCell>{activity.category}</TableCell>
                    <TableCell>{activity.date}</TableCell>
                    <TableCell>{activity.status}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                        >
                          <Link to={`/activity/${activity.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDownload(activity.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePrint(activity.id)}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopy(activity.id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(activity.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

export default ActivityList;
