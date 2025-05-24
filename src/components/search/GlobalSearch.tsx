
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  id: string;
  title: string;
  type: 'application' | 'program' | 'file' | 'user';
  description: string;
  url: string;
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: '文化活動補助申請',
    type: 'application',
    description: '2024年度文化活動補助申請表',
    url: '/applications/1'
  },
  {
    id: '2', 
    title: '體育發展計劃',
    type: 'program',
    description: '促進社區體育發展的補助計劃',
    url: '/programs/2'
  },
  {
    id: '3',
    title: '申請書範本.docx',
    type: 'file',
    description: '標準申請書文件範本',
    url: '/files/3'
  }
];

interface GlobalSearchProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onOpenChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    // 模擬搜索延遲
    setTimeout(() => {
      const filteredResults = mockSearchResults.filter(result =>
        result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filteredResults);
      setIsSearching(false);
    }, 500);
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      application: '申請',
      program: '計劃',
      file: '檔案',
      user: '用戶'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeBadgeClass = (type: string) => {
    const classes = {
      application: 'bg-blue-100 text-blue-800',
      program: 'bg-green-100 text-green-800',
      file: 'bg-purple-100 text-purple-800',
      user: 'bg-orange-100 text-orange-800'
    };
    return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>全局搜索</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索申請、計劃、檔案..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? '搜索中...' : '搜索'}
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.length === 0 && searchTerm && !isSearching && (
              <p className="text-sm text-muted-foreground text-center py-4">
                未找到相關結果
              </p>
            )}
            
            {results.map((result) => (
              <div
                key={result.id}
                className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => {
                  // 這裡可以添加導航邏輯
                  console.log('Navigate to:', result.url);
                  onOpenChange(false);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium">{result.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={getTypeBadgeClass(result.type)}
                      >
                        {getTypeLabel(result.type)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {result.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearch;
