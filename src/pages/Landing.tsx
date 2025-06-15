
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

// 頁面主色調 & 各區適用圖片
const features = [
  {
    title: "線上填報與資料驗證",
    img: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=900&q=80",
    desc: "申請單位可隨時進行線上資料填寫，系統自動驗證欄位，減少紙本作業及填報疏漏，縮短行政作業流程。",
  },
  {
    title: "進度追蹤與流程控管",
    img: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=900&q=80",
    desc: "即時掌握申請案件進度，自動分派審核流程，讓行政作業更無縫、透明，提升辦件效率及準確性。",
  },
  {
    title: "多階權限與分級管理",
    img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=900&q=80",
    desc: "依不同身分賦予功能權限，單位及人員皆可分層管理，確保資料安全且利於協作，有效降低權限濫用風險。",
  },
  {
    title: "附件/檔案雲端管理",
    img: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=900&q=80",
    desc: "所有申請與核銷文件皆可雲端備存，支援多份附件批量上傳及自動分類、下載，方便日後查驗及彙整。",
  },
  {
    title: "視覺化統計及報表",
    img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80",
    desc: "即時呈現多維度統計圖表，管理者可一鍵匯出統計報表，全面掌握各項補助案執行狀況與經費利用。",
  },
  {
    title: "多元通知與即時溝通",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
    desc: "支援 Email、站內訊息、推播等多種方式通知最新審查進度或核撥資訊，重要訊息不漏接，團隊溝通更即時。",
  },
];

const Landing: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-50 to-indigo-50 pt-10 pb-2 px-2 font-sans">
    <div className="w-full max-w-4xl text-center">
      {/* Logo & 標題 */}
      <div className="flex justify-center mb-6">
        <span className="bg-gradient-to-br from-brand-600 to-indigo-500 text-white rounded-full p-4 shadow-xl animate-scale-in">
          <FileText size={48} />
        </span>
      </div>
      <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-br from-brand-700 via-brand-500 to-indigo-700 bg-clip-text text-transparent mb-3 leading-tight drop-shadow-lg select-none tracking-wider">
        補助申請管理系統
      </h1>
      <p className="text-2xl text-gray-800 font-bold mb-8 drop-shadow-sm">
        一站式雲端管理平台，專為機關團體打造的數位補助全流程新標竿
      </p>

      {/* 關於本軟體 Section */}
      <div className="relative bg-white/95 rounded-3xl shadow-2xl border-l-8 border-brand-300 px-9 py-8 mb-14 text-left animate-fade-in overflow-hidden">
        <div className="absolute top-0 left-0 h-2 w-32 bg-gradient-to-r from-brand-400 to-indigo-200 rounded-br-xl opacity-40 animate-pulse" />
        <h2 className="font-bold text-3xl text-brand-800 mb-4">關於本軟體</h2>
        <p className="text-lg text-gray-900 mb-1 leading-relaxed">
          GrantCloud 以數位創新思維重新定義補助案件的管理流程，專為政府機關、法人團體、學校單位量身設計。無需安裝，以雲端架構即可一站管理各類申請、核驗、分派、回饋，極大化行政效率、降低人工作業負擔，任何人都可安心上手。
        </p>
        <ul className="text-base text-gray-800 pl-8 mb-3 list-disc leading-relaxed">
          <li>免裝軟體隨時線上協作，全面數位流程審核與文件管理</li>
          <li>強化進度掌握、資料驗證與彈性分級權限控管</li>
          <li>即時數據分析報表，友善介面支持多裝置瀏覽</li>
        </ul>
        <div className="w-full flex justify-end">
          <span className="text-xs text-gray-400 font-mono">#數位賦能 #補助雲管理 #行政簡化</span>
        </div>
      </div>

      {/* 功能 Section：交錯排列 */}
      <div className="flex flex-col gap-16 mb-14 py-2">
        {features.map((f, idx) => {
          const even = idx % 2 === 0;
          return (
            <div
              key={f.title}
              className="flex flex-col md:flex-row items-center group animate-fade-in"
            >
              {/* 左圖右文 or 右圖左文(交錯) */}
              {even ? (
                <>
                  {/* 圖片左 (大圖) */}
                  <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0 md:mr-7">
                    <div className="relative group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={f.img}
                        alt={f.title}
                        className="object-cover rounded-[2.5rem] shadow-2xl border-4 border-brand-200 w-full max-w-[430px] aspect-[4/3] transform hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                      <span className="absolute -left-5 -top-5 rounded-full bg-brand-100 h-8 w-8 blur-xl opacity-30" />
                    </div>
                  </div>
                  {/* 文字右 */}
                  <div className="w-full md:w-1/2 flex flex-col items-start text-left px-2">
                    <CardHeader className="p-0 mb-2">
                      <CardTitle className="text-2xl md:text-3xl text-brand-900 font-bold mb-2 drop-shadow">
                        {f.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 text-lg text-gray-800">
                      {f.desc}
                    </CardContent>
                  </div>
                </>
              ) : (
                <>
                  {/* 文字左 */}
                  <div className="w-full md:w-1/2 flex flex-col items-start text-left px-2 order-2 md:order-1">
                    <CardHeader className="p-0 mb-2">
                      <CardTitle className="text-2xl md:text-3xl text-brand-900 font-bold mb-2 drop-shadow">
                        {f.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 text-lg text-gray-800">
                      {f.desc}
                    </CardContent>
                  </div>
                  {/* 圖片右 */}
                  <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0 order-1 md:order-2 md:ml-7">
                    <div className="relative group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={f.img}
                        alt={f.title}
                        className="object-cover rounded-[2.5rem] shadow-2xl border-4 border-indigo-200 w-full max-w-[430px] aspect-[4/3] transform hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                      <span className="absolute -right-5 -top-5 rounded-full bg-indigo-100 h-8 w-8 blur-xl opacity-30" />
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Call to Action 區塊 */}
      <div className="flex flex-col md:flex-row justify-center gap-5 mb-14">
        <Link to="/login" className="flex-1">
          <Button size="lg" className="w-full bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:bg-brand-700 shadow-2xl text-lg py-6 tracking-wider transition-transform duration-150 hover:scale-105 focus:scale-95">
            立即登入
          </Button>
        </Link>
        <Link to="/register" className="flex-1">
          <Button variant="outline" size="lg" className="w-full text-lg border-2 border-brand-600 hover:bg-brand-50 hover:text-brand-800 py-6 tracking-wider transition-transform duration-150 hover:scale-105 focus:scale-95">
            註冊新帳號
          </Button>
        </Link>
      </div>

      {/* Footer / 聯絡資訊區塊 */}
      <footer className="w-full mt-auto text-gray-700">
        <div className="rounded-xl bg-gradient-to-r from-brand-100 via-indigo-100 to-brand-50 px-7 py-8 shadow-inner border-t-4 border-indigo-200 mb-2 animate-fade-in">
          <div className="mb-3 font-bold text-base tracking-wide text-brand-700">
            聯絡我們
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 text-base font-mono md:space-x-6">
            <span>
              <span className="font-semibold">Email：</span>
              <a href="mailto:service@grantcloud.com.tw" className="underline text-brand-600 hover:text-brand-700 ml-1">service@grantcloud.com.tw</a>
            </span>
            <span>
              <span className="font-semibold">客服時間：</span>
              週一至週五 09:00-18:00
            </span>
            <span>
              <span className="font-semibold">服務地址：</span>
              台北市信義區松智路99號
            </span>
          </div>
          <div className="mt-5 text-xs text-gray-400 text-center select-none">
            © 2025 GrantCloud 補助申請管理系統 All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  </div>
);

export default Landing;
