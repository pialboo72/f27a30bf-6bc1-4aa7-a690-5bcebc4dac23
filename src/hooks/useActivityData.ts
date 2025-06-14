
import { useState, useEffect } from 'react';

export const useActivityData = (id: string | undefined, isNew: boolean) => {
  const [activityData, setActivityData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadActivityData = () => {
      if (!isNew && id) {
        const activities = JSON.parse(localStorage.getItem('activities') || '[]');
        const activity = activities.find((a: any) => a.id === parseInt(id));
        if (activity) {
          console.log("載入活動資料", activity);
          setActivityData(activity);
        }
      } else if (isNew) {
        setActivityData(null);
      }
      setIsLoading(false);
    };

    loadActivityData();
  }, [id, isNew]);

  return { activityData, setActivityData, isLoading };
};
