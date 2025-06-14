
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
import { Building, Users, Edit, Trash } from "lucide-react";

interface Unit {
  id: number;
  name: string;
  address: string;
  registrationNumber: string;
  representative: string;
  contact: string;
  taxId: string;
  bankName: string;
  bankAccount: string;
  accountName: string;
  manager: string;
  accountant: string;
  cashier: string;
}

interface UnitsTableProps {
  filteredUnits: Unit[];
  getUserCountByUnit: (unitId: number) => number;
  handleViewUsers: (unitId: number) => void;
  handleEditUnit: (unit: Unit) => void;
  handleDeleteConfirm: (type: 'unit' | 'user', id: number) => void;
}

const UnitsTable: React.FC<UnitsTableProps> = ({
  filteredUnits,
  getUserCountByUnit,
  handleViewUsers,
  handleEditUnit,
  handleDeleteConfirm
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          單位列表
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>單位名稱</TableHead>
              <TableHead>負責人</TableHead>
              <TableHead>統一編號</TableHead>
              <TableHead>用戶數量</TableHead>
              <TableHead>銀行帳戶</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUnits.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell className="font-medium">{unit.name}</TableCell>
                <TableCell>{unit.representative}</TableCell>
                <TableCell>{unit.taxId}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getUserCountByUnit(unit.id)} 人
                  </Badge>
                </TableCell>
                <TableCell>{unit.bankName} {unit.bankAccount}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewUsers(unit.id)} title="查看該單位用戶">
                    <Users className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditUnit(unit)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteConfirm('unit', unit.id)}>
                    <Trash className="h-4 w-4" />
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

export default UnitsTable;
