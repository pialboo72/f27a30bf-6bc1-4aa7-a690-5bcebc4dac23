
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const Landing: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
    <div className="w-full max-w-2xl text-center">
      {/* Logo & 標題 */}
      <div className="flex justify-center mb-5">
        <div className="bg-brand-600 text-white rounded p-3 shadow-lg">
          <FileText size={40} />
        </div>
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-brand-900 mb-4 leading-tight drop-shadow">
        補助申請管理系統
      </h1>
      <p className="text-xl text-gray-800 font-semibold mb-6">
        一站式雲端解決方案，專為機關團體設計的補助案全流程管理平台
      </p>
      {/* 詳細介紹區塊 */}
      <div className="bg-white/90 rounded-xl shadow-xl p-7 mb-10 text-left animate-fade-in">
        <h2 className="font-bold text-2xl text-brand-800 mb-3">
          關於本軟體
        </h2>
        <p className="text-base text-gray-800 mb-3 leading-relaxed">
          本系統專為政府部門、法人團體及學術單位打造，全面數位化補助申請與管理流程。
          提供線上申請、進度追蹤、資料審核、統計分析、檔案管理等多元功能，協助組織提升作業效能、減少人為錯誤，並實現資訊透明安全。<br />
          <span className="block mt-2">
            無論是補助受理、文件稽核、補助金流控管，或權限分工與歷史留存，皆能一站式作業，方便行政人員與申請單位隨時查詢並即時獲得通知。
          </span>
        </p>
        <p className="text-base text-gray-800 mb-2 leading-relaxed">
          <strong>主要特色：</strong>
        </p>
        <ul className="list-disc ml-7 text-gray-900 text-base space-y-1">
          <li>線上填報與資料驗證，減少紙本與重工</li>
          <li>自動化核銷、流程控管，確保進度無遺漏</li>
          <li>支援多階層權限管理、各單位分級操作</li>
          <li>附件與檔案自動整理，隨時下載留存</li>
          <li>視覺化統計及報表，一鍵瞭解補助全貌</li>
          <li>多樣通知：email/站內/線上推播，確保即時溝通</li>
        </ul>
      </div>
      {/* 登入與註冊按鈕 */}
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-8 animate-fade-in">
        <Link to="/login" className="flex-1">
          <Button size="lg" className="w-full bg-brand-600 hover:bg-brand-700 text-lg shadow hover-scale">
            登入帳號
          </Button>
        </Link>
        <Link to="/register" className="flex-1">
          <Button variant="outline" size="lg" className="w-full text-lg border-brand-600 hover:bg-brand-50 hover:text-brand-800">
            註冊新帳號
          </Button>
        </Link>
      </div>
      {/* 功能亮點區塊 */}
      <div className="bg-white/80 backdrop-blur rounded-lg shadow-md p-6 mt-3 mb-14 text-left animate-fade-in">
        <h2 className="font-bold text-xl text-brand-700 mb-2">核心功能亮點</h2>
        <ul className="list-disc ml-5 space-y-1 text-gray-900 text-base">
          <li>線上填寫與提交補助申請表單</li>
          <li>即時追蹤申請進度與審核狀態</li>
          <li>自動產生所需文件與智慧化通知</li>
          <li>完善管理用戶與單位權限，資安可靠</li>
          <li>圖表化統計分析，數據一目了然</li>
          <li>多檔案上傳、歷史查閱與雲端備存</li>
        </ul>
      </div>

      {/* 聯絡資訊 */}
      <footer className="w-full mt-auto py-5 text-gray-600 text-center border-t border-gray-200 animate-fade-in">
        <div className="mb-2 font-semibold text-base">聯絡我們</div>
        <div className="flex flex-col items-center gap-1 text-sm">
          <span>Email：service@grantcloud.com.tw</span>
          <span>客服時間：週一至週五 09:00~18:00</span>
          <span>地址：台北市信義區松智路99號</span>
        </div>
        <div className="mt-3 text-xs text-gray-400">© 2025 GrantCloud 補助申請管理系統 All Rights Reserved.</div>
      </footer>
    </div>
  </div>
);

export default Landing;
