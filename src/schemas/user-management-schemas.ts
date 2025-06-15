
import { z } from "zod";

const unitDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['establishment', 'bankbook', 'certificate']),
  url: z.string(),
  uploadedAt: z.string(),
});

export const unitFormSchema = z.object({
  name: z.string().min(1, "單位名稱為必填項目"),
  address: z.string().min(1, "地址為必填項目"),
  registrationNumber: z.string().optional(),
  representative: z.string().min(1, "代表人為必填項目"),
  contact: z.string().optional(),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
  postalCode: z.string().optional(),
  taxId: z.string().min(1, "統一編號為必填項目"),
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  accountName: z.string().optional(),
  manager: z.string().optional(),
  accountant: z.string().optional(),
  cashier: z.string().optional(),
  supervisor: z.string().optional(),
  managerTitle: z.string().min(1, "承辦人職位名稱為必填項目"),
  accountantTitle: z.string().min(1, "會計職位名稱為必填項目"),
  cashierTitle: z.string().min(1, "出納職位名稱為必填項目"),
  supervisorTitle: z.string().min(1, "負責人職位名稱為必填項目"),
  documents: z.array(unitDocumentSchema).optional(),
});

export type UnitFormValues = z.infer<typeof unitFormSchema>;

export const userFormSchema = z.object({
  name: z.string().min(1, "姓名為必填項目"),
  email: z.string().email("請輸入有效的電子郵件地址"),
  role: z.enum(["admin", "manager", "user"]),
  unitId: z.number().min(1, "請選擇單位"),
  status: z.enum(["active", "inactive"]),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
