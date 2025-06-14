
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import ApplicationForm from "@/components/application/ApplicationForm";
import ProgramTemplateManager from "@/components/program/ProgramTemplateManager";
import ProgramSearchFilters from "@/components/program/ProgramSearchFilters";
import ProgramList from "@/components/program/ProgramList";
import { subsidyPrograms } from "@/data/subsidyPrograms";

const Programs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showApplicationForm = searchParams.get('apply');
  const manageTemplates = searchParams.get('manage');

  // 處理搜索和過濾
  const filteredPrograms = subsidyPrograms.filter((program) => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        program.organization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "全部" || program.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // 處理申請按鈕點擊
  const handleApply = (programId: number) => {
    navigate(`/programs?apply=${programId}`);
  };

  // 處理模板管理
  const handleManageTemplate = (programId: number) => {
    navigate(`/programs?manage=${programId}`);
  };

  // 清除篩選條件
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("全部");
  };

  if (showApplicationForm) {
    return (
      <MainLayout>
        <div className="fade-in">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">申請補助計劃</h1>
            <p className="text-muted-foreground mt-1">選擇活動並提交申請</p>
          </div>
          <ApplicationForm programId={showApplicationForm} />
        </div>
      </MainLayout>
    );
  }

  if (manageTemplates) {
    const program = subsidyPrograms.find(p => p.id === parseInt(manageTemplates));
    return (
      <MainLayout>
        <div className="fade-in">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">模板管理</h1>
            <p className="text-muted-foreground mt-1">{program?.title} - 申請文件模板設定</p>
          </div>
          <ProgramTemplateManager program={program} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">補助計劃</h1>
            <p className="text-muted-foreground mt-1">瀏覽所有開放申請的補助計劃</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <ProgramSearchFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <ProgramList
            programs={filteredPrograms}
            onApply={handleApply}
            onManageTemplate={handleManageTemplate}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Programs;
