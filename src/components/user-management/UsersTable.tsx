import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Users, Edit, X } from "lucide-react";
import { User } from "@/types/user-management";

interface UsersTableProps {
  filteredUsers: User[];
  getUnitName: (unitId: number) => string;
  handleEditUser: (user: User) => void;
  handleDeleteConfirm: (type: 'unit' | 'user', id: number) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  filteredUsers,
  getUnitName,
  handleEditUser,
  handleDeleteConfirm
}) => {
  const roleBadgeStyles = {
    admin: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    manager: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    user: "bg-gray-100 text-gray-800 hover:bg-gray-200"
  };

  const roleNames = {
    admin: "系統管理員",
    manager: "部門管理員",
    user: "一般用戶"
  };

  const statusInfo = {
    active: { label: "啟用", class: "bg-green-100 text-green-800 hover:bg-green-200" },
    inactive: { label: "停用", class: "bg-red-100 text-red-800 hover:bg-red-200" }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          用戶列表
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>所屬單位</TableHead>
              <TableHead>名稱</TableHead>
              <TableHead>電子郵件</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>最近登入</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{getUnitName(user.unitId)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={roleBadgeStyles[user.role]}>
                    {roleNames[user.role]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusInfo[user.status].class}>
                    {statusInfo[user.status].label}
                  </Badge>
                </TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteConfirm('user', user.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UsersTable;
