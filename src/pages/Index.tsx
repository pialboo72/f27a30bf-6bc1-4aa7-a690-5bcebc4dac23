
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, FileCheck, Tag, Clock, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

// 模擬資料
const draftApplications = [
  { id: 1, title: "青年藝術發展計劃", progress: 30, deadline: "2025/05/15", category: "文化藝術" },
  { id: 2, title: "社區體育活動推廣", progress: 65, deadline: "2025/05/10", category: "體育" },
];

const subsidyPrograms = [
  { id: 1, title: "文化部藝術發展補助", deadline: "2025/05/20", category: "文化藝術" },
  { id: 2, title: "體育署全民運動補助", deadline: "2025/06/15", category: "體育" },
  { id: 3, title: "教育部學生社團活動補助", deadline: "2025/07/01", category: "教育" },
];

const recentNotifications = [
  { id: 1, message: "「青年藝術發展計劃」的草稿即將到期", time: "3小時前", type: "warning" },
  { id: 2, message: "「社區體育活動推廣」已成功生成申請文件", time: "昨天", type: "success" },
  { id: 3, message: "系統更新：新增AI智能生成模組", time: "2天前", type: "info" },
];

const Index: React.FC = () => {
  return (
    <MainLayout>
      <div className="fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">歡迎使用自動化補助申請系統</h1>
            <p className="text-muted-foreground mt-1">快速有效地管理您的補助申請流程</p>
          </div>
          <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
            <FileText className="mr-2 h-4 w-4" /> 新增申請
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">進行中申請</CardTitle>
              <CardDescription>您目前有的草稿申請</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{draftApplications.length}</div>
              <p className="text-sm text-muted-foreground">
                最近期限: {draftApplications.length > 0 ? draftApplications[0].deadline : "-"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">可用補助計畫</CardTitle>
              <CardDescription>當前開放申請的計畫</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{subsidyPrograms.length}</div>
              <p className="text-sm text-muted-foreground">
                各類型補助項目
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">完成申請</CardTitle>
              <CardDescription>已完成的申請</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
              <p className="text-sm text-muted-foreground">
                本月新增: 1
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5" /> 進行中申請草稿
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {draftApplications.length > 0 ? (
                draftApplications.map((app) => (
                  <div key={app.id} className="border rounded-md p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{app.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                          <Tag className="h-3 w-3" />
                          <span>{app.category}</span>
                          <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                          <Clock className="h-3 w-3" />
                          <span>截止: {app.deadline}</span>
                        </div>
                      </div>
                      <Link to="/activity">
                        <Button variant="outline" size="sm">繼續填寫</Button>
                      </Link>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>完成度</span>
                        <span>{app.progress}%</span>
                      </div>
                      <Progress value={app.progress} className="h-2" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  目前沒有進行中的申請草稿
                </div>
              )}
              
              <div className="text-center pt-2">
                <Link to="/activity">
                  <Button variant="outline">查看全部申請</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Tag className="mr-2 h-5 w-5" /> 開放申請的補助計畫
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subsidyPrograms.slice(0, 3).map((program) => (
                    <div key={program.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                      <div>
                        <h3 className="font-medium">{program.title}</h3>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                            {program.category}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                          <span>截止: {program.deadline}</span>
                        </div>
                      </div>
                      <Link to="/programs">
                        <Button variant="outline" size="sm">詳情</Button>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="text-center pt-4">
                  <Link to="/programs">
                    <Button variant="outline">查看全部計畫</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Bell className="mr-2 h-5 w-5" /> 最近通知
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentNotifications.map((notification) => (
                    <div key={notification.id} className="border-b pb-3 last:border-0">
                      <div className="flex gap-2">
                        <div className={`h-2 w-2 mt-2 rounded-full ${
                          notification.type === 'warning' ? 'bg-yellow-500' : 
                          notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`}></div>
                        <div>
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center pt-3">
                  <Button variant="ghost" size="sm">查看全部通知</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
