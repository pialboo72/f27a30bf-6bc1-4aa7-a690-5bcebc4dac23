
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const features = [
  {
    title: "線上填報與資料驗證",
    img: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&q=80",
    desc: "申請單位可隨時進行線上資料填寫，系統自動驗證欄位，減少紙本作業及填報疏漏。",
  },
  {
    title: "進度追蹤與流程控管",
    img: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80",
    desc: "即時掌握申請案件進度，自動分派審核流程，讓行政作業更無縫、透明。",
  },
  {
    title: "多階權限與分級管理",
    img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80",
    desc: "依不同身分賦予功能權限，單位及人員皆可分層管理，確保資料安全且利於協作。",
  },
  {
    title: "附件/檔案雲端管理",
    img: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80",
    desc: "所有申請與核銷文件皆可雲端備存，支援多份附件批量上傳與自動分類、下載。",
  },
  {
    title: "視覺化統計及報表",
    img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
    desc: "即時呈現多維度統計圖表，管理者可一鍵匯出報表、洞察補助運作全貌。",
  },
  {
    title: "多元通知與即時溝通",
    img: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&q=80",
    desc: "支援 Email、站內訊息、推播等方式通知審查進度或核撥資訊，訊息不漏接。",
  },
];

const Landing: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-2">
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
      <p className="text-xl text-gray-800 font-semibold mb-7">
        一站式雲端解決方案，專為機關團體設計的補助案全流程管理平台
      </p>

      {/* 詳細介紹說明 */}
      <div className="bg-white/90 rounded-xl shadow-xl p-7 mb-10 text-left animate-fade-in">
        <h2 className="font-bold text-2xl text-brand-800 mb-3">關於本軟體</h2>
        <p className="text-base text-gray-800 mb-2 leading-relaxed">
          本系統專為政府部門、法人團體及學術單位打造，徹底數位化所有補助申請與管理流程，
          讓行政單位、申請人與主管機關皆可高效協作。在安全雲端架構下，免安裝、隨時上線，
          涵蓋表單填報、資料審核、文件核銷、附件留存、進度追溯、統計分析、報表產生等多項實用功能。
        </p>
        <p className="text-base text-gray-800 mb-4 leading-relaxed">
          全方位資訊安全控管、分級權限、彈性流程設計，顯著減少人為出錯與行政時程壓力，
          提昇補助專案管理效率，也能隨時回溯歷史記錄、確保每個流程都可追蹤、查驗。
        </p>
      </div>

      {/* 主要功能列表區塊（含圖） */}
      <div className="grid gap-5 md:grid-cols-2 mb-12 animate-fade-in">
        {features.map((f, idx) => (
          <Card key={f.title} className="flex flex-col md:flex-row items-center h-full">
            <img
              src={f.img}
              alt={f.title}
              className="rounded-lg w-full max-w-[120px] md:w-[120px] md:h-[90px] object-cover mr-0 md:mr-6 mb-4 md:mb-0 shadow"
              loading="lazy"
              style={{ flexShrink: 0 }}
            />
            <div className="flex-1 text-left">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-base md:text-lg text-brand-900 mb-1 font-bold">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-sm text-gray-800">
                {f.desc}
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* 登入與註冊按鈕 */}
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-10 animate-fade-in">
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
