
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Unit, User } from "@/types/user-management";
import { userFormSchema, UserFormValues } from "@/schemas/user-management-schemas";
import { generateRandomPassword, sendPasswordEmail } from "@/utils/passwordUtils";

export const useUserOperations = (
  units: Unit[],
  users: User[],
  setUsers: (users: User[]) => void,
  setEditingUser: (user: User | null) => void,
  setUserDialogOpen: (open: boolean) => void,
  setSelectedUnitId: (id: number | null) => void,
  setDeleteTarget: (target: { type: 'unit' | 'user'; id: number } | null) => void,
  setIsDeleting: (deleting: boolean) => void
) => {
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

  const handleViewUsers = (unitId: number) => {
    setSelectedUnitId(unitId);
    const unitName = getUnitName(unitId);
    toast.success(`已篩選顯示 ${unitName} 的用戶列表`);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    userForm.reset(user);
    setUserDialogOpen(true);
  };

  const onUserSubmit = async (data: UserFormValues, editingUser: User | null) => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...data } : user
      ));
      toast.success("成功更新使用者資料");
    } else {
      try {
        // 生成隨機密碼
        const randomPassword = generateRandomPassword();
        
        // 取得單位名稱
        const unitName = getUnitName(data.unitId);
        
        // 發送密碼通知郵件
        await sendPasswordEmail(data.email, data.name, randomPassword, unitName);
        
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
        toast.success(`成功新增使用者，初始密碼已發送至 ${data.email}`);
      } catch (error) {
        toast.error("郵件發送失敗，請檢查郵件設定");
        console.error("Email sending failed:", error);
      }
    }
    setUserDialogOpen(false);
  };

  const handleDeleteUser = (id: number) => {
    setDeleteTarget({ type: 'user', id });
    setIsDeleting(true);
  };

  const executeUserDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    toast.success("成功刪除使用者");
  };

  const getUnitName = (unitId: number) => {
    return units.find(unit => unit.id === unitId)?.name || "未知單位";
  };

  return {
    userForm,
    handleAddUser,
    handleViewUsers,
    handleEditUser,
    onUserSubmit,
    handleDeleteUser,
    executeUserDelete,
    getUnitName,
  };
};
