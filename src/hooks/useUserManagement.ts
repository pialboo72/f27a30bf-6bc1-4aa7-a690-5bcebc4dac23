
import { useState } from "react";
import { mockUnits, mockUsers } from "@/data/user-management-mock";
import { useDialogState } from "./useDialogState";
import { useUserManagementFilters } from "./useUserManagementFilters";
import { useUnitOperations } from "./useUnitOperations";
import { useUserOperations } from "./useUserOperations";

export const useUserManagement = () => {
  const [units, setUnits] = useState(mockUnits);
  const [users, setUsers] = useState(mockUsers);

  const {
    unitDialogOpen,
    setUnitDialogOpen,
    userDialogOpen,
    setUserDialogOpen,
    editingUnit,
    setEditingUnit,
    editingUser,
    setEditingUser,
    isDeleting,
    setIsDeleting,
    deleteTarget,
    setDeleteTarget,
  } = useDialogState();

  const {
    searchTerm,
    setSearchTerm,
    selectedUnitId,
    setSelectedUnitId,
    filteredUnits,
    filteredUsers,
  } = useUserManagementFilters(units, users);

  const {
    unitForm,
    handleAddUnit,
    handleEditUnit,
    onUnitSubmit: handleUnitSubmit,
    handleDeleteUnit,
    executeUnitDelete,
    getUserCountByUnit,
  } = useUnitOperations(
    units, 
    setUnits, 
    users, 
    setUsers,
    setEditingUnit,
    setUnitDialogOpen,
    setDeleteTarget,
    setIsDeleting
  );

  const {
    userForm,
    handleAddUser,
    handleViewUsers,
    handleEditUser,
    onUserSubmit: handleUserSubmit,
    handleDeleteUser,
    executeUserDelete,
    getUnitName,
  } = useUserOperations(
    units,
    users,
    setUsers,
    setEditingUser,
    setUserDialogOpen,
    setSelectedUnitId,
    setDeleteTarget,
    setIsDeleting
  );

  const onUnitSubmit = (data: any) => handleUnitSubmit(data, editingUnit);
  const onUserSubmit = (data: any) => handleUserSubmit(data, editingUser);

  const handleDeleteConfirm = (type: 'unit' | 'user', id: number) => {
    if (type === 'unit') {
      handleDeleteUnit(id);
    } else {
      handleDeleteUser(id);
    }
  };

  const handleDelete = () => {
    if (deleteTarget) {
      if (deleteTarget.type === 'unit') {
        executeUnitDelete(deleteTarget.id);
      } else {
        executeUserDelete(deleteTarget.id);
      }
      setIsDeleting(false);
      setDeleteTarget(null);
    }
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
