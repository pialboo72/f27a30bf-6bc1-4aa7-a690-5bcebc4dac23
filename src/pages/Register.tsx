
import React from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Register: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-50 to-indigo-50 pt-10 pb-6 px-2 font-sans">
    <div className="flex justify-center mb-3">
      <span className="bg-gradient-to-br from-brand-600 to-indigo-500 text-white rounded-full p-4 shadow-xl">
        <FileText size={40} />
      </span>
    </div>
    <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-brand-700 via-brand-500 to-indigo-700 bg-clip-text text-transparent mb-4 select-none tracking-widest text-center drop-shadow">
      補助申請管理系統 - 註冊
    </h1>
    <RegisterForm />
    <div className="text-center mt-6">
      已經有帳號？{" "}
      <Link to="/login">
        <Button variant="link" className="text-brand-700 underline font-semibold">前往登入</Button>
      </Link>
    </div>
  </div>
);

export default Register;
