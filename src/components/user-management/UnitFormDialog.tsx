
import React from "react";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Unit } from "@/types/user-management";
import { UnitFormValues } from "@/schemas/user-management-schemas";

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
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{editingUnit ? "編輯單位" : "新增單位"}</DialogTitle>
          <DialogDescription>
            填寫以下資料以{editingUnit ? "更新現有" : "建立新的"}單位
          </DialogDescription>
        </DialogHeader>

        <Form {...unitForm}>
          <form onSubmit={unitForm.handleSubmit(onUnitSubmit)} className="space-y-6">
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

            {/* 職位名稱設定區域 */}
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

            {/* 人員姓名設定區域 */}
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
