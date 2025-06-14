
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubsidyData {
  title: string;
  organization: string;
  amount: string;
  startDate: string;
  deadline: string;
  description: string;
  category: string;
  eligibleApplicants: string;
  subsidyScope: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  reviewCriteria: string;
  status: string;
}

interface SubsidyBasicInfoFormProps {
  subsidyData: SubsidyData;
  onInputChange: (field: string, value: string) => void;
}

const SubsidyBasicInfoForm: React.FC<SubsidyBasicInfoFormProps> = ({
  subsidyData,
  onInputChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>基本資訊</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>補助案名稱 *</Label>
            <Input
              value={subsidyData.title}
              onChange={(e) => onInputChange('title', e.target.value)}
              placeholder="請輸入補助案名稱"
            />
          </div>
          <div>
            <Label>主辦機關 *</Label>
            <Input
              value={subsidyData.organization}
              onChange={(e) => onInputChange('organization', e.target.value)}
              placeholder="請輸入主辦機關"
            />
          </div>
          <div>
            <Label>補助金額 *</Label>
            <Input
              type="number"
              value={subsidyData.amount}
              onChange={(e) => onInputChange('amount', e.target.value)}
              placeholder="請輸入補助金額"
            />
          </div>
          <div>
            <Label>補助類別</Label>
            <Select value={subsidyData.category} onValueChange={(value) => onInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="選擇補助類別" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="文化藝術">文化藝術</SelectItem>
                <SelectItem value="社會福利">社會福利</SelectItem>
                <SelectItem value="教育研究">教育研究</SelectItem>
                <SelectItem value="環保永續">環保永續</SelectItem>
                <SelectItem value="科技創新">科技創新</SelectItem>
                <SelectItem value="其他">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>申請開始日期</Label>
            <Input
              type="date"
              value={subsidyData.startDate}
              onChange={(e) => onInputChange('startDate', e.target.value)}
            />
          </div>
          <div>
            <Label>申請截止日期</Label>
            <Input
              type="date"
              value={subsidyData.deadline}
              onChange={(e) => onInputChange('deadline', e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>申請資格對象</Label>
            <Input
              value={subsidyData.eligibleApplicants}
              onChange={(e) => onInputChange('eligibleApplicants', e.target.value)}
              placeholder="如：非營利組織、學校、個人等"
            />
          </div>
          <div>
            <Label>補助範圍</Label>
            <Input
              value={subsidyData.subsidyScope}
              onChange={(e) => onInputChange('subsidyScope', e.target.value)}
              placeholder="如：活動費用、設備採購、人事費用等"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label>聯絡人</Label>
            <Input
              value={subsidyData.contactPerson}
              onChange={(e) => onInputChange('contactPerson', e.target.value)}
              placeholder="承辦人姓名"
            />
          </div>
          <div>
            <Label>聯絡電話</Label>
            <Input
              value={subsidyData.contactPhone}
              onChange={(e) => onInputChange('contactPhone', e.target.value)}
              placeholder="連絡電話"
            />
          </div>
          <div>
            <Label>聯絡信箱</Label>
            <Input
              type="email"
              value={subsidyData.contactEmail}
              onChange={(e) => onInputChange('contactEmail', e.target.value)}
              placeholder="聯絡信箱"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>補助說明</Label>
            <Textarea
              value={subsidyData.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              placeholder="請輸入補助說明"
              rows={4}
            />
          </div>
          <div>
            <Label>審查標準</Label>
            <Textarea
              value={subsidyData.reviewCriteria}
              onChange={(e) => onInputChange('reviewCriteria', e.target.value)}
              placeholder="請輸入審查標準與評分方式"
              rows={4}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubsidyBasicInfoForm;
