
// Type definitions for user management
export interface Unit {
  id: number;
  name: string;
  address: string;
  registrationNumber: string;
  representative: string;
  contact: string;
  taxId: string;
  bankName: string;
  bankAccount: string;
  accountName: string;
  manager: string;
  accountant: string;
  cashier: string;
  supervisor: string; // 新增負責人欄位
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "user";
  unitId: number;
  status: "active" | "inactive";
  lastLogin: string;
}
