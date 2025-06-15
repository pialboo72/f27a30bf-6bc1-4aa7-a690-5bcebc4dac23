
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const features = [
  {
    title: "線上填報與資料驗證",
    img: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80",
    desc: "申請單位可隨時進行線上資料填寫，系統自動驗證欄位，減少紙本作業及填報疏漏，縮短行政作業流程。",
  },
  {
    title: "進度追蹤與流程控管",
    img: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80",
    desc: "即時掌握申請案件進度，自動分派審核流程，讓行政作業更無縫、透明，提升辦件效率及準確性。",
  },
  {
    title: "多階權限與分級管理",
    img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
    desc: "依不同身分賦予功能權限，單位及人員皆可分層管理，確保資料安全且利於協作，有效降低權限濫用風險。",
  },
  {
    title: "附件/檔案雲端管理",
    img: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    desc: "所有申請與核銷文件皆可雲端備存，支援多份附件批量上傳及自動分類、下載，方便日後查驗及彙整。",
  },
  {
    title: "視覺化統計及報表",
    img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    desc: "即時呈現多維度統計圖表，管理者可一鍵匯出統計報表，全面掌握各項補助案執行狀況與經費利用。",
  },
  {
    title: "多元通知與即時溝通",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    desc: "支援 Email、站內訊息、推播等多種方式通知最新審查進度或核撥資訊，重要訊息不漏接，團隊溝通更即時。",
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
        <p className="text-base text-gray-800 mb-2 leading-relaxed">
          我們提供多階權限控管與彈性化作業流程，顯著減少人為疏失與行政時程壓力，一地上線、即時管控全局，
          讓單一平台完成補助申請、進度追蹤、歷史回溯，數據視覺化洞察專案運作，有效提升管理效率。
        </p>
        <p className="text-base text-gray-800 mb-4 leading-relaxed">
          高度安全的雲端儲存、附件批次上傳管理，以及多元即時通知機制，確保資訊完整傳遞、每一流程都可追蹤查核。
        </p>
      </div>

      {/* 主要功能區塊 (交錯排列：左文右圖，右文左圖) */}
      <div className="flex flex-col gap-14 mb-12 animate-fade-in">
        {features.map((f, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <Card
              key={f.title}
              className={`flex flex-col-reverse md:flex-row items-center shadow-2xl px-3 md:px-10 py-7 md:py-12 rounded-3xl bg-white/95`}
            >
              {/* 左文右圖，右文左圖 */}
              {isEven ? (
                <>
                  {/* 文字左 */}
                  <div className="flex-1 flex flex-col items-start text-left md:pr-8 mt-6 md:mt-0">
                    <CardHeader className="p-0 mb-3">
                      <CardTitle className="text-2xl text-brand-900 font-bold mb-2">{f.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 text-base text-gray-800">
                      {f.desc}
                    </CardContent>
                  </div>
                  {/* 圖右，大圖 */}
                  <div className="w-full md:w-[370px] flex justify-center">
                    <img
                      src={f.img}
                      alt={f.title}
                      className="object-cover rounded-2xl w-full md:max-w-[340px] aspect-[4/3] shadow-lg border border-gray-100"
                      loading="lazy"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* 圖左，大圖 */}
                  <div className="w-full md:w-[370px] flex justify-center">
                    <img
                      src={f.img}
                      alt={f.title}
                      className="object-cover rounded-2xl w-full md:max-w-[340px] aspect-[4/3] shadow-lg border border-gray-100"
                      loading="lazy"
                    />
                  </div>
                  {/* 文字右 */}
                  <div className="flex-1 flex flex-col items-start text-left md:pl-8 mt-6 md:mt-0">
                    <CardHeader className="p-0 mb-3">
                      <CardTitle className="text-2xl text-brand-900 font-bold mb-2">{f.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 text-base text-gray-800">
                      {f.desc}
                    </CardContent>
                  </div>
                </>
              )}
            </Card>
          );
        })}
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

