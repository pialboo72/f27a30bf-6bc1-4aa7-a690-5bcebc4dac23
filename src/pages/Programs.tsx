
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ProgramSearchFilters from "@/components/program/ProgramSearchFilters";
import ProgramList from "@/components/program/ProgramList";
import { Button } from "@/components/ui/button";
import { Grid3X3, List, Plus } from "lucide-react";
import { subsidyPrograms } from "@/data/subsidyPrograms";
import { SubsidyProgram } from "@/types/program";

const Programs: React.FC = () => {
  const navigate = useNavigate();
  const [filteredPrograms, setFilteredPrograms] = useState<SubsidyProgram[]>(subsidyPrograms);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');

  const handleApply = (programId: number) => {
    navigate(`/programs/${programId}/apply`);
  };

  const handleManageTemplate = (programId: number) => {
    navigate(`/programs/${programId}/template`);
  };

  const handleClearFilters = () => {
    setFilteredPrograms(subsidyPrograms);
  };

  return (
    <MainLayout>
      <div className="fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">補助計劃</h1>
            <p className="text-muted-foreground mt-1">
              瀏覽可申請的補助計劃與相關文件
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="rounded-l-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={() => navigate("/admin/programs/create")}>
              <Plus className="mr-1 h-4 w-4" />
              新增計劃
            </Button>
          </div>
        </div>

        <ProgramSearchFilters 
          programs={subsidyPrograms}
          onFilteredPrograms={setFilteredPrograms}
        />
        
        <ProgramList 
          programs={filteredPrograms}
          onApply={handleApply}
          onManageTemplate={handleManageTemplate}
          onClearFilters={handleClearFilters}
          viewMode={viewMode}
        />
      </div>
    </MainLayout>
  );
};

export default Programs;
