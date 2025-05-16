import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import { ArrowRight, CodeSquare, Globe, LayoutDashboard } from 'lucide-react';
import { Link } from 'wouter';

export function CourseIntroduction() {
  const { t } = useLanguage();

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">
            {t('Освойте бинарные основы сетей', 'Master the Binary Foundations of Networks')}
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            {t(
              'NetBits поможет вам понять двоичное представление IP-адресов, масок подсетей и основы проектирования сетей через интерактивные задания с визуальными элементами.',
              'NetBits will help you understand the binary representation of IP addresses, subnet masks, and network design fundamentals through interactive exercises with visual elements.'
            )}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 mb-2">
                <CodeSquare className="text-[#2563EB] h-5 w-5" />
                <h3 className="font-semibold">{t('Бинарные основы', 'Binary Foundations')}</h3>
              </div>
              <p className="text-gray-600 text-sm">
                {t(
                  'Изучите, как двоичные биты формируют десятичные числа',
                  'Learn how binary bits form decimal numbers'
                )}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="text-[#2563EB] h-5 w-5" />
                <h3 className="font-semibold">{t('IP-адресация', 'IP Addressing')}</h3>
              </div>
              <p className="text-gray-600 text-sm">
                {t(
                  'Научитесь работать с IP-адресами на уровне бит',
                  'Learn to work with IP addresses at the bit level'
                )}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 mb-2">
                <LayoutDashboard className="text-[#2563EB] h-5 w-5" />
                <h3 className="font-semibold">{t('Маски подсети', 'Subnet Masks')}</h3>
              </div>
              <p className="text-gray-600 text-sm">
                {t(
                  'Определяйте сетевую и хостовую часть по маске',
                  'Identify network and host portions using subnet masks'
                )}
              </p>
            </div>
          </div>
          <Link href="/binary-basics">
            <Button className="bg-[#2563EB] text-white hover:bg-[#2563EB]/90 flex items-center">
              {t('Начать обучение', 'Start Learning')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="lg:col-span-1">
          <img 
            src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
            alt={t('Визуализация бинарного кода сети', 'Visualization of network binary code')}
            className="rounded-xl shadow-md w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
