
import React from "react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { Building, Plus, ArrowLeft } from "lucide-react";

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

  const handleBackToUnits = () => {
    setSelectedUnitId(null);
    setSearchTerm("");
  };

  return (
    <MainLayout>
      <div className="fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              {selectedUnitId && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBackToUnits}
                  className="p-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h1 className="text-3xl font-bold">
                {selectedUnitId ? `${getUnitName(selectedUnitId)} - 用戶管理` : "單位與用戶管理"}
              </h1>
            </div>
            <p className="text-muted-foreground mt-1">
              {selectedUnitId ? "管理該單位的使用者帳號" : "以單位為核心管理系統使用者"}
            </p>
          </div>
          <div className="flex gap-2">
            {!selectedUnitId && (
              <Button onClick={handleAddUnit} variant="outline">
                <Building className="mr-1 h-4 w-4" />
                新增單位
              </Button>
            )}
            <Button onClick={() => handleAddUser(selectedUnitId || undefined)}>
              <Plus className="mr-1 h-4 w-4" />
              新增用戶
            </Button>
          </div>
        </div>

        {!selectedUnitId ? (
          <>
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
          </>
        ) : (
          <>
            <SearchAndFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedUnitId={selectedUnitId}
              setSelectedUnitId={setSelectedUnitId}
              units={units}
            />

            <UsersTable
              filteredUsers={filteredUsers}
              getUnitName={getUnitName}
              handleEditUser={handleEditUser}
              handleDeleteConfirm={handleDeleteConfirm}
            />
          </>
        )}

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
