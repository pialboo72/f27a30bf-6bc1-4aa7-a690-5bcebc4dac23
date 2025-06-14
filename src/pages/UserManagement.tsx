
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { Building, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Import the new components
import SearchAndFilters from "@/components/user-management/SearchAndFilters";
import UnitsTable from "@/components/user-management/UnitsTable";
import UsersTable from "@/components/user-management/UsersTable";
import UnitFormDialog from "@/components/user-management/UnitFormDialog";
import UserFormDialog from "@/components/user-management/UserFormDialog";
import DeleteConfirmDialog from "@/components/user-management/DeleteConfirmDialog";

// Unit type definition
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

// User type definition with unit reference
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "user";
  unitId: number;
  status: "active" | "inactive";
  lastLogin: string;
}

// Mock data
const mockUnits: Unit[] = [
  {
    id: 1,
    name: "台北市文化基金會",
    address: "台北市信義區市府路1號",
    registrationNumber: "台內團字第1070001234號",
    representative: "王大明",
    contact: "張小華",
    taxId: "12345678",
    bankName: "第一銀行",
    bankAccount: "12345678901234",
    accountName: "台北市文化基金會",
    manager: "林經理",
    accountant: "陳會計",
    cashier: "李出納"
  },
  {
    id: 2,
    name: "高雄市藝術發展協會",
    address: "高雄市鹽埕區七賢三路123號",
    registrationNumber: "高市團字第1080009876號",
    representative: "黃明華",
    contact: "謝小玲",
    taxId: "87654321",
    bankName: "合作金庫",
    bankAccount: "98765432109876",
    accountName: "高雄市藝術發展協會",
    manager: "陳經理",
    accountant: "林會計",
    cashier: "王出納"
  }
];

const mockUsers: User[] = [
  {
    id: 1,
    name: "張小明",
    email: "ming@example.com",
    role: "admin",
    unitId: 1,
    status: "active",
    lastLogin: "2025-04-20 14:30"
  },
  {
    id: 2,
    name: "李大華",
    email: "dahua@example.com",
    role: "manager",
    unitId: 1,
    status: "active",
    lastLogin: "2025-04-22 09:15"
  },
  {
    id: 3,
    name: "王美玲",
    email: "meiling@example.com",
    role: "user",
    unitId: 2,
    status: "inactive",
    lastLogin: "2025-03-30 11:42"
  },
  {
    id: 4,
    name: "陳志明",
    email: "zhiming@example.com",
    role: "user",
    unitId: 2,
    status: "active",
    lastLogin: "2025-04-21 16:05"
  }
];

// Form schemas
const unitFormSchema = z.object({
  name: z.string().min(2, { message: "單位名稱至少需要2個字元" }),
  address: z.string().min(1, { message: "請輸入會址" }),
  registrationNumber: z.string().regex(/^\S*$/, { message: "請輸入立案字號" }).optional(),
  representative: z.string().min(1, { message: "請輸入負責人" }),
  contact: z.string().optional(),
  taxId: z.string().regex(/^\d{8}$/, { message: "統一編號必須為8位數字" }),
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  accountName: z.string().optional(),
  manager: z.string().optional(),
  accountant: z.string().optional(),
  cashier: z.string().optional(),
});

const userFormSchema = z.object({
  name: z.string().min(2, { message: "名稱至少需要2個字元" }),
  email: z.string().email({ message: "請輸入有效的電子郵件" }),
  role: z.enum(["admin", "manager", "user"], { message: "請選擇有效的角色" }),
  unitId: z.number({ message: "請選擇單位" }),
  status: z.enum(["active", "inactive"], { message: "請選擇狀態" })
});

type UnitFormValues = z.infer<typeof unitFormSchema>;
type UserFormValues = z.infer<typeof userFormSchema>;

