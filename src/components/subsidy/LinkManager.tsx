
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, Plus, Trash2 } from "lucide-react";

interface DocumentLink {
  id: number;
  name: string;
  url: string;
}

interface LinkManagerProps {
  links: DocumentLink[];
  newLink: { name: string; url: string };
  onNewLinkChange: (field: 'name' | 'url', value: string) => void;
  onAddLink: () => void;
  onRemove: (id: number) => void;
}

const LinkManager: React.FC<LinkManagerProps> = ({
  links,
  newLink,
  onNewLinkChange,
  onAddLink,
  onRemove
}) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-2 md:grid-cols-3">
        <Input
          placeholder="連結名稱"
          value={newLink.name}
          onChange={(e) => onNewLinkChange('name', e.target.value)}
        />
        <Input
          placeholder="連結網址"
          value={newLink.url}
          onChange={(e) => onNewLinkChange('url', e.target.value)}
        />
        <Button onClick={onAddLink}>
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
              onClick={() => onRemove(link.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinkManager;
