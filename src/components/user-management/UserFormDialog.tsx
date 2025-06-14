
import React from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

const userFormSchema = z.object({
  name: z.string().min(2, { message: "名稱至少需要2個字元" }),
  email: z.string().email({ message: "請輸入有效的電子郵件" }),
  role: z.enum(["admin", "manager", "user"], { message: "請選擇有效的角色" }),
  unitId: z.number({ message: "請選擇單位" }),
  status: z.enum(["active", "inactive"], { message: "請選擇狀態" })
});

type UserFormValues = z.infer<typeof userFormSchema>;

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

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "user";
  unitId: number;
  status: "active" | "inactive";
  lastLogin: string;
}

interface UserFormDialogProps {
  userDialogOpen: boolean;
  setUserDialogOpen: (open: boolean) => void;
  editingUser: User | null;
  userForm: UseFormReturn<UserFormValues>;
  onUserSubmit: (data: UserFormValues) => void;
  units: Unit[];
}

const UserFormDialog: React.FC<UserFormDialogProps> = ({
  userDialogOpen,
  setUserDialogOpen,
  editingUser,
  userForm,
  onUserSubmit,
  units
}) => {
  return (
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
  );
};

export default UserFormDialog;