const UserManagement: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  
  // Dialog states
  const [unitDialogOpen, setUnitDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'unit' | 'user'; id: number } | null>(null);

  // Forms
  const unitForm = useForm<UnitFormValues>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: {
      name: "",
      address: "",
      registrationNumber: "",
      representative: "",
      contact: "",
      taxId: "",
      bankName: "",
      bankAccount: "",
      accountName: "",
      manager: "",
      accountant: "",
      cashier: "",
    }
  });

  const userForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      unitId: 0,
      status: "active"
    }
  });

  // Filter logic
  const filteredUnits = units.filter(unit => 
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.representative.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.taxId.includes(searchTerm)
  );

  const filteredUsers = users.filter(user => {
    const unit = units.find(u => u.id === user.unitId);
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch && (selectedUnitId === null || user.unitId === selectedUnitId);
  });

  // Unit operations
  const handleAddUnit = () => {
    setEditingUnit(null);
    unitForm.reset();
    setUnitDialogOpen(true);
  };

  const handleEditUnit = (unit: Unit) => {
    setEditingUnit(unit);
    unitForm.reset(unit);
    setUnitDialogOpen(true);
  };

  const onUnitSubmit = (data: UnitFormValues) => {
    if (editingUnit) {
      setUnits(units.map(unit => 
        unit.id === editingUnit.id ? { ...unit, ...data } : unit
      ));
      toast.success("成功更新單位資料");
    } else {
      const newUnit: Unit = {
        id: Date.now(),
        name: data.name,
        address: data.address,
        registrationNumber: data.registrationNumber || "",
        representative: data.representative,
        contact: data.contact || "",
        taxId: data.taxId,
        bankName: data.bankName || "",
        bankAccount: data.bankAccount || "",
        accountName: data.accountName || "",
        manager: data.manager || "",
        accountant: data.accountant || "",
        cashier: data.cashier || "",
      };
      setUnits([...units, newUnit]);
      toast.success("成功新增單位");
    }
    setUnitDialogOpen(false);
  };

  // User operations
  const handleAddUser = (unitId?: number) => {
    setEditingUser(null);
    userForm.reset({
      name: "",
      email: "",
      role: "user",
      unitId: unitId || 0,
      status: "active"
    });
    setUserDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    userForm.reset(user);
    setUserDialogOpen(true);
  };

  const onUserSubmit = (data: UserFormValues) => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...data } : user
      ));
      toast.success("成功更新使用者資料");
    } else {
      const newUser: User = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        role: data.role,
        unitId: data.unitId,
        status: data.status,
        lastLogin: "尚未登入"
      };
      setUsers([...users, newUser]);
      toast.success("成功新增使用者");
    }
    setUserDialogOpen(false);
  };

  // Delete operations
  const handleDeleteConfirm = (type: 'unit' | 'user', id: number) => {
    if (type === 'unit') {
      const hasUsers = users.some(user => user.unitId === id);
      if (hasUsers) {
        toast.error("無法刪除此單位，請先移除或轉移其下的使用者");
        return;
      }
    }
    setDeleteTarget({ type, id });
    setIsDeleting(true);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      if (deleteTarget.type === 'unit') {
        setUnits(units.filter(unit => unit.id !== deleteTarget.id));
        toast.success("成功刪除單位");
      } else {
        setUsers(users.filter(user => user.id !== deleteTarget.id));
        toast.success("成功刪除使用者");
      }
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  // Helper functions
  const getUnitName = (unitId: number) => {
    return units.find(unit => unit.id === unitId)?.name || "未知單位";
  };

  const getUserCountByUnit = (unitId: number) => {
    return users.filter(user => user.unitId === unitId).length;
  };

  return (
    <MainLayout>
      <div className="fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">單位與用戶管理</h1>
            <p className="text-muted-foreground mt-1">以單位為核心管理系統使用者</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddUnit} variant="outline">
              <Building className="mr-1 h-4 w-4" />
              新增單位
            </Button>
            <Button onClick={() => handleAddUser()}>
              <Plus className="mr-1 h-4 w-4" />
              新增用戶
            </Button>
          </div>
        </div>

        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedUnitId={selectedUnitId}
          setSelectedUnitId={setSelectedUnitId}
          units={units}
        />

        <UnitsTable
          filteredUnits={filteredUnits}
          getUserCountByUnit={getUserCountByUnit}
          handleAddUser={handleAddUser}
          handleEditUnit={handleEditUnit}
          handleDeleteConfirm={handleDeleteConfirm}
        />

        <UsersTable
          filteredUsers={filteredUsers}
          getUnitName={getUnitName}
          handleEditUser={handleEditUser}
          handleDeleteConfirm={handleDeleteConfirm}
        />

        <UnitFormDialog
          unitDialogOpen={unitDialogOpen}
          setUnitDialogOpen={setUnitDialogOpen}
          editingUnit={editingUnit}
          unitForm={unitForm}
          onUnitSubmit={onUnitSubmit}
        />

        <UserFormDialog
          userDialogOpen={userDialogOpen}
          setUserDialogOpen={setUserDialogOpen}
          editingUser={editingUser}
          userForm={userForm}
          onUserSubmit={onUserSubmit}
          units={units}
        />

        <DeleteConfirmDialog
          isDeleting={isDeleting}
          setIsDeleting={setIsDeleting}
          deleteTarget={deleteTarget}
          handleDelete={handleDelete}
        />
      </div>
    </MainLayout>
  );
};

export default UserManagement;
