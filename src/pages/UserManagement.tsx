import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layout/MainLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Building, Users, Plus, Edit, X, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";

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

        {/* Search and filters */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Input
                  placeholder="搜尋單位或用戶..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label>篩選單位：</Label>
                <Select 
                  value={selectedUnitId?.toString() || "all"} 
                  onValueChange={(value) => setSelectedUnitId(value === "all" ? null : parseInt(value))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有單位</SelectItem>
                    {units.map(unit => (
                      <SelectItem key={unit.id} value={unit.id.toString()}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Units Table */}
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
                      <Button variant="outline" size="sm" onClick={() => handleAddUser(unit.id)}>
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

        {/* Users Table */}
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

        {/* Unit Form Dialog */}
        <Dialog open={unitDialogOpen} onOpenChange={setUnitDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingUnit ? "編輯單位" : "新增單位"}</DialogTitle>
              <DialogDescription>
                填寫以下資料以{editingUnit ? "更新現有" : "建立新的"}單位
              </DialogDescription>
            </DialogHeader>

            <Form {...unitForm}>
              <form onSubmit={unitForm.handleSubmit(onUnitSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={unitForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>單位名稱 <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="輸入單位名稱" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={unitForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>會址 <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="輸入單位會址" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={unitForm.control}
                    name="registrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>立案字號</FormLabel>
                        <FormControl>
                          <Input placeholder="輸入立案字號" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={unitForm.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>統一編號 <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="輸入8位數字統一編號" maxLength={8} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={unitForm.control}
                    name="representative"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>負責人 <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="輸入負責人姓名" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={unitForm.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>聯絡人</FormLabel>
                        <FormControl>
                          <Input placeholder="輸入聯絡人姓名" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={unitForm.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>銀行名稱</FormLabel>
                        <FormControl>
                          <Input placeholder="銀行名稱" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={unitForm.control}
                    name="bankAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>銀行帳號</FormLabel>
                        <FormControl>
                          <Input placeholder="銀行帳號" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={unitForm.control}
                    name="accountName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>戶名</FormLabel>
                        <FormControl>
                          <Input placeholder="戶名" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={unitForm.control}
                    name="manager"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>承辦人</FormLabel>
                        <FormControl>
                          <Input placeholder="輸入承辦人姓名" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={unitForm.control}
                    name="accountant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>會計</FormLabel>
                        <FormControl>
                          <Input placeholder="輸入會計姓名" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={unitForm.control}
                    name="cashier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>出納</FormLabel>
                        <FormControl>
                          <Input placeholder="輸入出納姓名" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setUnitDialogOpen(false)}>
                    取消
                  </Button>
                  <Button type="submit">
                    {editingUnit ? "更新" : "建立"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* User Form Dialog */}
        <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingUser ? "編輯用戶" : "新增用戶"}</DialogTitle>
              <DialogDescription>
                {editingUser ? "更新用戶資訊" : "填寫新用戶的詳細資料"}
              </DialogDescription>
            </DialogHeader>

            <Form {...userForm}>
              <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-6">
                <FormField
                  control={userForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>用戶名稱</FormLabel>
                      <FormControl>
                        <Input placeholder="輸入用戶名稱" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={userForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>電子郵件</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@mail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={userForm.control}
                  name="unitId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>所屬單位</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="選擇單位" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {units.map(unit => (
                            <SelectItem key={unit.id} value={unit.id.toString()}>
                              {unit.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={userForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>角色</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">系統管理員</SelectItem>
                            <SelectItem value="manager">部門管理員</SelectItem>
                            <SelectItem value="user">一般用戶</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={userForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>狀態</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">啟用</SelectItem>
                            <SelectItem value="inactive">停用</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setUserDialogOpen(false)}>
                    取消
                  </Button>
                  <Button type="submit">
                    {editingUser ? "保存修改" : "新增用戶"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>確認刪除</DialogTitle>
              <DialogDescription>
                您確定要刪除此{deleteTarget?.type === 'unit' ? '單位' : '用戶'}嗎？此操作無法撤銷。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleting(false)}>
                取消
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                確認刪除
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default UserManagement;
