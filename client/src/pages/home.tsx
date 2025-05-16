import { CourseIntroduction } from '@/components/course-introduction';
import { ProgressTracker } from '@/components/progress-tracker';
import { useProgress } from '@/context/progress-context';

export default function Home() {
  const { isAuthenticated } = useProgress();
  
  return (
    <div className="container mx-auto px-4 py-8">
      {isAuthenticated && <ProgressTracker />}
      <CourseIntroduction />
    </div>
  );
}
