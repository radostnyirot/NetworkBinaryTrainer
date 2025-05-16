import { useProgress } from '@/context/progress-context';
import { useLanguage } from '@/context/language-context';

export function ProgressTracker() {
  const { completedCount, totalCount, modules } = useProgress();
  const { t } = useLanguage();
  
  // Calculate progress percentage
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{t('Ваш прогресс', 'Your Progress')}</h2>
        <span className="text-[#2563EB] font-medium">
          {completedCount} {t('из', 'of')} {totalCount} {t('заданий выполнено', 'exercises completed')}
        </span>
      </div>
      <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-[#2563EB] h-full rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        {modules.map((module) => (
          <span key={module.id}>{module.nameRu}</span>
        ))}
      </div>
    </div>
  );
}
