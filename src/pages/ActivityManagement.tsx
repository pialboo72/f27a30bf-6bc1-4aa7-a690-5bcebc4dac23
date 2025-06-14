
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import MainLayout from '@/components/layout/MainLayout';
import { Plus, Search, Edit, Trash, Calendar, MapPin, Users } from "lucide-react";
import {
  Table, 
  TableHeader,
  TableBody, 
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import {
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogFooter, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Activity {
  id: number;
  name: string;
  category: string;
  status: string;
  location: string;
  date: string;
  participants: number;
  budget: number;
  description: string;
  subsidyProgram: string;
}

const initialActivities: Activity[] = [
  {
    id: 1,
    name: '文化藝術展演活動',
    category: '文化藝術',
    status: '進行中',
    location: '台北文化中心',
    date: '2025-07-15',
    participants: 150,
    budget: 300000,
    description: '推廣在地文化藝術，促進社區文化交流',
    subsidyProgram: '文化部藝術發展補助'
  },
  {
    id: 2,
    name: '青年體育競賽',
    category: '體育',
    status: '籌備中',
    location: '新北市體育館',
    date: '2025-08-20',
    participants: 300,
    budget: 500000,
    description: '鼓勵青年參與體育活動，培養運動精神',
    subsidyProgram: '體育署全民運動補助'
  },
  {
    id: 3,
    name: '環保教育工作坊',
    category: '環境教育',
    status: '已完成',
    location: '桃園環保公園',
    date: '2025-06-10',
    participants: 80,
    budget: 150000,
    description: '提升民眾環保意識，推廣永續發展理念',
    subsidyProgram: '環保署環境教育活動補助'
  }
];

const categories = ['全部', '文化藝術', '體育', '教育', '健康照護', '環境教育'];
const statusOptions = ['籌備中', '進行中', '已完成', '已取消'];

const ActivityManagement: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [isNewActivity, setIsNewActivity] = useState(true);

  // 表單狀態
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    status: '',
    location: '',
    date: '',
    participants: '',
    budget: '',
    description: '',
    subsidyProgram: ''
  });

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        activity.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        activity.subsidyProgram.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '全部' || activity.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddActivity = () => {
    setIsNewActivity(true);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditActivity = (activity: Activity) => {
    setIsNewActivity(false);
    setCurrentActivity(activity);
    setFormData({
      name: activity.name,
      category: activity.category,
      status: activity.status,
      location: activity.location,
      date: activity.date,
      participants: activity.participants.toString(),
      budget: activity.budget.toString(),
      description: activity.description,
      subsidyProgram: activity.subsidyProgram
    });
    setIsDialogOpen(true);
  };

  const handleDeleteActivity = (id: number) => {
    if (window.confirm('確定要刪除此活動嗎？')) {
      setActivities(activities.filter(activity => activity.id !== id));
      toast.success('活動已刪除');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      status: '',
      location: '',
      date: '',
      participants: '',
      budget: '',
      description: '',
      subsidyProgram: ''
    });
    setCurrentActivity(null);
  };

  const handleSave = () => {
    if (!formData.name || !formData.category || !formData.status || !formData.date) {
      toast.error('請填寫所有必填欄位');
      return;
    }

    const activityData: Activity = {
      id: isNewActivity ? Date.now() : currentActivity?.id!,
      name: formData.name,
      category: formData.category,
      status: formData.status,
      location: formData.location,
      date: formData.date,
      participants: parseInt(formData.participants) || 0,
      budget: parseFloat(formData.budget) || 0,
      description: formData.description,
      subsidyProgram: formData.subsidyProgram
    };

    if (isNewActivity) {
      setActivities([...activities, activityData]);
      toast.success('新活動已建立');
    } else {
      setActivities(activities.map(a => a.id === currentActivity?.id ? activityData : a));
      toast.success('活動已更新');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case '進行中': return 'default';
      case '籌備中': return 'secondary';
      case '已完成': return 'outline';
      case '已取消': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">活動管理</h1>
            <p className="text-muted-foreground mt-1">管理系統中的活動資料</p>
          </div>
          <Button onClick={handleAddActivity}>
            <Plus className="mr-2 h-4 w-4" />
            新增活動
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜尋活動名稱、地點或補助計畫..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
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
        
        <Card>
          <CardHeader>
            <CardTitle>活動列表</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredActivities.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>活動名稱</TableHead>
                      <TableHead>分類</TableHead>
                      <TableHead>狀態</TableHead>
                      <TableHead>地點</TableHead>
                      <TableHead>日期</TableHead>
                      <TableHead>預算</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.map(activity => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{activity.name}</div>
                            <div className="text-sm text-muted-foreground">{activity.subsidyProgram}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{activity.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(activity.status)}>
                            {activity.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                            {activity.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                            {activity.date}
                          </div>
                        </TableCell>
                        <TableCell>NT$ {activity.budget.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditActivity(activity)}
                              title="編輯"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500 hover:text-red-700" 
                              onClick={() => handleDeleteActivity(activity.id)}
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
                <p className="text-muted-foreground mb-2">沒有找到符合條件的活動</p>
                <Button variant="outline" onClick={handleAddActivity}>
                  <Plus className="mr-2 h-4 w-4" />
                  建立活動
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isNewActivity ? '新增活動' : '編輯活動'}</DialogTitle>
              <DialogDescription>
                填寫以下資料以{isNewActivity ? '建立新的' : '更新現有'}活動
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="activity-name">活動名稱 <span className="text-red-500">*</span></Label>
                  <Input
                    id="activity-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="輸入活動名稱"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">活動分類 <span className="text-red-500">*</span></Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
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
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
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
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">活動地點</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="輸入活動地點"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participants">預計參與人數</Label>
                  <Input
                    id="participants"
                    type="number"
                    value={formData.participants}
                    onChange={(e) => setFormData({...formData, participants: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    placeholder="輸入活動預算金額"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subsidy-program">補助計畫</Label>
                  <Input
                    id="subsidy-program"
                    value={formData.subsidyProgram}
                    onChange={(e) => setFormData({...formData, subsidyProgram: e.target.value})}
                    placeholder="輸入申請的補助計畫"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">活動描述</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="輸入活動詳細描述"
                  className="h-20"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>取消</Button>
              <Button onClick={handleSave}>{isNewActivity ? '建立' : '更新'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default ActivityManagement;
