
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings } from 'lucide-react';
import { SubsidyProgram } from "@/types/program";

interface ProgramInfoProps {
  program: SubsidyProgram;
}

const ProgramInfo: React.FC<ProgramInfoProps> = ({ program }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {program.title} - 模板設定
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">主辦機關</Label>
            <p className="text-sm text-muted-foreground">{program.organization}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">申請截止日期</Label>
            <p className="text-sm text-muted-foreground">{program.deadline}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">最高補助金額</Label>
            <p className="text-sm text-muted-foreground">NT$ {program.maxAmount.toLocaleString()}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">補助類別</Label>
            <Badge variant="outline">{program.category}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramInfo;
