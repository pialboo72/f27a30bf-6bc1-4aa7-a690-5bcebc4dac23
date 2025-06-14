
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import SubsidyBasicInfoForm from "@/components/subsidy/SubsidyBasicInfoForm";
import DocumentTabs from "@/components/subsidy/DocumentTabs";

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
  originalName: string;
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
    startDate: "",
    deadline: "",
    description: "",
    category: "",
    eligibleApplicants: "",
    subsidyScope: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    reviewCriteria: "",
    status: "籌備中"
  });

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [links, setLinks] = useState<DocumentLink[]>([]);
  const [applicationDocuments, setApplicationDocuments] = useState<SubsidyDocument[]>([]);
  const [reimbursementDocuments, setReimbursementDocuments] = useState<SubsidyDocument[]>([]);

  const [newAttachmentName, setNewAttachmentName] = useState("");
  const [newLink, setNewLink] = useState({ name: "", url: "" });
  const [newApplicationDocName, setNewApplicationDocName] = useState("");
  const [newReimbursementDocName, setNewReimbursementDocName] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setSubsidyData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'attachment' | 'application' | 'reimbursement') => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    let customName = file.name;
    if (type === 'attachment' && newAttachmentName) {
      customName = newAttachmentName;
    } else if (type === 'application' && newApplicationDocName) {
      customName = newApplicationDocName;
    } else if (type === 'reimbursement' && newReimbursementDocName) {
      customName = newReimbursementDocName;
    }

    const newItem = {
      id: Date.now(),
      name: customName,
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
      setNewApplicationDocName("");
    } else if (type === 'reimbursement') {
      setReimbursementDocuments(prev => [...prev, newItem as SubsidyDocument]);
      setNewReimbursementDocName("");
    }

    event.target.value = '';
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

    toast.success("補助案新增成功");
    navigate("/admin/subsidies");
  };

  const handleLinkChange = (field: 'name' | 'url', value: string) => {
    setNewLink(prev => ({ ...prev, [field]: value }));
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
          <SubsidyBasicInfoForm
            subsidyData={subsidyData}
            onInputChange={handleInputChange}
          />

          <DocumentTabs
            attachments={attachments}
            links={links}
            applicationDocuments={applicationDocuments}
            reimbursementDocuments={reimbursementDocuments}
            newAttachmentName={newAttachmentName}
            newLink={newLink}
            newApplicationDocName={newApplicationDocName}
            newReimbursementDocName={newReimbursementDocName}
            onAttachmentNameChange={setNewAttachmentName}
            onLinkChange={handleLinkChange}
            onApplicationDocNameChange={setNewApplicationDocName}
            onReimbursementDocNameChange={setNewReimbursementDocName}
            onFileUpload={handleFileUpload}
            onAddLink={handleAddLink}
            onRemoveItem={handleRemoveItem}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default SubsidyCreate;
