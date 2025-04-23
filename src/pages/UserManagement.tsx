
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Users, Plus, Edit, X, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// User type definition
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "user";
  department: string;
  status: "active" | "inactive";
  lastLogin: string;
}

// 使用者數據
const mockUsers: User[] = [
  {
    id: 1,
    name: "張小明",
    email: "ming@example.com",
    role: "admin",
    department: "資訊部",
    status: "active",
    lastLogin: "2025-04-20 14:30"
  },
  {
    id: 2,
    name: "李大華",
    email: "dahua@example.com",
    role: "manager",
    department: "文化部",
    status: "active",
    lastLogin: "2025-04-22 09:15"
  },
  {
    id: 3,
    name: "王美玲",
    email: "meiling@example.com",
    role: "user",
    department: "藝術科",
    status: "inactive",
    lastLogin: "2025-03-30 11:42"
  },
  {
    id: 4,
    name: "陳志明",
    email: "zhiming@example.com",
    role: "user",
    department: "體育組",
    status: "active",
    lastLogin: "2025-04-21 16:05"
  }
];

// 表單驗證模式
const userFormSchema = z.object({
  name: z.string().min(2, { message: "名稱至少需要2個字元" }),
  email: z.string().email({ message: "請輸入有效的電子郵件" }),
  role: z.enum(["admin", "manager", "user"], { message: "請選擇有效的角色" }),
  department: z.string().min(1, { message: "請輸入部門" }),
  status: z.enum(["active", "inactive"], { message: "請選擇狀態" })
});

type UserFormValues = z.infer<typeof userFormSchema>;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // 初始化表單
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      department: "",
      status: "active"
    }
  });

  // 過濾用戶
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 開啟新增對話框
  const handleAddUser = () => {
    setEditingUser(null);
    form.reset({
      name: "",
      email: "",
      role: "user",
      department: "",
      status: "active"
    });
    setDialogOpen(true);
  };

  // 開啟編輯對話框
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status
    });
    setDialogOpen(true);
  };

  // 處理表單提交
  const onSubmit = (data: UserFormValues) => {
    if (editingUser) {
      // 更新用戶
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...data } : user
      ));
      toast.success("成功更新使用者資料");
    } else {
      // 新增用戶
      const newUser: User = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        status: data.status,
        lastLogin: "尚未登入"
      };
      setUsers([...users, newUser]);
      toast.success("成功新增使用者");
    }
    setDialogOpen(false);
  };

  // 確認刪除對話框
  const handleDeleteConfirm = (id: number) => {
    setUserToDelete(id);
    setIsDeleting(true);
  };

  // 處理刪除
  const handleDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(user => user.id !== userToDelete));
      toast.success("成功刪除使用者");
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  // 角色對應的徽章樣式
  const roleBadgeStyles = {
    admin: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    manager: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    user: "bg-gray-100 text-gray-800 hover:bg-gray-200"
  };

  // 角色中文名稱
  const roleNames = {
    admin: "系統管理員",
    manager: "部門管理員",
    user: "一般用戶"
  };

  // 狀態中文名稱和樣式
  const statusInfo = {
    active: { label: "啟用", class: "bg-green-100 text-green-800 hover:bg-green-200" },
    inactive: { label: "停用", class: "bg-red-100 text-red-800 hover:bg-red-200" }
  };

  return (
    <MainLayout>
      <div className="fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">用戶管理</h1>
            <p className="text-muted-foreground mt-1">管理系統使用者帳號</p>
          </div>
          <Button onClick={handleAddUser}>
            <Plus className="mr-1 h-4 w-4" />
            新增用戶
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">用戶列表</CardTitle>
              <div className="relative w-64">
                <Input
                  placeholder="搜尋用戶..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名稱</TableHead>
                  <TableHead>電子郵件</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>部門</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead>最近登入</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={roleBadgeStyles[user.role]}>
                        {roleNames[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
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
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteConfirm(user.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 用戶表單對話框 */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingUser ? "編輯用戶" : "新增用戶"}</DialogTitle>
              <DialogDescription>
                {editingUser ? "更新用戶資訊" : "填寫新用戶的詳細資料"}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>角色</FormLabel>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="admin">系統管理員</option>
                          <option value="manager">部門管理員</option>
                          <option value="user">一般用戶</option>
                        </select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>狀態</FormLabel>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="active">啟用</option>
                          <option value="inactive">停用</option>
                        </select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>部門</FormLabel>
                      <FormControl>
                        <Input placeholder="輸入部門名稱" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
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

        {/* 刪除確認對話框 */}
        <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>確認刪除</DialogTitle>
              <DialogDescription>
                您確定要刪除此用戶嗎？此操作無法撤銷。
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
