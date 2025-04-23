
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-8">
        <h1 className="text-6xl font-bold text-brand-600 mb-6">404</h1>
        <h2 className="text-2xl font-bold mb-3">找不到頁面</h2>
        <p className="text-muted-foreground mb-8">
          很抱歉，您要查找的頁面不存在。請檢查網址是否正確，或返回首頁。
        </p>
        <Button asChild className="bg-brand-600 hover:bg-brand-700">
          <Link to="/" className="flex items-center">
            <Home className="mr-2 h-4 w-4" />
            返回首頁
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
