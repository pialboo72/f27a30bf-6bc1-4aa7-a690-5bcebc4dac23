
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  name: string;
  category: string;
  status: string;
  location: string;
  date: string;
  participants: string;
  budget: string;
  description: string;
  subsidyProgram: string;
}

interface ActivityFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isNew: boolean;
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  onSave: () => void;
  categories: string[];
  statusOptions: string[];
}

const ActivityFormDialog: React.FC<ActivityFormDialogProps> = ({
  isOpen,
  onClose,
  isNew,
  formData,
  onFormDataChange,
  onSave,
  categories,
  statusOptions
}) => {
  const updateFormData = (field: keyof FormData, value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isNew ? '新增活動' : '編輯活動'}</DialogTitle>
          <DialogDescription>
            填寫以下資料以{isNew ? '建立新的' : '更新現有'}活動
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="activity-name">活動名稱 <span className="text-red-500">*</span></Label>
              <Input
                id="activity-name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="輸入活動名稱"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">活動分類 <span className="text-red-500">*</span></Label>
              <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇活動分類" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c !== '全部').map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">活動狀態 <span className="text-red-500">*</span></Label>
              <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇活動狀態" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">活動日期 <span className="text-red-500">*</span></Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => updateFormData('date', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">活動地點</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => updateFormData('location', e.target.value)}
                placeholder="輸入活動地點"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="participants">預計參與人數</Label>
              <Input
                id="participants"
                type="number"
                value={formData.participants}
                onChange={(e) => updateFormData('participants', e.target.value)}
                placeholder="輸入預計參與人數"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">活動預算 (元)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => updateFormData('budget', e.target.value)}
                placeholder="輸入活動預算金額"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subsidy-program">補助計畫</Label>
              <Input
                id="subsidy-program"
                value={formData.subsidyProgram}
                onChange={(e) => updateFormData('subsidyProgram', e.target.value)}
                placeholder="輸入申請的補助計畫"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">活動描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="輸入活動詳細描述"
              className="h-20"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={onSave}>{isNew ? '建立' : '更新'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityFormDialog;
