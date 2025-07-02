
import React from 'react';
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Pencil, Copy, Download, Printer, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActivityTableRowProps {
  activity: any;
  isSelected: boolean;
  onSelect: (id: number, checked: boolean) => void;
  onCopy: (id: number) => void;
  onDelete: (id: number) => void;
  onDownload: (id: number, format: string) => void;
  onPrint: (id: number) => void;
}

const ActivityTableRow: React.FC<ActivityTableRowProps> = ({
  activity,
  isSelected,
  onSelect,
  onCopy,
  onDelete,
  onDownload,
  onPrint
}) => {
  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(activity.id, !!checked)}
        />
      </TableCell>
      <TableCell className="font-medium">
        {activity.name}
      </TableCell>
      <TableCell>{activity.category}</TableCell>
      <TableCell>{activity.date}</TableCell>
      <TableCell>
        <Badge variant={activity.status === '已提交' ? 'default' : 'secondary'}>
          {activity.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to={`/activity/${activity.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          
          {activity.hasDocument && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" title="下載申請文件">
                    <Download className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onDownload(activity.id, 'docx')}>
                    下載 DOCX 格式
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDownload(activity.id, 'odt')}>
                    下載 ODT 格式
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDownload(activity.id, 'pdf')}>
                    下載 PDF 格式
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPrint(activity.id)}
                title="列印申請文件"
              >
                <Printer className="h-4 w-4" />
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => onCopy(activity.id)}
            title="複製活動"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(activity.id)}
            title="刪除活動"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ActivityTableRow;
