
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, XCircle, FileText } from 'lucide-react';

export type ApplicationStatusType = 'draft' | 'submitted' | 'reviewing' | 'approved' | 'rejected';

interface ApplicationStatusProps {
  status: ApplicationStatusType;
  showIcon?: boolean;
}

const ApplicationStatus: React.FC<ApplicationStatusProps> = ({ 
  status, 
  showIcon = true 
}) => {
  const statusConfig = {
    draft: {
      label: '草稿',
      icon: FileText,
      className: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    },
    submitted: {
      label: '已提交',
      icon: Clock,
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
    },
    reviewing: {
      label: '審核中',
      icon: AlertCircle,
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
    },
    approved: {
      label: '已批准',
      icon: CheckCircle,
      className: 'bg-green-100 text-green-800 hover:bg-green-200'
    },
    rejected: {
      label: '已拒絕',
      icon: XCircle,
      className: 'bg-red-100 text-red-800 hover:bg-red-200'
    }
  };

  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      {showIcon && <IconComponent className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  );
};

export default ApplicationStatus;
