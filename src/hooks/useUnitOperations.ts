
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Unit, User } from "@/types/user-management";
import { unitFormSchema, UnitFormValues } from "@/schemas/user-management-schemas";

export const useUnitOperations = (
  units: Unit[], 
  setUnits: (units: Unit[]) => void,
  users: User[],
  setUsers: (users: User[]) => void,
  setEditingUnit: (unit: Unit | null) => void,
  setUnitDialogOpen: (open: boolean) => void,
  setDeleteTarget: (target: { type: 'unit' | 'user'; id: number } | null) => void,
  setIsDeleting: (deleting: boolean) => void
) => {
  const unitForm = useForm<UnitFormValues>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: {
      name: "",
      address: "",
      registrationNumber: "",
      representative: "",
      contact: "",
      contactPhone: "",
      contactAddress: "",
      postalCode: "",
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
      documents: [],
    }
  });

  const handleAddUnit = () => {
    setEditingUnit(null);
    unitForm.reset({
      name: "",
      address: "",
      registrationNumber: "",
      representative: "",
      contact: "",
      contactPhone: "",
      contactAddress: "",
      postalCode: "",
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
      documents: [],
    });
    setUnitDialogOpen(true);
  };

  const handleEditUnit = (unit: Unit) => {
    setEditingUnit(unit);
    unitForm.reset({
      ...unit,
      documents: unit.documents || [],
    });
    setUnitDialogOpen(true);
  };

  const onUnitSubmit = (data: UnitFormValues, editingUnit: Unit | null) => {
    if (editingUnit) {
      setUnits(units.map(unit => 
        unit.id === editingUnit.id ? { 
          ...unit, 
          ...data, 
          documents: (data.documents || []).map(doc => ({
            id: doc.id,
            name: doc.name,
            type: doc.type,
            url: doc.url,
            uploadedAt: doc.uploadedAt,
          }))
        } : unit
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
        contactPhone: data.contactPhone || "",
        contactAddress: data.contactAddress || "",
        postalCode: data.postalCode || "",
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
        documents: (data.documents || []).map(doc => ({
          id: doc.id,
          name: doc.name,
          type: doc.type,
          url: doc.url,
          uploadedAt: doc.uploadedAt,
        })),
      };
      setUnits([...units, newUnit]);
      toast.success("成功新增單位");
    }
    setUnitDialogOpen(false);
  };

  const handleDeleteUnit = (id: number) => {
    const hasUsers = users.some(user => user.unitId === id);
    if (hasUsers) {
      toast.error("無法刪除此單位，請先移除或轉移其下的使用者");
      return;
    }
    setDeleteTarget({ type: 'unit', id });
    setIsDeleting(true);
  };

  const executeUnitDelete = (id: number) => {
    setUnits(units.filter(unit => unit.id !== id));
    toast.success("成功刪除單位");
  };

  const getUserCountByUnit = (unitId: number) => {
    return users.filter(user => user.unitId === unitId).length;
  };

  return {
    unitForm,
    handleAddUnit,
    handleEditUnit,
    onUnitSubmit,
    handleDeleteUnit,
    executeUnitDelete,
    getUserCountByUnit,
  };
};
