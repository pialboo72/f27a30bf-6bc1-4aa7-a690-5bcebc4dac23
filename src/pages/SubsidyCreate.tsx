
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Save, ArrowLeft, File, Link, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

interface Attachment {
  id: number;
  name: string;
  originalName: string;
  size: number;
  uploadDate: string;
}

interface DocumentLink {
  id: number;
  name: string;
  url: string;
}

interface SubsidyDocument {
  id: number;
  name: string;
  type: 'application' | 'reimbursement';
  uploadDate: string;
  size: number;
}

const SubsidyCreate: React.FC = () => {
  const navigate = useNavigate();
  
  const [subsidyData, setSubsidyData] = useState({
    title: "",
    organization: "",
    amount: "",
    deadline: "",
    description: ""
  });

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [links, setLinks] = useState<DocumentLink[]>([]);
  const [applicationDocuments, setApplicationDocuments] = useState<SubsidyDocument[]>([]);
  const [reimbursementDocuments, setReimbursementDocuments] = useState<SubsidyDocument[]>([]);

  // 附件管理
  const [newAttachmentName, setNewAttachmentName] = useState("");
  
  // 連結管理
  const [newLink, setNewLink] = useState({ name: "", url: "" });

  const handleInputChange = (field: string, value: string) => {
    setSubsidyData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'attachment' | 'application' | 'reimbursement') => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const newItem = {
      id: Date.now(),
      name: type === 'attachment' ? (newAttachmentName || file.name) : file.name,
      originalName: file.name,
      size: file.size,
      uploadDate: new Date().toISOString().split('T')[0],
      type: type === 'application' ? 'application' as const : type === 'reimbursement' ? 'reimbursement' as const : undefined
    };

    if (type === 'attachment') {
      setAttachments(prev => [...prev, newItem as Attachment]);
      setNewAttachmentName("");
    } else if (type === 'application') {
      setApplicationDocuments(prev => [...prev, newItem as SubsidyDocument]);
    } else if (type === 'reimbursement') {
      setReimbursementDocuments(prev => [...prev, newItem as SubsidyDocument]);
    }

    toast.success("檔案上傳成功");
  };

  const handleAddLink = () => {
    if (!newLink.name || !newLink.url) {
      toast.error("請填寫連結名稱和網址");
      return;
    }

    const link: DocumentLink = {
      id: Date.now(),
      name: newLink.name,
      url: newLink.url
    };

    setLinks(prev => [...prev, link]);
    setNewLink({ name: "", url: "" });
    toast.success("連結新增成功");
  };

  const handleRemoveItem = (itemId: number, type: 'attachment' | 'link' | 'application' | 'reimbursement') => {
    if (type === 'attachment') {
      setAttachments(prev => prev.filter(a => a.id !== itemId));
    } else if (type === 'link') {
      setLinks(prev => prev.filter(l => l.id !== itemId));
    } else if (type === 'application') {
      setApplicationDocuments(prev => prev.filter(d => d.id !== itemId));
    } else if (type === 'reimbursement') {
      setReimbursementDocuments(prev => prev.filter(d => d.id !== itemId));
    }
    toast.success("項目已刪除");
  };

  const handleSave = () => {
    if (!subsidyData.title || !subsidyData.organization || !subsidyData.amount) {
      toast.error("請填寫必要欄位");
      return;
    }

    // 這裡可以加入實際的保存邏輯
    toast.success("補助案新增成功");
    navigate("/admin/subsidies");
  };

  return (
    <MainLayout>
      <div className="fade-in">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/admin/subsidies")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回補助管理
            </Button>
            <div>
              <h1 className="text-3xl font-bold">新增補助案</h1>
              <p className="text-muted-foreground mt-1">
                設定補助案基本資訊及相關文件
              </p>
            </div>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            儲存補助案
          </Button>
        </div>

        <div className="space-y-6">
          {/* 基本資訊 */}
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
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="請輸入補助案名稱"
                  />
                </div>
                <div>
                  <Label>主辦機關 *</Label>
                  <Input
                    value={subsidyData.organization}
                    onChange={(e) => handleInputChange('organization', e.target.value)}
                    placeholder="請輸入主辦機關"
                  />
                </div>
                <div>
                  <Label>補助金額 *</Label>
                  <Input
                    type="number"
                    value={subsidyData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="請輸入補助金額"
                  />
                </div>
                <div>
                  <Label>申請截止日期</Label>
                  <Input
                    type="date"
                    value={subsidyData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>補助說明</Label>
                <Textarea
                  value={subsidyData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="請輸入補助說明"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* 文件管理 */}
          <Card>
            <CardHeader>
              <CardTitle>文件管理</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="attachments">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="attachments">附件</TabsTrigger>
                  <TabsTrigger value="links">連結</TabsTrigger>
                  <TabsTrigger value="application">申請文件</TabsTrigger>
                  <TabsTrigger value="reimbursement">核銷文件</TabsTrigger>
                </TabsList>
                
                <TabsContent value="attachments" className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="附件名稱"
                      value={newAttachmentName}
                      onChange={(e) => setNewAttachmentName(e.target.value)}
                    />
                    <Input
                      type="file"
                      onChange={(e) => handleFileUpload(e, 'attachment')}
                    />
                  </div>
                  <div className="space-y-2">
                    {attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4" />
                          <span>{attachment.name}</span>
                          <Badge variant="outline">{(attachment.size / 1024).toFixed(2)} KB</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(attachment.id, 'attachment')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="links" className="space-y-4">
                  <div className="grid gap-2 md:grid-cols-3">
                    <Input
                      placeholder="連結名稱"
                      value={newLink.name}
                      onChange={(e) => setNewLink({...newLink, name: e.target.value})}
                    />
                    <Input
                      placeholder="連結網址"
                      value={newLink.url}
                      onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                    />
                    <Button onClick={handleAddLink}>
                      <Plus className="h-4 w-4 mr-1" />
                      新增連結
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {links.map((link) => (
                      <div key={link.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Link className="h-4 w-4" />
                          <span>{link.name}</span>
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {link.url}
                          </a>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(link.id, 'link')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="application" className="space-y-4">
                  <Input
                    type="file"
                    onChange={(e) => handleFileUpload(e, 'application')}
                  />
                  <div className="space-y-2">
                    {applicationDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4" />
                          <span>{doc.name}</span>
                          <Badge variant="outline">{(doc.size / 1024).toFixed(2)} KB</Badge>
                          <Badge>{doc.uploadDate}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(doc.id, 'application')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="reimbursement" className="space-y-4">
                  <Input
                    type="file"
                    onChange={(e) => handleFileUpload(e, 'reimbursement')}
                  />
                  <div className="space-y-2">
                    {reimbursementDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4" />
                          <span>{doc.name}</span>
                          <Badge variant="outline">{(doc.size / 1024).toFixed(2)} KB</Badge>
                          <Badge>{doc.uploadDate}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(doc.id, 'reimbursement')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default SubsidyCreate;
