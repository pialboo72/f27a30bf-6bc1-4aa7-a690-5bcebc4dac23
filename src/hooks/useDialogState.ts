
import { useState } from "react";
import { Unit, User } from "@/types/user-management";

export const useDialogState = () => {
  const [unitDialogOpen, setUnitDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'unit' | 'user'; id: number } | null>(null);

  return {
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
  };
};
