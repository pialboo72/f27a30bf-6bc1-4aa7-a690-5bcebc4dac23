
import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, User } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const PageHeader: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between shadow-sm z-20">
      <div className="flex items-center">
        <div className="font-bold text-xl text-brand-900">
          自動化補助申請系統
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            3
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>我的帳戶</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>個人資料</DropdownMenuItem>
            <DropdownMenuItem>設定</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">登出</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default PageHeader;
