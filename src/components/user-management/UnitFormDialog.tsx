
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { Unit } from "@/types/user-management";
import { UnitFormValues } from "@/schemas/user-management-schemas";
import BasicInfoSection from "./BasicInfoSection";
import BankInfoSection from "./BankInfoSection";
import PositionTitlesSection from "./PositionTitlesSection";
import PersonnelNamesSection from "./PersonnelNamesSection";
import DocumentUploadSection from "./DocumentUploadSection";

interface UnitFormDialogProps {
  unitDialogOpen: boolean;
  setUnitDialogOpen: (open: boolean) => void;
  editingUnit: Unit | null;
  unitForm: UseFormReturn<UnitFormValues>;
  onUnitSubmit: (data: UnitFormValues) => void;
}

const UnitFormDialog: React.FC<UnitFormDialogProps> = ({
  unitDialogOpen,
  setUnitDialogOpen,
  editingUnit,
  unitForm,
  onUnitSubmit
}) => {
  return (
    <Dialog open={unitDialogOpen} onOpenChange={setUnitDialogOpen}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingUnit ? "編輯單位" : "新增單位"}</DialogTitle>
          <DialogDescription>
            填寫以下資料以{editingUnit ? "更新現有" : "建立新的"}單位
          </DialogDescription>
        </DialogHeader>

        <Form {...unitForm}>
          <form onSubmit={unitForm.handleSubmit(onUnitSubmit)} className="space-y-6">
            <BasicInfoSection unitForm={unitForm} />
            <BankInfoSection unitForm={unitForm} />
            <PositionTitlesSection unitForm={unitForm} />
            <PersonnelNamesSection unitForm={unitForm} />
            <DocumentUploadSection unitForm={unitForm} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setUnitDialogOpen(false)}>
                取消
              </Button>
              <Button type="submit">
                {editingUnit ? "更新" : "建立"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UnitFormDialog;
