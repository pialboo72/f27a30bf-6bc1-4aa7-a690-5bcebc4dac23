
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { SubsidyProgram } from "@/types/program";
import ProgramCard from "./ProgramCard";

interface ProgramListProps {
  programs: SubsidyProgram[];
  onApply: (programId: number) => void;
  onManageTemplate: (programId: number) => void;
  onClearFilters: () => void;
}

const ProgramList: React.FC<ProgramListProps> = ({ 
  programs, 
  onApply, 
  onManageTemplate,
  onClearFilters 
}) => {
  if (programs.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 flex flex-col items-center justify-center">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">沒有符合條件的補助計劃</h3>
          <p className="text-muted-foreground text-sm mb-4">請嘗試不同的搜索條件</p>
          <Button variant="outline" onClick={onClearFilters}>
            清除篩選條件
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {programs.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          onApply={onApply}
          onManageTemplate={onManageTemplate}
        />
      ))}
    </div>
  );
};

export default ProgramList;
