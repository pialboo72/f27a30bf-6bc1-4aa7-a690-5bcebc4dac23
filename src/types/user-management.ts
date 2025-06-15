
// Type definitions for user management
export interface UnitDocument {
  id: string;
  name: string;
  type: 'establishment' | 'bankbook' | 'certificate';
  url: string;
  uploadedAt: string;
}

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
  supervisor: string;
  managerTitle: string;
  accountantTitle: string;
  cashierTitle: string;
  supervisorTitle: string;
  documents?: UnitDocument[];
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
