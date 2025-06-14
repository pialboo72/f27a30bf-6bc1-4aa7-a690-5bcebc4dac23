
import React from "react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { Building, Plus } from "lucide-react";

// Import the new components
import SearchAndFilters from "@/components/user-management/SearchAndFilters";
import UnitsTable from "@/components/user-management/UnitsTable";
import UsersTable from "@/components/user-management/UsersTable";
import UnitFormDialog from "@/components/user-management/UnitFormDialog";
import UserFormDialog from "@/components/user-management/UserFormDialog";
import DeleteConfirmDialog from "@/components/user-management/DeleteConfirmDialog";

// Import the custom hook
import { useUserManagement } from "@/hooks/useUserManagement";

const UserManagement: React.FC = () => {
  const {
    units,
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
  } = useUserManagement();

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
          handleViewUsers={handleViewUsers}
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
