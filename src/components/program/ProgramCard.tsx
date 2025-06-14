
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, Clock, Info, FileText, Settings } from 'lucide-react';
import { SubsidyProgram } from "@/types/program";

interface ProgramCardProps {
  program: SubsidyProgram;
  onApply: (programId: number) => void;
  onManageTemplate: (programId: number) => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, onApply, onManageTemplate }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{program.title}</CardTitle>
            <CardDescription className="mt-1">{program.organization}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-800 hover:bg-blue-100">
              {program.category}
            </Badge>
            {program.applicationTemplate && (
              <Badge variant="outline" className="bg-green-50 text-green-800 hover:bg-green-100">
                <FileText className="h-3 w-3 mr-1" />
                已設定模板
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{program.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {program.tags.map((tag, index) => (
            <div key={index} className="inline-flex items-center text-xs bg-slate-100 px-2.5 py-1 rounded-full">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </div>
          ))}
        </div>
        
        {/* 顯示模板資訊 */}
        {program.applicationTemplate && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">申請模板已設定</span>
            </div>
            <p className="text-xs text-green-700">{program.applicationTemplate.name}</p>
            <p className="text-xs text-green-600 mt-1">
              包含 {program.applicationTemplate.tags.length} 個填寫欄位
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">申請截止日期</div>
              <div className="text-sm text-muted-foreground">{program.deadline}</div>
            </div>
          </div>
          <div className="flex items-center">
            <Info className="h-4 w-4 mr-2 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">最高補助金額</div>
              <div className="text-sm text-muted-foreground">NT$ {program.maxAmount.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 flex justify-between">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <a href="#" className="text-muted-foreground">查看詳情</a>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onManageTemplate(program.id)}
            className="text-muted-foreground"
          >
            <Settings className="h-4 w-4 mr-1" />
            模板設定
          </Button>
        </div>
        <Button size="sm" onClick={() => onApply(program.id)}>
          開始申請
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProgramCard;
