
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Building, Clock } from "lucide-react";
import { SubsidyProgram } from "@/types/program";

interface ProgramCardViewProps {
  programs: SubsidyProgram[];
  onApply: (programId: number) => void;
  onManageTemplate: (programId: number) => void;
}

const ProgramCardView: React.FC<ProgramCardViewProps> = ({ 
  programs, 
  onApply, 
  onManageTemplate 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "進行中": return "default";
      case "即將截止": return "destructive";
      case "已截止": return "secondary";
      default: return "outline";
    }
  };

  const formatAmount = (amount: number) => {
    return `NT$ ${amount.toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {programs.map((program) => (
        <Card key={program.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start mb-2">
              <Badge variant={getStatusColor(program.status) as any}>
                {program.status}
              </Badge>
              <Badge variant="outline">{program.category}</Badge>
            </div>
            <CardTitle className="text-lg leading-tight">
              {program.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Building className="h-4 w-4 mr-2" />
                {program.organization}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 mr-2" />
                {formatAmount(program.amount)}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                截止: {program.deadline}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {program.description}
            </p>
            
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                onClick={() => onApply(program.id)}
                disabled={program.status === "已截止"}
                className="flex-1"
              >
                申請
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onManageTemplate(program.id)}
              >
                模板
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProgramCardView;
