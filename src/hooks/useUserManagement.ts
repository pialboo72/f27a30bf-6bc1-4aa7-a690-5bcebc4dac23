import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Unit, User } from "@/types/user-management";
import { mockUnits, mockUsers } from "@/data/user-management-mock";
import { unitFormSchema, userFormSchema, UnitFormValues, UserFormValues } from "@/schemas/user-management-schemas";

export const useUserManagement = () => {
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
      supervisor: "",
      managerTitle: "承辦人",
      accountantTitle: "會計",
      cashierTitle: "出納",
      supervisorTitle: "負責人",
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
        supervisor: data.supervisor || "",
        managerTitle: data.managerTitle,
        accountantTitle: data.accountantTitle,
        cashierTitle: data.cashierTitle,
        supervisorTitle: data.supervisorTitle,
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

  const handleViewUsers = (unitId: number) => {
    setSelectedUnitId(unitId);
    toast.success(`已篩選顯示 ${getUnitName(unitId)} 的用戶列表`);
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

  return {
    // State
    units,
    users,
    searchTerm,
    setSearchTerm,
    selectedUnitId,
    setSelectedUnitId,
    unitDialogOpen,
    setUnitDialogOpen,
    userDialogOpen,
    setUserDialogOpen,
    editingUnit,
    editingUser,
    isDeleting,
    setIsDeleting,
    deleteTarget,
    unitForm,
    userForm,
    filteredUnits,
    filteredUsers,
    
    // Actions
    handleAddUnit,
    handleEditUnit,
    onUnitSubmit,
    handleAddUser,
    handleViewUsers,
    handleEditUser,
    onUserSubmit,
    handleDeleteConfirm,
    handleDelete,
    getUnitName,
    getUserCountByUnit,
  };
};
