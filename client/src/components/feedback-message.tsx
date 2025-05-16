import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface FeedbackMessageProps {
  type: 'success' | 'error' | 'warning';
  title: string;
  message: string;
  className?: string;
}

export function FeedbackMessage({ type, title, message, className }: FeedbackMessageProps) {
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-[#10B981]/10 border-[#10B981]/30';
      case 'error':
        return 'bg-[#F97316]/10 border-[#F97316]/30';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/30';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };
  
  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-[#10B981]';
      case 'error':
        return 'text-[#F97316]';
      case 'warning':
        return 'text-amber-500';
      default:
        return 'text-gray-700';
    }
  };
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-xl" />;
      case 'error':
      case 'warning':
        return <AlertTriangle className="text-xl" />;
      default:
        return null;
    }
  };
  
  return (
    <div className={cn(`border p-4 rounded-lg mb-8 ${getBackgroundColor()}`, className)}>
      <div className="flex items-start">
        <div className={`mr-3 ${getTextColor()}`}>
          {getIcon()}
        </div>
        <div>
          <h4 className={`font-medium ${getTextColor()} mb-1`}>{title}</h4>
          <p className="text-gray-700 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}
