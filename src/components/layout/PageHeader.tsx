
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import NotificationCenter from "@/components/notification/NotificationCenter";

const PageHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 此處可加上登出邏輯，暫時只做跳轉
    navigate("/login");
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-6">
        <div className="flex items-center gap-4 flex-1">
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <NotificationCenter />
          
          <div className="flex items-center gap-2 ml-4">
            <div className="text-sm">
              <p className="font-medium">管理員</p>
              <p className="text-xs text-muted-foreground">admin@example.com</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium">管</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={handleLogout}
              title="登出"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
