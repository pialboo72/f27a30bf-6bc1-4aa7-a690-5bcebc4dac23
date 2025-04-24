
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Search, Edit, Trash, Plus, Copy } from 'lucide-react';

// 模擬補助計畫資料
const initialPrograms = [
  {
    id: 1,
    name: '文化藝術發展補助計畫',
    agency: '文化部',
    target: '文化藝術工作者、團體',
    standard: '依計畫內容評分，最高補助80%',
    period: '2025-01-01 至 2025-12-31',
    focus: '傳統藝術保存、現代藝術創新',
    totalBudget: 5000000,
    subsidyLimit: 500000,
    description: '促進台灣文化藝術發展，支持優秀創作者及團體。',
    documents: '申請表、計畫書、前期作品資料',
    links: 'https://www.moc.gov.tw'
  },
  {
    id: 2,
    name: '青年創業補助計畫',
    agency: '經濟部',
    target: '35歲以下青年創業者',
    standard: '資本額50%，最高300萬',
    period: '2025-03-01 至 2025-12-31',
    focus: '數位創新、永續發展',
    totalBudget: 10000000,
    subsidyLimit: 3000000,
    description: '鼓勵青年投入創新創業，促進經濟發展與就業機會。',
    documents: '創業計畫書、財務規劃',
    links: 'https://www.moea.gov.tw'
  }
];

