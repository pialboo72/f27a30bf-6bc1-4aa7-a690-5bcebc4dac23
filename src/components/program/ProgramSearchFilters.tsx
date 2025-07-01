
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { categories } from "@/data/subsidyPrograms";
import { SubsidyProgram } from "@/types/program";

interface ProgramSearchFiltersProps {
  programs: SubsidyProgram[];
  onFilteredPrograms: (programs: SubsidyProgram[]) => void;
}

const ProgramSearchFilters: React.FC<ProgramSearchFiltersProps> = ({
  programs,
  onFilteredPrograms
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');

  useEffect(() => {
    let filtered = programs;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(program =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== '全部') {
      filtered = filtered.filter(program => program.category === selectedCategory);
    }

    onFilteredPrograms(filtered);
  }, [programs, searchTerm, selectedCategory, onFilteredPrograms]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋補助計劃..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramSearchFilters;
