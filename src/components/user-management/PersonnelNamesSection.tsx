
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { UnitFormValues } from "@/schemas/user-management-schemas";

interface PersonnelNamesSectionProps {
  unitForm: UseFormReturn<UnitFormValues>;
}

const PersonnelNamesSection: React.FC<PersonnelNamesSectionProps> = ({ unitForm }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">人員姓名設定</h3>
      <div className="grid grid-cols-4 gap-4">
        <FormField
          control={unitForm.control}
          name="manager"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {unitForm.watch("managerTitle") || "承辦人"}姓名
              </FormLabel>
              <FormControl>
                <Input placeholder={`輸入${unitForm.watch("managerTitle") || "承辦人"}姓名`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={unitForm.control}
          name="accountant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {unitForm.watch("accountantTitle") || "會計"}姓名
              </FormLabel>
              <FormControl>
                <Input placeholder={`輸入${unitForm.watch("accountantTitle") || "會計"}姓名`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={unitForm.control}
          name="cashier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {unitForm.watch("cashierTitle") || "出納"}姓名
              </FormLabel>
              <FormControl>
                <Input placeholder={`輸入${unitForm.watch("cashierTitle") || "出納"}姓名`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={unitForm.control}
          name="supervisor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {unitForm.watch("supervisorTitle") || "負責人"}姓名
              </FormLabel>
              <FormControl>
                <Input placeholder={`輸入${unitForm.watch("supervisorTitle") || "負責人"}姓名`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PersonnelNamesSection;
