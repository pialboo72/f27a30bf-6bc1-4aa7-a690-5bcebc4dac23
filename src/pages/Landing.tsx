
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const Landing: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
    <div className="w-full max-w-lg text-center">
      <div className="flex justify-center mb-5">
        <div className="bg-brand-600 text-white rounded p-3">
          <FileText size={36} />
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-brand-900 mb-4 leading-tight">
        補助申請管理系統
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        雲端一站式申請、追蹤與管理補助案件<br />
        提升效率、簡化流程、安全可靠
      </p>
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
        <Link to="/login" className="flex-1">
          <Button size="lg" className="w-full bg-brand-600 hover:bg-brand-700 text-lg">
            登入帳號
          </Button>
        </Link>
        <Link to="/register" className="flex-1">
          <Button variant="outline" size="lg" className="w-full text-lg">
            註冊新帳號
          </Button>
        </Link>
      </div>
      <div className="bg-white/80 rounded-lg shadow-lg p-6 text-left space-y-3">
        <h2 className="font-bold text-xl text-brand-800 mb-2">核心功能亮點</h2>
        <ul className="list-disc ml-5 space-y-1 text-gray-900 text-base">
          <li>線上填寫與提交補助申請表</li>
          <li>即時追蹤申請進度與審核狀態</li>
          <li>自動產生所需文件與通知提醒</li>
          <li>管理單位和用戶權限，安全有保障</li>
          <li>圖表化統計分析，掌握全貌</li>
          <li>支援多檔案上傳、下載與歷史查閱</li>
        </ul>
      </div>
    </div>
  </div>
);

export default Landing;
