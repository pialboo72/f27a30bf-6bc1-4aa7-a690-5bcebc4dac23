
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { Building, Plus, Search, Edit, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Unit {
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
}

const initialUnits: Unit[] = [
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

const UnitManagement: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null);
  const [isNewUnit, setIsNewUnit] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [representative, setRepresentative] = useState("");
  const [contact, setContact] = useState("");
  const [taxId, setTaxId] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [manager, setManager] = useState("");
  const [accountant, setAccountant] = useState("");
  const [cashier, setCashier] = useState("");

  const filteredUnits = units.filter(unit => 
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.representative.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.taxId.includes(searchTerm)
  );

  const handleAddUnit = () => {
    setIsNewUnit(true);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditUnit = (unit: Unit) => {
    setIsNewUnit(false);
    setCurrentUnit(unit);
    setName(unit.name);
    setAddress(unit.address);
    setRegistrationNumber(unit.registrationNumber);
    setRepresentative(unit.representative);
    setContact(unit.contact);
    setTaxId(unit.taxId);
    setBankName(unit.bankName);
    setBankAccount(unit.bankAccount);
    setAccountName(unit.accountName);
    setManager(unit.manager);
    setAccountant(unit.accountant);
    setCashier(unit.cashier);
    setIsDialogOpen(true);
  };

  const handleDeleteUnit = (id: number) => {
    if (window.confirm("確定要刪除此單位嗎？")) {
      setUnits(units.filter(unit => unit.id !== id));
      toast.success("單位已刪除");
    }
  };

  const resetForm = () => {
    setName("");
    setAddress("");
    setRegistrationNumber("");
    setRepresentative("");
    setContact("");
    setTaxId("");
    setBankName("");
    setBankAccount("");
    setAccountName("");
    setManager("");
    setAccountant("");
    setCashier("");
    setCurrentUnit(null);
  };

  const validateTaxId = (value: string) => {
    const taxIdRegex = /^\d{8}$/;
    return taxIdRegex.test(value);
  };

  const handleSave = () => {
    if (!name || !address || !representative || !taxId) {
      toast.error("請填寫所有必填欄位");
      return;
    }

    if (!validateTaxId(taxId)) {
      toast.error("統一編號必須為8位數字");
      return;
    }

    const unitData: Unit = {
      id: isNewUnit ? Date.now() : currentUnit?.id!,
      name,
      address,
      registrationNumber,
      representative,
      contact,
      taxId,
      bankName,
      bankAccount,
      accountName,
      manager,
      accountant,
      cashier
    };

    if (isNewUnit) {
      setUnits([...units, unitData]);
      toast.success("新單位已建立");
    } else {
      setUnits(units.map(u => u.id === currentUnit?.id ? unitData : u));
      toast.success("單位資料已更新");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handlePageClick = (pageNumber: number) => {
    console.log(`切換到第 ${pageNumber} 頁`);
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">單位管理</h1>
            <p className="text-muted-foreground mt-1">管理系統中的單位資料</p>
          </div>
          <Button onClick={handleAddUnit}>
            <Plus className="mr-2 h-4 w-4" />
            新增單位
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜尋單位名稱、負責人或統一編號..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>單位列表</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUnits.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>單位名稱</TableHead>
                      <TableHead>負責人</TableHead>
                      <TableHead>聯絡人</TableHead>
                      <TableHead>統一編號</TableHead>
                      <TableHead>銀行帳戶</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUnits.map(unit => (
                      <TableRow key={unit.id}>
                        <TableCell className="font-medium">{unit.name}</TableCell>
                        <TableCell>{unit.representative}</TableCell>
                        <TableCell>{unit.contact}</TableCell>
                        <TableCell>{unit.taxId}</TableCell>
                        <TableCell>{unit.bankName} {unit.bankAccount}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditUnit(unit)}
                              title="編輯"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500 hover:text-red-700" 
                              onClick={() => handleDeleteUnit(unit.id)}
                              title="刪除"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-2">沒有找到符合條件的單位</p>
                <Button variant="outline" onClick={handleAddUnit}>
                  <Plus className="mr-2 h-4 w-4" />
                  建立單位
                </Button>
              </div>
            )}
            
            {filteredUnits.length > 0 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => handlePageClick(0)} />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink isActive onClick={() => handlePageClick(1)}>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext onClick={() => handlePageClick(2)} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </CardContent>
        </Card>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isNewUnit ? '新增單位' : '編輯單位'}</DialogTitle>
              <DialogDescription>
                填寫以下資料以{isNewUnit ? '建立新的' : '更新現有'}單位
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit-name">單位名稱 <span className="text-red-500">*</span></Label>
                  <Input
                    id="unit-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="輸入單位名稱"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">會址 <span className="text-red-500">*</span></Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="輸入單位會址"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registration-number">立案字號</Label>
                  <Input
                    id="registration-number"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="輸入立案字號"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-id">統一編號 <span className="text-red-500">*</span></Label>
                  <Input
                    id="tax-id"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="輸入8位數字統一編號"
                    maxLength={8}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="representative">負責人 <span className="text-red-500">*</span></Label>
                  <Input
                    id="representative"
                    value={representative}
                    onChange={(e) => setRepresentative(e.target.value)}
                    placeholder="輸入負責人姓名"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">聯絡人</Label>
                  <Input
                    id="contact"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="輸入聯絡人姓名"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>銀行帳戶資料</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Input
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="銀行名稱"
                    />
                  </div>
                  <div>
                    <Input
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      placeholder="銀行帳號"
                    />
                  </div>
                  <div>
                    <Input
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="戶名"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manager">承辦人</Label>
                  <Input
                    id="manager"
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    placeholder="輸入承辦人姓名"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountant">會計</Label>
                  <Input
                    id="accountant"
                    value={accountant}
                    onChange={(e) => setAccountant(e.target.value)}
                    placeholder="輸入會計姓名"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cashier">出納</Label>
                  <Input
                    id="cashier"
                    value={cashier}
                    onChange={(e) => setCashier(e.target.value)}
                    placeholder="輸入出納姓名"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>取消</Button>
              <Button onClick={handleSave}>{isNewUnit ? '建立' : '更新'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default UnitManagement;
