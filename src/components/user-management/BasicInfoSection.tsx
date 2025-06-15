
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

interface BasicInfoSectionProps {
  unitForm: UseFormReturn<UnitFormValues>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ unitForm }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={unitForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>單位名稱 <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="輸入單位名稱" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={unitForm.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>會址 <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="輸入單位會址" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={unitForm.control}
          name="registrationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>立案字號</FormLabel>
              <FormControl>
                <Input placeholder="輸入立案字號" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={unitForm.control}
          name="taxId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>統一編號 <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="輸入8位數字統一編號" maxLength={8} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={unitForm.control}
          name="representative"
          render={({ field }) => (
            <FormItem>
              <FormLabel>負責人 <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="輸入負責人姓名" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={unitForm.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>聯絡人</FormLabel>
              <FormControl>
                <Input placeholder="輸入聯絡人姓名" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <FormField
          control={unitForm.control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>聯絡電話</FormLabel>
              <FormControl>
                <Input placeholder="輸入聯絡電話" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={unitForm.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>郵遞區號</FormLabel>
              <FormControl>
                <Input placeholder="6碼郵遞區號" maxLength={6} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={unitForm.control}
          name="contactAddress"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>聯絡地址</FormLabel>
              <FormControl>
                <Input placeholder="輸入聯絡地址" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