const ProgramManagement: React.FC = () => {
  const [programs, setPrograms] = useState(initialPrograms);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<any | null>(null);
  const [isNewProgram, setIsNewProgram] = useState(true);

  // 程式基本資料欄位
  const [programName, setProgramName] = useState('');
  const [agency, setAgency] = useState('');
  const [target, setTarget] = useState('');
  const [standard, setStandard] = useState('');
  const [period, setPeriod] = useState('');
  const [focus, setFocus] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [subsidyLimit, setSubsidyLimit] = useState('');
  const [description, setDescription] = useState('');
  const [documents, setDocuments] = useState('');
  const [links, setLinks] = useState('');

  // 處理搜尋
  const filteredPrograms = programs.filter(program => 
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 開啟對話框新增計畫
  const handleAddProgram = () => {
    setIsNewProgram(true);
    resetForm();
    setIsDialogOpen(true);
  };

  // 開啟對話框編輯計畫
  const handleEditProgram = (program: any) => {
    setIsNewProgram(false);
    setCurrentProgram(program);
    setProgramName(program.name);
    setAgency(program.agency);
    setTarget(program.target);
    setStandard(program.standard);
    setPeriod(program.period);
    setFocus(program.focus);
    setTotalBudget(program.totalBudget.toString());
    setSubsidyLimit(program.subsidyLimit.toString());
    setDescription(program.description);
    setDocuments(program.documents);
    setLinks(program.links);
    setIsDialogOpen(true);
  };

  // 複製計畫
  const handleCopyProgram = (program: any) => {
    const newProgram = {
      ...program,
      id: Date.now(),
      name: `${program.name} (複製)`
    };
    setPrograms([...programs, newProgram]);
    toast.success('計畫已複製');
  };

  // 刪除計畫
  const handleDeleteProgram = (id: number) => {
    if (window.confirm('確定要刪除此補助計畫嗎？')) {
      setPrograms(programs.filter(program => program.id !== id));
      toast.success('補助計畫已刪除');
    }
  };

  // 重設表單
  const resetForm = () => {
    setProgramName('');
    setAgency('');
    setTarget('');
    setStandard('');
    setPeriod('');
    setFocus('');
    setTotalBudget('');
    setSubsidyLimit('');
    setDescription('');
    setDocuments('');
    setLinks('');
    setCurrentProgram(null);
  };

  // 處理保存
  const handleSave = () => {
    // 驗證必填欄位
    if (!programName || !agency || !totalBudget || !subsidyLimit) {
      toast.error('請填寫所有必填欄位');
      return;
    }

    const programData = {
      id: isNewProgram ? Date.now() : currentProgram?.id,
      name: programName,
      agency,
      target,
      standard,
      period,
      focus,
      totalBudget: parseFloat(totalBudget),
      subsidyLimit: parseFloat(subsidyLimit),
      description,
      documents,
      links
    };

    if (isNewProgram) {
      setPrograms([...programs, programData]);
      toast.success('新補助計畫已建立');
    } else {
      setPrograms(programs.map(p => p.id === currentProgram?.id ? programData : p));
      toast.success('補助計畫已更新');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">補助計畫管理</h1>
            <p className="text-muted-foreground mt-1">管理系統中的補助計畫資料</p>
          </div>
          <Button onClick={handleAddProgram}>
            <Plus className="mr-2 h-4 w-4" />
            新增計畫
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜尋計畫名稱、補助機關或對象..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>補助計畫列表</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPrograms.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>計畫名稱</TableHead>
                      <TableHead>補助機關</TableHead>
                      <TableHead>補助對象</TableHead>
                      <TableHead>整案預算</TableHead>
                      <TableHead>單位補助上限</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrograms.map(program => (
                      <TableRow key={program.id}>
                        <TableCell className="font-medium">{program.name}</TableCell>
                        <TableCell>{program.agency}</TableCell>
                        <TableCell>{program.target}</TableCell>
                        <TableCell>{program.totalBudget.toLocaleString()} 元</TableCell>
                        <TableCell>{program.subsidyLimit.toLocaleString()} 元</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCopyProgram(program)}
                              title="複製"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditProgram(program)}
                              title="編輯"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500 hover:text-red-700" 
                              onClick={() => handleDeleteProgram(program.id)}
                              title="刪除"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-2">沒有找到符合條件的補助計畫</p>
                <Button variant="outline" onClick={handleAddProgram}>
                  <Plus className="mr-2 h-4 w-4" />
                  建立補助計畫
                </Button>
              </div>
            )}
            
            {filteredPrograms.length > 0 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </CardContent>
        </Card>
        
        {/* 新增/編輯計畫對話框 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isNewProgram ? '新增補助計畫' : '編輯補助計畫'}</DialogTitle>
              <DialogDescription>
                填寫以下資料以{isNewProgram ? '建立新的' : '更新現有'}補助計畫
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="program-name">計畫名稱 <span className="text-red-500">*</span></Label>
                  <Input
                    id="program-name"
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    placeholder="輸入補助計畫名稱"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agency">補助機關 <span className="text-red-500">*</span></Label>
                  <Input
                    id="agency"
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    placeholder="輸入補助機關名稱"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target">補助對象</Label>
                  <Input
                    id="target"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="輸入補助對象"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="standard">補助標準</Label>
                  <Input
                    id="standard"
                    value={standard}
                    onChange={(e) => setStandard(e.target.value)}
                    placeholder="輸入補助標準"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="period">補助期間</Label>
                  <Input
                    id="period"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="例：2025-01-01 至 2025-12-31"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="focus">補助重點</Label>
                  <Input
                    id="focus"
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                    placeholder="輸入補助重點"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total-budget">整案預算 (元) <span className="text-red-500">*</span></Label>
                  <Input
                    id="total-budget"
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    placeholder="輸入整案預算金額"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subsidy-limit">單位補助上限 (元) <span className="text-red-500">*</span></Label>
                  <Input
                    id="subsidy-limit"
                    type="number"
                    value={subsidyLimit}
                    onChange={(e) => setSubsidyLimit(e.target.value)}
                    placeholder="輸入單位補助上限金額"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">計畫概述</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="輸入補助計畫詳細描述"
                  className="h-20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="documents">申請文件</Label>
                <Input
                  id="documents"
                  value={documents}
                  onChange={(e) => setDocuments(e.target.value)}
                  placeholder="例：申請表、計畫書"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="links">相關連結</Label>
                <Input
                  id="links"
                  value={links}
                  onChange={(e) => setLinks(e.target.value)}
                  placeholder="輸入相關網站連結"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>取消</Button>
              <Button onClick={handleSave}>{isNewProgram ? '建立' : '更新'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default ProgramManagement;
