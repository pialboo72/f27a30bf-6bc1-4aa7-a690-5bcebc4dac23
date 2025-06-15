
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { unitFormSchema, UnitFormValues } from "@/schemas/user-management-schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import BasicInfoSection from "@/components/user-management/BasicInfoSection";
import BankInfoSection from "@/components/user-management/BankInfoSection";
import PositionTitlesSection from "@/components/user-management/PositionTitlesSection";
import PersonnelNamesSection from "@/components/user-management/PersonnelNamesSection";
import DocumentUploadSection from "@/components/user-management/DocumentUploadSection";

type AdminRegisterFields = {
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminPassword: string;
};

type RegisterFormValues = UnitFormValues & AdminRegisterFields;

const registerFormSchema = unitFormSchema.extend({
  adminName: unitFormSchema.shape.representative, // e.g. required
  adminEmail: unitFormSchema.shape.name.transform(() => "") // basic - set later
    .refine((val) => !!val, { message: "電子郵件為必填項目" }),
  adminPhone: unitFormSchema.shape.contactPhone.or(unitFormSchema.shape.taxId), // trick for required string
  adminPassword: unitFormSchema.shape.name.transform(() => "") // as required string，set later
    .refine((val) => !!val, { message: "密碼為必填項目" }),
});

export default function RegisterForm() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      address: "",
      registrationNumber: "",
      representative: "",
      contact: "",
      contactPhone: "",
      contactAddress: "",
      postalCode: "",
      taxId: "",
      bankName: "",
      bankAccount: "",
      accountName: "",
      manager: "",
      accountant: "",
      cashier: "",
      supervisor: "",
      managerTitle: "承辦人",
      accountantTitle: "會計",
      cashierTitle: "出納",
      supervisorTitle: "負責人",
      documents: [],
      adminName: "",
      adminEmail: "",
      adminPhone: "",
      adminPassword: "",
    },
  });

  function onSubmit(data: RegisterFormValues) {
    setSubmitted(true);
    // 模擬送出（實際應送給後端等待審核）
    toast.info("註冊資料已送出，待系統管理員審核。");
    // 可依需求送資料到API
  }

  if (submitted) {
    return (
      <Card className="max-w-xl mx-auto my-12 shadow-2xl border-2 border-brand-200 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl text-brand-700 mb-2">註冊申請送出！</CardTitle>
        </CardHeader>
        <CardContent className="text-lg text-gray-800">
          您的註冊資料已成功送出，待系統管理員審核後，將以E-mail通知審核結果。<br/>
          若有問題請來信 <span className="underline text-brand-600">service@grantcloud.com.tw</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl max-w-3xl w-full mx-auto my-10 border-brand-300 border-2 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-brand-800">
          單位註冊申請
        </CardTitle>
        <div className="text-base text-gray-700 text-center mt-3">請填寫單位與管理員資料，經審核通過後即可登入系統。</div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <h3 className="font-bold text-xl text-brand-700 mb-2">單位資訊</h3>
              <BasicInfoSection unitForm={form as any} />
              <BankInfoSection unitForm={form as any} />
              <PositionTitlesSection unitForm={form as any} />
              <PersonnelNamesSection unitForm={form as any} />
              <DocumentUploadSection unitForm={form as any} />
            </div>
            <div className="py-4">
              <h3 className="font-bold text-xl text-indigo-700 mb-2">管理員帳號資訊</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <FormItem>
                  <FormLabel>姓名</FormLabel>
                  <FormControl>
                    <Input placeholder="管理員姓名" {...form.register("adminName", { required: true })} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <FormItem>
                  <FormLabel>電子郵件</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="admin@email.com" {...form.register("adminEmail", { required: true })} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <FormItem>
                  <FormLabel>手機號碼</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="手機號碼" {...form.register("adminPhone", { required: true })} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <FormItem>
                  <FormLabel>密碼</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="請設定密碼" autoComplete="new-password" {...form.register("adminPassword", { required: true })} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                註冊申請僅完成帳號送審，通過審核後才能正式登入使用。
              </div>
            </div>
            <CardFooter className="flex flex-col items-center gap-2">
              <Button size="lg" type="submit" className="w-full max-w-xs bg-gradient-to-r from-brand-600 to-indigo-600 text-lg mt-2">
                送出註冊申請
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
