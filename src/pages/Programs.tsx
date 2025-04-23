
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Tag, Clock, Info } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

// 模擬補助計劃數據
const subsidyPrograms = [
  {
    id: 1,
    title: "文化部藝術發展補助",
    organization: "文化部",
    description: "支持國內藝術工作者及團體發展創作，提升文化藝術水準，促進藝文產業良性發展。",
    deadline: "2025/05/20",
    category: "文化藝術",
    tags: ["展演活動", "藝術創作", "人才培育"],
    maxAmount: 500000,
    applyUrl: "#"
  },
  {
    id: 2,
    title: "體育署全民運動補助",
    organization: "體育署",
    description: "促進全民運動參與，提升國民體適能，推廣各類運動項目，建構健康活力社會。",
    deadline: "2025/06/15",
    category: "體育",
    tags: ["運動賽事", "場地設備", "教練培訓"],
    maxAmount: 300000,
    applyUrl: "#"
  },
  {
    id: 3,
    title: "教育部學生社團活動補助",
    organization: "教育部",
    description: "鼓勵大專院校學生參與社團活動，發展多元能力，提升自主學習與公民參與素養。",
    deadline: "2025/07/01",
    category: "教育",
    tags: ["學生社團", "校園活動", "服務學習"],
    maxAmount: 150000,
    applyUrl: "#"
  },
  {
    id: 4,
    title: "衛生福利部社區健康促進補助",
    organization: "衛生福利部",
    description: "推動社區健康促進計劃，強化民眾健康意識，建立社區自主健康管理能力。",
    deadline: "2025/05/30",
    category: "健康照護",
    tags: ["健康促進", "社區營造", "健康講座"],
    maxAmount: 250000,
    applyUrl: "#"
  },
  {
    id: 5,
    title: "環保署環境教育活動補助",
    organization: "環保署",
    description: "提升環境教育質量，促進民眾環境保護意識，推廣永續發展理念與實踐。",
    deadline: "2025/06/30",
    category: "環境教育",
    tags: ["環保活動", "永續發展", "生態保育"],
    maxAmount: 200000,
    applyUrl: "#"
  },
];

// 分類選項
const categories = ["全部", "文化藝術", "體育", "教育", "健康照護", "環境教育"];

const Programs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");

  // 處理搜索和過濾
  const filteredPrograms = subsidyPrograms.filter((program) => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        program.organization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "全部" || program.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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

          {filteredPrograms.length > 0 ? (
            filteredPrograms.map((program) => (
              <Card key={program.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{program.title}</CardTitle>
                      <CardDescription className="mt-1">{program.organization}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 hover:bg-blue-100">
                      {program.category}
                    </Badge>
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
                  <Button variant="ghost" size="sm" asChild>
                    <a href="#" className="text-muted-foreground">查看詳情</a>
                  </Button>
                  <Button size="sm" asChild>
                    <a href={program.applyUrl}>開始申請</a>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">沒有符合條件的補助計劃</h3>
                <p className="text-muted-foreground text-sm mb-4">請嘗試不同的搜索條件</p>
                <Button variant="outline" onClick={() => {setSearchTerm(""); setSelectedCategory("全部");}}>
                  清除篩選條件
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Programs;
