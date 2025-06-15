
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

interface PositionTitlesSectionProps {
  unitForm: UseFormReturn<UnitFormValues>;
}

const PositionTitlesSection: React.FC<PositionTitlesSectionProps> = ({ unitForm }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">職位名稱設定</h3>
      <div className="grid grid-cols-4 gap-4">
        <FormField
          control={unitForm.control}
          name="managerTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>承辦人職位名稱 <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="承辦人" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={unitForm.control}
          name="accountantTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>會計職位名稱 <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="會計" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={unitForm.control}
          name="cashierTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>出納職位名稱 <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="出納" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={unitForm.control}
          name="supervisorTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>負責人職位名稱 <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="負責人" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PositionTitlesSection;
