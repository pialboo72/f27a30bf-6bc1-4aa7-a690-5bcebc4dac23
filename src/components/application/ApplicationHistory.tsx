
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface HistoryEntry {
  id: number;
  action: string;
  description: string;
  user: string;
  timestamp: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

interface ApplicationHistoryProps {
  applicationId: string;
}

const ApplicationHistory: React.FC<ApplicationHistoryProps> = ({ applicationId }) => {
  // 模擬歷史記錄數據
  const historyEntries: HistoryEntry[] = [
    {
      id: 1,
      action: '申請提交',
      description: '申請者已提交補助申請',
      user: '申請者',
      timestamp: '2024-01-15 10:30:00',
      status: 'info'
    },
    {
      id: 2,
      action: '初步審核',
      description: '承辦人員開始審核申請資料',
      user: '王小明',
      timestamp: '2024-01-16 09:15:00',
      status: 'info'
    },
    {
      id: 3,
      action: '補件要求',
      description: '需要補充活動詳細企劃書',
      user: '王小明',
      timestamp: '2024-01-18 14:20:00',
      status: 'warning'
    },
    {
      id: 4,
      action: '補件完成',
      description: '申請者已補充所需文件',
      user: '申請者',
      timestamp: '2024-01-20 11:45:00',
      status: 'success'
    },
    {
      id: 5,
      action: '審核通過',
      description: '申請已通過審核，等待主管核准',
      user: '王小明',
      timestamp: '2024-01-22 16:30:00',
      status: 'success'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          申請歷史記錄
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {historyEntries.map((entry, index) => (
            <div key={entry.id} className="relative">
              {index < historyEntries.length - 1 && (
                <div className="absolute left-6 top-12 h-8 w-px bg-gray-200" />
              )}
              
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  {getStatusIcon(entry.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{entry.action}</h4>
                      <Badge className={getStatusColor(entry.status)}>
                        {entry.status === 'success' ? '完成' :
                         entry.status === 'warning' ? '待處理' :
                         entry.status === 'error' ? '錯誤' : '進行中'}
                      </Badge>
                    </div>
                    <time className="text-sm text-gray-500">{entry.timestamp}</time>
                  </div>
                  
                  <p className="text-gray-600 mt-1">{entry.description}</p>
                  
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <User className="h-3 w-3 mr-1" />
                    {entry.user}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationHistory;
