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

const registerSchema = z.object({
  username: z.string().min(3, {
    message: "Имя пользователя должно содержать не менее 3 символов"
  }),
  email: z.string().email({
    message: "Введите корректный email адрес"
  }),
  password: z.string().min(6, {
    message: "Пароль должен содержать не менее 6 символов"
  }),
  passwordConfirm: z.string()
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Пароли не совпадают",
  path: ["passwordConfirm"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: ""
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/register', data);
      
      toast({
        title: t('Регистрация успешна!', 'Registration successful!'),
        description: t(
          'Вы успешно зарегистрировались и авторизовались.',
          'You have successfully registered and logged in.'
        ),
      });
      
      setLocation('/');
    } catch (error: any) {
      toast({
        title: t('Ошибка регистрации', 'Registration error'),
        description: error.message || t(
          'Произошла ошибка при регистрации. Пожалуйста, попробуйте еще раз.',
          'An error occurred during registration. Please try again.'
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
          {t('Регистрация', 'Registration')}
        </h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Имя пользователя', 'Username')}</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Email', 'Email')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" autoComplete="email" />
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
                    <Input {...field} type="password" autoComplete="new-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Подтвердите пароль', 'Confirm Password')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" autoComplete="new-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading 
                ? t('Регистрация...', 'Registering...') 
                : t('Зарегистрироваться', 'Register')}
            </Button>
          </form>
        </Form>
        
        <div className="mt-4 text-center text-sm">
          {t('Уже есть аккаунт?', 'Already have an account?')}{' '}
          <Link href="/login">
            <a className="text-[#2563EB] hover:underline">
              {t('Войти', 'Log in')}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}