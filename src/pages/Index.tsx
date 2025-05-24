
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { CalendarDays, FileText, TrendingUp, Clock, CheckCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <MainLayout>
      <div className="fade-in space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            補助申請管理系統
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            簡化您的補助申請流程，提高申請效率
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/activity/new">
              <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
                <FileText className="mr-2 h-5 w-5" />
                開始新申請
              </Button>
            </Link>
            <Link to="/applications">
              <Button variant="outline" size="lg">
                <Clock className="mr-2 h-5 w-5" />
                查看申請狀態
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">總申請數</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
              <p className="text-xs text-muted-foreground">
                較上月增加 12%
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已批准</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">189</div>
              <p className="text-xs text-muted-foreground">
                批准率 77%
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">審核中</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                平均審核時間 5 天
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">活躍用戶</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                本月活躍用戶
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-brand-600" />
                提交新申請
              </CardTitle>
              <CardDescription>
                開始新的補助申請流程
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/activity/new">
                <Button className="w-full">
                  立即申請
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarDays className="mr-2 h-5 w-5 text-brand-600" />
                查看活動
              </CardTitle>
              <CardDescription>
                瀏覽所有申請活動
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/activities">
                <Button variant="outline" className="w-full">
                  查看活動
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-brand-600" />
                統計數據
              </CardTitle>
              <CardDescription>
                查看詳細統計報告
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/statistics">
                <Button variant="outline" className="w-full">
                  查看統計
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>最近申請</CardTitle>
            <CardDescription>
              查看最近提交的申請
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">文化藝術推廣活動</h4>
                  <p className="text-sm text-muted-foreground">提交於 2025-05-20</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    審核中
                  </span>
                  <Link to="/applications">
                    <Button variant="outline" size="sm">
                      查看詳情
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">社區服務計劃</h4>
                  <p className="text-sm text-muted-foreground">提交於 2025-05-18</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    已批准
                  </span>
                  <Link to="/applications">
                    <Button variant="outline" size="sm">
                      查看詳情
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Index;
