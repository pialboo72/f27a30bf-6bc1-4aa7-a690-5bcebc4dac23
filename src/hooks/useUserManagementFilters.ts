
import { useState } from "react";
import { Unit, User } from "@/types/user-management";

export const useUserManagementFilters = (units: Unit[], users: User[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);

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

  return {
    searchTerm,
    setSearchTerm,
    selectedUnitId,
    setSelectedUnitId,
    filteredUnits,
    filteredUsers,
  };
};
