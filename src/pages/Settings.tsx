
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { Settings as SettingsIcon, Bell, Shield, Database, Mail } from "lucide-react";

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    // 系統設置
    systemName: '補助申請管理系統',
    systemDescription: '簡化您的補助申請流程，提高申請效率',
    timezone: 'Asia/Taipei',
    language: 'zh-TW',
    
    // 通知設置
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    applicationStatusNotifications: true,
    documentUploadNotifications: true,
    
    // 安全設置
    sessionTimeout: '30',
    passwordMinLength: '8',
    requireTwoFactor: false,
    allowRememberLogin: true,
    
    // 應用設置
    maxFileSize: '10',
    allowedFileTypes: 'pdf,doc,docx,xls,xlsx,jpg,png',
    autoSaveDrafts: true,
    draftRetentionDays: '30'
  });

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    toast.success('設置已保存');
  };

  const handleReset = () => {
    const defaultSettings = {
      systemName: '補助申請管理系統',
      systemDescription: '簡化您的補助申請流程，提高申請效率',
      timezone: 'Asia/Taipei',
      language: 'zh-TW',
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      applicationStatusNotifications: true,
      documentUploadNotifications: true,
      sessionTimeout: '30',
      passwordMinLength: '8',
      requireTwoFactor: false,
      allowRememberLogin: true,
      maxFileSize: '10',
      allowedFileTypes: 'pdf,doc,docx,xls,xlsx,jpg,png',
      autoSaveDrafts: true,
      draftRetentionDays: '30'
    };
    setSettings(defaultSettings);
    toast.success('設置已重置為預設值');
  };

  return (
    <MainLayout>
      <div className="fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <SettingsIcon className="mr-3 h-8 w-8" />
              系統設置
            </h1>
            <p className="text-muted-foreground mt-1">
              管理系統配置和偏好設置
            </p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleReset}>
              重置設置
            </Button>
            <Button onClick={handleSave}>
              保存設置
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">一般設置</TabsTrigger>
            <TabsTrigger value="notifications">通知設置</TabsTrigger>
            <TabsTrigger value="security">安全設置</TabsTrigger>
            <TabsTrigger value="application">應用設置</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <SettingsIcon className="mr-2 h-5 w-5" />
                  一般設置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="systemName">系統名稱</Label>
                    <Input
                      id="systemName"
                      value={settings.systemName}
                      onChange={(e) => handleSettingChange('systemName', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="timezone">時區</Label>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) => handleSettingChange('timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Taipei">台北 (GMT+8)</SelectItem>
                        <SelectItem value="Asia/Shanghai">上海 (GMT+8)</SelectItem>
                        <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="systemDescription">系統描述</Label>
                  <Textarea
                    id="systemDescription"
                    value={settings.systemDescription}
                    onChange={(e) => handleSettingChange('systemDescription', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="language">語言</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => handleSettingChange('language', value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zh-TW">繁體中文</SelectItem>
                      <SelectItem value="zh-CN">简体中文</SelectItem>
                      <SelectItem value="en-US">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  通知設置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">電子郵件通知</Label>
                      <p className="text-sm text-muted-foreground">接收系統重要通知的電子郵件</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushNotifications">瀏覽器推送通知</Label>
                      <p className="text-sm text-muted-foreground">在瀏覽器中顯示即時通知</p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="applicationStatusNotifications">申請狀態變更通知</Label>
                      <p className="text-sm text-muted-foreground">當申請狀態發生變化時通知</p>
                    </div>
                    <Switch
                      id="applicationStatusNotifications"
                      checked={settings.applicationStatusNotifications}
                      onCheckedChange={(checked) => handleSettingChange('applicationStatusNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="documentUploadNotifications">文件上傳通知</Label>
                      <p className="text-sm text-muted-foreground">當有新文件上傳時通知</p>
                    </div>
                    <Switch
                      id="documentUploadNotifications"
                      checked={settings.documentUploadNotifications}
                      onCheckedChange={(checked) => handleSettingChange('documentUploadNotifications', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  安全設置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="sessionTimeout">會話超時 (分鐘)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="passwordMinLength">密碼最小長度</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={settings.passwordMinLength}
                      onChange={(e) => handleSettingChange('passwordMinLength', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireTwoFactor">要求雙重驗證</Label>
                      <p className="text-sm text-muted-foreground">所有用戶登入時都需要雙重驗證</p>
                    </div>
                    <Switch
                      id="requireTwoFactor"
                      checked={settings.requireTwoFactor}
                      onCheckedChange={(checked) => handleSettingChange('requireTwoFactor', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowRememberLogin">允許記住登入狀態</Label>
                      <p className="text-sm text-muted-foreground">用戶可以選擇記住登入狀態</p>
                    </div>
                    <Switch
                      id="allowRememberLogin"
                      checked={settings.allowRememberLogin}
                      onCheckedChange={(checked) => handleSettingChange('allowRememberLogin', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="application">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  應用設置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="maxFileSize">檔案大小限制 (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      value={settings.maxFileSize}
                      onChange={(e) => handleSettingChange('maxFileSize', e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="draftRetentionDays">草稿保留天數</Label>
                    <Input
                      id="draftRetentionDays"
                      type="number"
                      value={settings.draftRetentionDays}
                      onChange={(e) => handleSettingChange('draftRetentionDays', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="allowedFileTypes">允許的檔案類型</Label>
                  <Input
                    id="allowedFileTypes"
                    value={settings.allowedFileTypes}
                    onChange={(e) => handleSettingChange('allowedFileTypes', e.target.value)}
                    placeholder="使用逗號分隔，例如：pdf,doc,docx"
                  />
                  <p className="text-sm text-muted-foreground">
                    支援的格式：pdf, doc, docx, xls, xlsx, jpg, png, gif 等
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoSaveDrafts">自動保存草稿</Label>
                    <p className="text-sm text-muted-foreground">編輯過程中自動保存未完成的申請</p>
                  </div>
                  <Switch
                    id="autoSaveDrafts"
                    checked={settings.autoSaveDrafts}
                    onCheckedChange={(checked) => handleSettingChange('autoSaveDrafts', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
