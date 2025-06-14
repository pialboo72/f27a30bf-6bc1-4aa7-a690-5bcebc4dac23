
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import TemplateForm from '../template/TemplateForm';

// 使用與 Programs.tsx 相同的補助計劃資料
const subsidyPrograms = [
  {
    id: 1,
    title: "文化部藝術發展補助",
    organization: "文化部",
    deadline: "2025/05/20",
    category: "文化藝術",
    maxAmount: 500000,
    applicationTemplate: {
      id: 101,
      name: "文化部藝術發展補助申請書.docx",
      path: "/templates/culture-art-application.docx",
      size: 45678,
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      tags: [
        { id: 1, name: "申請單位" },
        { id: 2, name: "活動名稱" },
        { id: 3, name: "申請日期" },
        { id: 4, name: "活動目的" },
        { id: 5, name: "預計參與人數" }
      ]
    },
    requiredDocuments: ["活動企劃書", "預算表", "團體證明文件"]
  },
  {
    id: 2,
    title: "體育署全民運動補助",
    organization: "體育署",
    deadline: "2025/06/15",
    category: "體育",
    maxAmount: 300000,
    applicationTemplate: {
      id: 102,
      name: "體育署運動補助申請表.docx",
      path: "/templates/sports-application.docx",
      size: 38456,
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      tags: [
        { id: 6, name: "申請單位" },
        { id: 7, name: "運動項目" },
        { id: 8, name: "活動地點" },
        { id: 9, name: "預計效益" }
      ]
    },
    requiredDocuments: ["活動計劃書", "場地使用證明", "安全保險證明"]
  },
  {
    id: 3,
    title: "教育部學生社團活動補助",
    organization: "教育部",
    deadline: "2025/07/01",
    category: "教育",
    maxAmount: 150000
  }
];

interface ActivityApplicationIntegrationProps {
  activityData: any;
  onProgramSelect: (programId: string) => void;
  selectedProgram?: string;
}

const ActivityApplicationIntegration: React.FC<ActivityApplicationIntegrationProps> = ({
  activityData,
  onProgramSelect,
  selectedProgram
}) => {
  const [selectedProgramData, setSelectedProgramData] = useState<any>(null);
  const [generatedDocuments, setGeneratedDocuments] = useState<string[]>([]);

  useEffect(() => {
    if (selectedProgram) {
      const program = subsidyPrograms.find(p => p.id.toString() === selectedProgram);
      setSelectedProgramData(program);
    } else {
      setSelectedProgramData(null);
    }
  }, [selectedProgram]);

  const handleGenerateApplication = () => {
    if (!selectedProgramData) {
      toast.error("請先選擇補助計劃");
      return;
    }

    // 模擬生成申請文件
    const newDoc = `${selectedProgramData.title}_申請書_${new Date().getTime()}.docx`;
    setGeneratedDocuments(prev => [...prev, newDoc]);
    toast.success("申請文件已生成");
  };

  const getRecommendedPrograms = () => {
    if (!activityData?.category) return subsidyPrograms;
    
    // 根據活動類別推薦相關的補助計劃
    const categoryMapping: { [key: string]: string[] } = {
      '文化藝術': ['文化藝術'],
      '體育活動': ['體育'],
      '教育學習': ['教育'],
      '社區服務': ['健康照護', '環境教育']
    };

    const matchingCategories = categoryMapping[activityData.category] || [];
    return subsidyPrograms.filter(program => 
      matchingCategories.includes(program.category) || matchingCategories.length === 0
    );
  };

  const recommendedPrograms = getRecommendedPrograms();

  return (
    <div className="space-y-6">
      {/* 補助計劃選擇 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            選擇補助計劃
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>適合的補助計劃</Label>
            <Select value={selectedProgram || ''} onValueChange={onProgramSelect}>
              <SelectTrigger>
                <SelectValue placeholder="請選擇要申請的補助計劃" />
              </SelectTrigger>
              <SelectContent>
                {recommendedPrograms.map((program) => (
                  <SelectItem key={program.id} value={program.id.toString()}>
                    <div className="flex flex-col">
                      <span>{program.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {program.organization} • 截止: {program.deadline}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProgramData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-blue-900">{selectedProgramData.title}</h4>
                  <p className="text-sm text-blue-700">{selectedProgramData.organization}</p>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {selectedProgramData.category}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-900">申請截止:</span>
                  <span className="text-blue-700 ml-2">{selectedProgramData.deadline}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-900">最高金額:</span>
                  <span className="text-blue-700 ml-2">NT$ {selectedProgramData.maxAmount.toLocaleString()}</span>
                </div>
              </div>

              {selectedProgramData.applicationTemplate && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">已設定申請模板</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    {selectedProgramData.applicationTemplate.name}
                  </p>
                </div>
              )}

              {selectedProgramData.requiredDocuments && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-blue-900 mb-2">必備附件:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProgramData.requiredDocuments.map((doc: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 申請文件生成 */}
      {selectedProgramData && selectedProgramData.applicationTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>生成申請文件</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateForm template={selectedProgramData.applicationTemplate} />
          </CardContent>
        </Card>
      )}

      {/* 沒有模板的提示 */}
      {selectedProgramData && !selectedProgramData.applicationTemplate && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            此補助計劃尚未設定申請模板，請聯繫管理員或手動準備申請文件。
          </AlertDescription>
        </Alert>
      )}

      {/* 已生成的文件列表 */}
      {generatedDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>已生成的申請文件</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {generatedDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">{doc}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    下載
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActivityApplicationIntegration;
