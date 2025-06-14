
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AttachmentManager from "./AttachmentManager";
import LinkManager from "./LinkManager";
import DocumentManager from "./DocumentManager";

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

interface DocumentTabsProps {
  attachments: Attachment[];
  links: DocumentLink[];
  applicationDocuments: SubsidyDocument[];
  reimbursementDocuments: SubsidyDocument[];
  newAttachmentName: string;
  newLink: { name: string; url: string };
  newApplicationDocName: string;
  newReimbursementDocName: string;
  onAttachmentNameChange: (name: string) => void;
  onLinkChange: (field: 'name' | 'url', value: string) => void;
  onApplicationDocNameChange: (name: string) => void;
  onReimbursementDocNameChange: (name: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>, type: 'attachment' | 'application' | 'reimbursement') => void;
  onAddLink: () => void;
  onRemoveItem: (itemId: number, type: 'attachment' | 'link' | 'application' | 'reimbursement') => void;
}

const DocumentTabs: React.FC<DocumentTabsProps> = ({
  attachments,
  links,
  applicationDocuments,
  reimbursementDocuments,
  newAttachmentName,
  newLink,
  newApplicationDocName,
  newReimbursementDocName,
  onAttachmentNameChange,
  onLinkChange,
  onApplicationDocNameChange,
  onReimbursementDocNameChange,
  onFileUpload,
  onAddLink,
  onRemoveItem
}) => {
  return (
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
          
          <TabsContent value="attachments">
            <AttachmentManager
              attachments={attachments}
              newAttachmentName={newAttachmentName}
              onNameChange={onAttachmentNameChange}
              onFileUpload={(e) => onFileUpload(e, 'attachment')}
              onRemove={(id) => onRemoveItem(id, 'attachment')}
            />
          </TabsContent>
          
          <TabsContent value="links">
            <LinkManager
              links={links}
              newLink={newLink}
              onNewLinkChange={onLinkChange}
              onAddLink={onAddLink}
              onRemove={(id) => onRemoveItem(id, 'link')}
            />
          </TabsContent>
          
          <TabsContent value="application">
            <DocumentManager
              documents={applicationDocuments}
              newDocumentName={newApplicationDocName}
              onNameChange={onApplicationDocNameChange}
              onFileUpload={(e) => onFileUpload(e, 'application')}
              onRemove={(id) => onRemoveItem(id, 'application')}
              placeholder="申請文件名稱"
            />
          </TabsContent>
          
          <TabsContent value="reimbursement">
            <DocumentManager
              documents={reimbursementDocuments}
              newDocumentName={newReimbursementDocName}
              onNameChange={onReimbursementDocNameChange}
              onFileUpload={(e) => onFileUpload(e, 'reimbursement')}
              onRemove={(id) => onRemoveItem(id, 'reimbursement')}
              placeholder="核銷文件名稱"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentTabs;
