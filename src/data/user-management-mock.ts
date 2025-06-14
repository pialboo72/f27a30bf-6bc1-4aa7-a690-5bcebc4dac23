
import { Unit, User } from "@/types/user-management";

// Mock data for units and users
export const mockUnits: Unit[] = [
  {
    id: 1,
    name: "台北市文化基金會",
    address: "台北市信義區市府路1號",
    registrationNumber: "台內團字第1070001234號",
    representative: "王大明",
    contact: "張小華",
    taxId: "12345678",
    bankName: "第一銀行",
    bankAccount: "12345678901234",
    accountName: "台北市文化基金會",
    manager: "林經理",
    accountant: "陳會計",
    cashier: "李出納"
  },
  {
    id: 2,
    name: "高雄市藝術發展協會",
    address: "高雄市鹽埕區七賢三路123號",
    registrationNumber: "高市團字第1080009876號",
    representative: "黃明華",
    contact: "謝小玲",
    taxId: "87654321",
    bankName: "合作金庫",
    bankAccount: "98765432109876",
    accountName: "高雄市藝術發展協會",
    manager: "陳經理",
    accountant: "林會計",
    cashier: "王出納"
  }
];

export const mockUsers: User[] = [
  {
    id: 1,
    name: "張小明",
    email: "ming@example.com",
    role: "admin",
    unitId: 1,
    status: "active",
    lastLogin: "2025-04-20 14:30"
  },
  {
    id: 2,
    name: "李大華",
    email: "dahua@example.com",
    role: "manager",
    unitId: 1,
    status: "active",
    lastLogin: "2025-04-22 09:15"
  },
  {
    id: 3,
    name: "王美玲",
    email: "meiling@example.com",
    role: "user",
    unitId: 2,
    status: "inactive",
    lastLogin: "2025-03-30 11:42"
  },
  {
    id: 4,
    name: "陳志明",
    email: "zhiming@example.com",
    role: "user",
    unitId: 2,
    status: "active",
    lastLogin: "2025-04-21 16:05"
  }
];
