import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, Link } from 'wouter';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';

const loginSchema = z.object({
  username: z.string().min(1, {
    message: "Введите имя пользователя или email"
  }),
  password: z.string().min(1, {
    message: "Введите пароль"
  })
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await apiRequest('POST', '/api/login', data);
      
      // Обновляем данные о пользователе
      await queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
      toast({
        title: t('Вход выполнен!', 'Login successful!'),
        description: t(
          'Вы успешно вошли в систему.',
          'You have successfully logged in.'
        ),
      });
      
      setLocation('/');
    } catch (error: any) {
      toast({
        title: t('Ошибка входа', 'Login error'),
        description: error.message || t(
          'Произошла ошибка при входе. Пожалуйста, проверьте ваши учетные данные.',
          'An error occurred during login. Please check your credentials.'
        ),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-6">
          {t('Вход в систему', 'Login')}
        </h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Имя пользователя или Email', 'Username or Email')}</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Пароль', 'Password')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" autoComplete="current-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('Вход...', 'Logging in...') : t('Войти', 'Log in')}
            </Button>
          </form>
        </Form>
        
        <div className="mt-4 text-center text-sm">
          {t('Нет аккаунта?', 'Don\'t have an account?')}{' '}
          <Link href="/register">
            <a className="text-[#2563EB] hover:underline">
              {t('Зарегистрироваться', 'Register')}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}