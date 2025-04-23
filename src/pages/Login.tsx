
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Lock } from "lucide-react";

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 模擬登入處理
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/";
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="bg-brand-600 text-white rounded p-2">
              <FileText size={30} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-brand-900">自動化補助申請系統</h1>
          <p className="text-muted-foreground mt-1">簡化流程，提高效率</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>登入帳號</CardTitle>
            <CardDescription>
              請輸入您的帳號密碼登入系統
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">帳號</Label>
                <Input id="username" placeholder="請輸入帳號" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">密碼</Label>
                  <Link to="/forgot-password" className="text-xs text-brand-600 hover:underline">
                    忘記密碼？
                  </Link>
                </div>
                <Input id="password" type="password" placeholder="請輸入密碼" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    登入中...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Lock className="mr-2 h-4 w-4" />
                    登入
                  </div>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            還沒有帳號？{" "}
            <Link to="/register" className="text-brand-600 hover:underline">
              立即註冊
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
