
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, FileText, Users, Shield, Calendar } from "lucide-react";
import ApplicationStatus from "@/components/application/ApplicationStatus";

const AdminStats: React.FC = () => {
  return (
    <>
      {/* 功能展示區域 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-xs text-muted-foreground">待審核申請</p>
            </div>
            <Activity className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-2xl font-bold">156</p>
              <p className="text-xs text-muted-foreground">總申請數</p>
            </div>
            <FileText className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-2xl font-bold">89</p>
              <p className="text-xs text-muted-foreground">活躍用戶</p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground">進行中計劃</p>
            </div>
            <Shield className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      {/* 申請狀態展示 */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">申請狀態概覽</h3>
          <div className="flex gap-4 flex-wrap">
            <ApplicationStatus status="draft" />
            <ApplicationStatus status="submitted" />
            <ApplicationStatus status="reviewing" />
            <ApplicationStatus status="approved" />
            <ApplicationStatus status="rejected" />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AdminStats;
