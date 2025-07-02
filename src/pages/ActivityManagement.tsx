
import React, { useState } from 'react';
import { toast } from 'sonner';
import MainLayout from '@/components/layout/MainLayout';
import { Plus } from "lucide-react";
import { Button } from '@/components/ui/button';
import ActivityManagementFilters from '@/components/activity/ActivityManagementFilters';
import ActivityManagementTable from '@/components/activity/ActivityManagementTable';
import ActivityFormDialog from '@/components/activity/ActivityFormDialog';

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
        
        <ActivityManagementFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />
        
        <ActivityManagementTable
          activities={filteredActivities}
          onEdit={handleEditActivity}
          onDelete={handleDeleteActivity}
          onAdd={handleAddActivity}
        />
        
        <ActivityFormDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          isNew={isNewActivity}
          formData={formData}
          onFormDataChange={setFormData}
          onSave={handleSave}
          categories={categories}
          statusOptions={statusOptions}
        />
      </div>
    </MainLayout>
  );
};

export default ActivityManagement;
