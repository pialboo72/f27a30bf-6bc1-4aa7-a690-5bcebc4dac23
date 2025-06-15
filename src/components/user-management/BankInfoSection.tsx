
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

interface BankInfoSectionProps {
  unitForm: UseFormReturn<UnitFormValues>;
}

const BankInfoSection: React.FC<BankInfoSectionProps> = ({ unitForm }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <FormField
        control={unitForm.control}
        name="bankName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>銀行名稱</FormLabel>
            <FormControl>
              <Input placeholder="銀行名稱" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={unitForm.control}
        name="bankAccount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>銀行帳號</FormLabel>
            <FormControl>
              <Input placeholder="銀行帳號" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={unitForm.control}
        name="accountName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>戶名</FormLabel>
            <FormControl>
              <Input placeholder="戶名" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BankInfoSection;
