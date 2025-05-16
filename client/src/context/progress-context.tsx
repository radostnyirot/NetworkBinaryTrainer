import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Progress, Module, Lesson } from '@shared/schema';

interface ProgressContextType {
  progress: Progress[];
  modules: Module[];
  lessons: Record<string, Lesson[]>;
  isLoading: boolean;
  isAuthenticated: boolean;
  completedCount: number;
  totalCount: number;
  updateLessonProgress: (moduleId: string, lessonId: string, completed: boolean, score: number) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check if user is authenticated
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
    onSuccess: () => setIsAuthenticated(true),
    onError: () => setIsAuthenticated(false),
    retry: false
  });
  
  // Fetch user progress if authenticated
  const { data: progress = [], isLoading: isProgressLoading } = useQuery({
    queryKey: ['/api/progress'],
    enabled: isAuthenticated,
  });
  
  // Fetch all modules
  const { data: modules = [], isLoading: isModulesLoading } = useQuery({
    queryKey: ['/api/modules'],
  });
  
  // Store lessons by module ID
  const [lessons, setLessons] = useState<Record<string, Lesson[]>>({});
  
  // Load lessons for all modules
  useEffect(() => {
    if (modules.length > 0) {
      modules.forEach((module) => {
        queryClient.fetchQuery({
          queryKey: [`/api/lessons/${module.id}`],
          queryFn: () => 
            fetch(`/api/lessons/${module.id}`, { credentials: 'include' })
              .then(res => res.json())
        }).then((moduleLessons) => {
          setLessons(prev => ({
            ...prev,
            [module.id]: moduleLessons
          }));
        });
      });
    }
  }, [modules]);
  
  // Mutation for updating progress
  const updateProgressMutation = useMutation({
    mutationFn: (data: Omit<Progress, 'id' | 'userId'>) => 
      apiRequest('POST', '/api/progress', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
    }
  });
  
  // Calculate total and completed lessons
  const totalCount = Object.values(lessons).flat().length;
  const completedCount = progress.filter(p => p.completed).length;
  
  // Function to update lesson progress
  const updateLessonProgress = async (moduleId: string, lessonId: string, completed: boolean, score: number) => {
    if (!isAuthenticated) return;
    
    await updateProgressMutation.mutateAsync({
      moduleId,
      lessonId,
      completed,
      score
    });
  };
  
  return (
    <ProgressContext.Provider 
      value={{ 
        progress: progress as Progress[], 
        modules: modules as Module[], 
        lessons,
        isLoading: isProgressLoading || isModulesLoading,
        isAuthenticated,
        completedCount,
        totalCount,
        updateLessonProgress
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
