
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, X, Calendar, FileText, Users } from "lucide-react";

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ElementType;
}

const NotificationPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      title: '新申請提交',
      message: '用戶張三提交了新的活動申請',
      time: '2分鐘前',
      read: false,
      icon: FileText
    },
    {
      id: '2',
      type: 'warning',
      title: '審核提醒',
      message: '有3個申請等待審核',
      time: '1小時前',
      read: false,
      icon: Calendar
    },
    {
      id: '3',
      type: 'success',
      title: '申請已通過',
      message: '青年藝術發展計劃已通過審核',
      time: '2小時前',
      read: true,
      icon: Check
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          通知中心
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            全部已讀
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              目前沒有通知
            </p>
          ) : (
            notifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    notification.read ? 'bg-muted/30' : 'bg-background border-primary/20'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-6 px-2 text-xs"
                          onClick={() => markAsRead(notification.id)}
                        >
                          標記為已讀
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;
