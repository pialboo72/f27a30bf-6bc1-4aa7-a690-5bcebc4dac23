
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, Upload, Calendar, DollarSign, Building, X, Link, File, Trash2 } from "lucide-react";
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

interface SubsidyCase {
  id: number;
  title: string;
  organization: string;
  amount: number;
  deadline: string;
  status: string;
  description: string;
  attachments: Attachment[];
  links: DocumentLink[];
  applicationDocuments: SubsidyDocument[];
  reimbursementDocuments: SubsidyDocument[];
}

const SubsidyManagement: React.FC = () => {
  const [subsidyCases, setSubsidyCases] = useState<SubsidyCase[]>([
    {
      id: 1,
      title: "文化藝術發展補助",
      organization: "文化部",
      amount: 500000,
      deadline: "2025-05-20",
      status: "進行中",
      description: "支持藝術創作與文化發展",
      attachments: [],
      links: [],
      applicationDocuments: [],
      reimbursementDocuments: []
    },
    {
      id: 2,
      title: "社區服務計劃補助",
      organization: "社會局",
      amount: 300000,
      deadline: "2025-06-15",
      status: "即將截止",
      description: "促進社區服務與志工參與",
      attachments: [],
      links: [],
      applicationDocuments: [],
      reimbursementDocuments: []
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCase, setSelectedCase] = useState<SubsidyCase | null>(null);
  const [newCase, setNewCase] = useState({
    title: "",
    organization: "",
    amount: "",
    deadline: "",
    description: ""
  });

  // 附件管理
  const [newAttachmentName, setNewAttachmentName] = useState("");

  // 連結管理
  const [newLink, setNewLink] = useState({ name: "", url: "" });

  const handleAddCase = () => {
    if (!newCase.title || !newCase.organization || !newCase.amount) {
      toast.error("請填寫必要欄位");
      return;
    }

    const subsidyCase: SubsidyCase = {
      id: Date.now(),
      title: newCase.title,
      organization: newCase.organization,
      amount: parseInt(newCase.amount),
      deadline: newCase.deadline,
      status: "進行中",
      description: newCase.description,
      attachments: [],
      links: [],
      applicationDocuments: [],
      reimbursementDocuments: []
    };

    setSubsidyCases([...subsidyCases, subsidyCase]);
    setNewCase({ title: "", organization: "", amount: "", deadline: "", description: "" });
    setShowAddForm(false);
    toast.success("補助案新增成功");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, caseId: number, type: 'attachment' | 'application' | 'reimbursement') => {
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

    setSubsidyCases(cases => cases.map(c => {
      if (c.id === caseId) {
        if (type === 'attachment') {
          return { ...c, attachments: [...c.attachments, newItem as Attachment] };
        } else if (type === 'application') {
          return { ...c, applicationDocuments: [...c.applicationDocuments, newItem as SubsidyDocument] };
        } else if (type === 'reimbursement') {
          return { ...c, reimbursementDocuments: [...c.reimbursementDocuments, newItem as SubsidyDocument] };
        }
      }
      return c;
    }));

    if (type === 'attachment') {
      setNewAttachmentName("");
    }
    toast.success("檔案上傳成功");
  };

  const handleAddLink = (caseId: number) => {
    if (!newLink.name || !newLink.url) {
      toast.error("請填寫連結名稱和網址");
      return;
    }

    const link: DocumentLink = {
      id: Date.now(),
      name: newLink.name,
      url: newLink.url
    };

    setSubsidyCases(cases => cases.map(c => 
      c.id === caseId ? { ...c, links: [...c.links, link] } : c
    ));

    setNewLink({ name: "", url: "" });
    toast.success("連結新增成功");
  };

  const handleRemoveItem = (caseId: number, itemId: number, type: 'attachment' | 'link' | 'application' | 'reimbursement') => {
    setSubsidyCases(cases => cases.map(c => {
      if (c.id === caseId) {
        if (type === 'attachment') {
          return { ...c, attachments: c.attachments.filter(a => a.id !== itemId) };
        } else if (type === 'link') {
          return { ...c, links: c.links.filter(l => l.id !== itemId) };
        } else if (type === 'application') {
          return { ...c, applicationDocuments: c.applicationDocuments.filter(d => d.id !== itemId) };
        } else if (type === 'reimbursement') {
          return { ...c, reimbursementDocuments: c.reimbursementDocuments.filter(d => d.id !== itemId) };
        }
      }
      return c;
    }));
    toast.success("項目已刪除");
  };

  return (
    <MainLayout>
      <div className="fade-in">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">補助管理</h1>
            <p className="text-muted-foreground mt-1">
              管理補助案件與相關文件
            </p>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新增補助案
          </Button>
        </div>

        {/* 統計卡片 */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-2xl font-bold">{subsidyCases.length}</p>
                <p className="text-xs text-muted-foreground">總補助案數</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-2xl font-bold">
                  {subsidyCases.filter(c => c.status === "進行中").length}
                </p>
                <p className="text-xs text-muted-foreground">進行中</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-2xl font-bold">
                  {subsidyCases.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">總補助金額</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-2xl font-bold">
                  {new Set(subsidyCases.map(c => c.organization)).size}
                </p>
                <p className="text-xs text-muted-foreground">參與機關</p>
              </div>
              <Building className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>

        {/* 新增補助案表單 */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>新增補助案</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>補助案名稱 *</Label>
                  <Input
                    value={newCase.title}
                    onChange={(e) => setNewCase({...newCase, title: e.target.value})}
                    placeholder="請輸入補助案名稱"
                  />
                </div>
                <div>
                  <Label>主辦機關 *</Label>
                  <Input
                    value={newCase.organization}
                    onChange={(e) => setNewCase({...newCase, organization: e.target.value})}
                    placeholder="請輸入主辦機關"
                  />
                </div>
                <div>
                  <Label>補助金額 *</Label>
                  <Input
                    type="number"
                    value={newCase.amount}
                    onChange={(e) => setNewCase({...newCase, amount: e.target.value})}
                    placeholder="請輸入補助金額"
                  />
                </div>
                <div>
                  <Label>申請截止日期</Label>
                  <Input
                    type="date"
                    value={newCase.deadline}
                    onChange={(e) => setNewCase({...newCase, deadline: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>補助說明</Label>
                <Textarea
                  value={newCase.description}
                  onChange={(e) => setNewCase({...newCase, description: e.target.value})}
                  placeholder="請輸入補助說明"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddCase}>新增</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  取消
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 補助案列表 */}
        <div className="grid gap-6">
          {subsidyCases.map((subsidyCase) => (
            <Card key={subsidyCase.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{subsidyCase.title}</CardTitle>
                    <p className="text-muted-foreground">{subsidyCase.organization}</p>
                  </div>
                  <Badge variant={subsidyCase.status === "進行中" ? "default" : "secondary"}>
                    {subsidyCase.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">補助金額</p>
                    <p className="font-medium">NT$ {subsidyCase.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">申請截止</p>
                    <p className="font-medium">{subsidyCase.deadline || "未設定"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">總檔案數</p>
                    <p className="font-medium">
                      {subsidyCase.attachments.length + subsidyCase.applicationDocuments.length + subsidyCase.reimbursementDocuments.length} 個檔案
                    </p>
                  </div>
                </div>
                
                <p className="text-sm mb-4">{subsidyCase.description}</p>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => setSelectedCase(subsidyCase)}>
                      <FileText className="h-4 w-4 mr-1" />
                      管理文件
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{subsidyCase.title} - 文件管理</DialogTitle>
                    </DialogHeader>
                    
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
                            onChange={(e) => handleFileUpload(e, subsidyCase.id, 'attachment')}
                          />
                        </div>
                        <div className="space-y-2">
                          {subsidyCase.attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                <File className="h-4 w-4" />
                                <span>{attachment.name}</span>
                                <Badge variant="outline">{(attachment.size / 1024).toFixed(2)} KB</Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(subsidyCase.id, attachment.id, 'attachment')}
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
                          <Button onClick={() => handleAddLink(subsidyCase.id)}>
                            <Plus className="h-4 w-4 mr-1" />
                            新增連結
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {subsidyCase.links.map((link) => (
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
                                onClick={() => handleRemoveItem(subsidyCase.id, link.id, 'link')}
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
                          onChange={(e) => handleFileUpload(e, subsidyCase.id, 'application')}
                        />
                        <div className="space-y-2">
                          {subsidyCase.applicationDocuments.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>{doc.name}</span>
                                <Badge variant="outline">{(doc.size / 1024).toFixed(2)} KB</Badge>
                                <Badge>{doc.uploadDate}</Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(subsidyCase.id, doc.id, 'application')}
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
                          onChange={(e) => handleFileUpload(e, subsidyCase.id, 'reimbursement')}
                        />
                        <div className="space-y-2">
                          {subsidyCase.reimbursementDocuments.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>{doc.name}</span>
                                <Badge variant="outline">{(doc.size / 1024).toFixed(2)} KB</Badge>
                                <Badge>{doc.uploadDate}</Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(subsidyCase.id, doc.id, 'reimbursement')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default SubsidyManagement;
