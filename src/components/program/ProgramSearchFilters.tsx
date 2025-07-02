
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract all unique tags from programs
  const allTags = Array.from(new Set(
    programs.flatMap(program => program.tags || [program.category])
  ));

  useEffect(() => {
    let filtered = programs;

    // Filter by search term (including tags)
    if (searchTerm.trim()) {
      filtered = filtered.filter(program =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (program.tags || [program.category]).some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(program => 
        selectedTags.some(selectedTag => 
          (program.tags || [program.category]).includes(selectedTag)
        )
      );
    }

    onFilteredPrograms(filtered);
  }, [programs, searchTerm, selectedTags, onFilteredPrograms]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋補助計劃或標籤..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">標籤篩選：</span>
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllTags}
                  className="h-6 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  清除全部
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramSearchFilters;
