
import React from 'react';
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  text = "載入中..."
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-primary", 
        sizeClasses[size], 
        className
      )} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
