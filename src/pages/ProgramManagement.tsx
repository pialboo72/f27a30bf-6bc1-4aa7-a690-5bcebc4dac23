
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import MainLayout from '@/components/layout/MainLayout';

const ProgramManagement: React.FC = () => {
  const [programName, setProgramName] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [subsidyLimit, setSubsidyLimit] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    // Validate inputs
    if (!programName || !totalBudget || !subsidyLimit) {
      toast.error('請填寫所有必填欄位');
      return;
    }

    // Save program logic here
    toast.success('補助計畫已成功儲存');
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">補助計畫管理</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>新增/編輯補助計畫</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block mb-2">計畫名稱</label>
              <Input 
                value={programName} 
                onChange={(e) => setProgramName(e.target.value)} 
                placeholder="輸入補助計畫名稱" 
              />
            </div>
            
            <div>
              <label className="block mb-2">整案預算</label>
              <Input 
                type="number"
                value={totalBudget} 
                onChange={(e) => setTotalBudget(e.target.value)} 
                placeholder="輸入整案預算" 
              />
            </div>
            
            <div>
              <label className="block mb-2">單位補助上限</label>
              <Input 
                type="number"
                value={subsidyLimit} 
                onChange={(e) => setSubsidyLimit(e.target.value)} 
                placeholder="輸入單位補助上限" 
              />
            </div>
            
            <div>
              <label className="block mb-2">計畫描述</label>
              <Textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="輸入補助計畫詳細描述"
                className="h-32"
              />
            </div>
            
            <Button onClick={handleSave} className="w-full">
              儲存計畫
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ProgramManagement;
