import * as z from "zod";

// Form validation schemas
export const unitFormSchema = z.object({
  name: z.string().min(2, { message: "單位名稱至少需要2個字元" }),
  address: z.string().min(1, { message: "請輸入會址" }),
  registrationNumber: z.string().regex(/^\S*$/, { message: "請輸入立案字號" }).optional(),
  representative: z.string().min(1, { message: "請輸入負責人" }),
  contact: z.string().optional(),
  taxId: z.string().regex(/^\d{8}$/, { message: "統一編號必須為8位數字" }),
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  accountName: z.string().optional(),
  manager: z.string().optional(),
  accountant: z.string().optional(),
  cashier: z.string().optional(),
  supervisor: z.string().optional(),
  // 新增職位名稱驗證
  managerTitle: z.string().min(1, { message: "請輸入承辦人職位名稱" }),
  accountantTitle: z.string().min(1, { message: "請輸入會計職位名稱" }),
  cashierTitle: z.string().min(1, { message: "請輸入出納職位名稱" }),
  supervisorTitle: z.string().min(1, { message: "請輸入負責人職位名稱" }),
});

export const userFormSchema = z.object({
  name: z.string().min(2, { message: "名稱至少需要2個字元" }),
  email: z.string().email({ message: "請輸入有效的電子郵件" }),
  role: z.enum(["admin", "manager", "user"], { message: "請選擇有效的角色" }),
  unitId: z.number({ message: "請選擇單位" }),
  status: z.enum(["active", "inactive"], { message: "請選擇狀態" })
});

export type UnitFormValues = z.infer<typeof unitFormSchema>;
export type UserFormValues = z.infer<typeof userFormSchema>;
