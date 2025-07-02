
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash, Calendar, MapPin } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';

interface Activity {
  id: number;
  name: string;
  category: string;
  status: string;
  location: string;
  date: string;
  participants: number;
  budget: number;
  description: string;
  subsidyProgram: string;
}

interface ActivityManagementTableProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

const ActivityManagementTable: React.FC<ActivityManagementTableProps> = ({
  activities,
  onEdit,
  onDelete,
  onAdd
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case '進行中': return 'default';
      case '籌備中': return 'secondary';
      case '已完成': return 'outline';
      case '已取消': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>活動列表</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>活動名稱</TableHead>
                  <TableHead>分類</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead>地點</TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead>預算</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map(activity => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{activity.name}</div>
                        <div className="text-sm text-muted-foreground">{activity.subsidyProgram}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{activity.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(activity.status) as any}>
                        {activity.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                        {activity.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                        {activity.date}
                      </div>
                    </TableCell>
                    <TableCell>NT$ {activity.budget.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline" 
                          size="sm" 
                          onClick={() => onEdit(activity)}
                          title="編輯"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 hover:text-red-700" 
                          onClick={() => onDelete(activity.id)}
                          title="刪除"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-2">沒有找到符合條件的活動</p>
            <Button variant="outline" onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" />
              建立活動
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityManagementTable;
