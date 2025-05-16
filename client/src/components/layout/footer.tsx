import { Link } from 'wouter';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';

export default function Footer() {
  const { language, setLanguage, t } = useLanguage();
  
  const navigation = {
    learning: [
      { name: t('Бинарные кубики', 'Binary Blocks'), href: '/binary-basics' },
      { name: t('IP-адреса', 'IP Addresses'), href: '/ip-addresses' },
      { name: t('Маски подсети', 'Subnet Masks'), href: '/subnet-masks' },
      { name: t('Проектирование сетей', 'Network Design'), href: '/network-design' },
    ],
    resources: [
      { name: t('Руководство', 'Guide'), href: '/guide' },
      { name: t('Глоссарий', 'Glossary'), href: '/glossary' },
      { name: t('Калькуляторы', 'Calculators'), href: '/calculators' },
      { name: t('FAQ', 'FAQ'), href: '/faq' },
    ],
  };
  
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-[#DC2626] rounded"></div>
                <div className="w-4 h-4 bg-[#9CA3AF] rounded"></div>
                <div className="w-4 h-4 bg-[#2563EB] rounded"></div>
              </div>
              <h3 className="font-bold">NetBits</h3>
            </div>
            <p className="text-gray-600 text-sm">
              {t(
                'Интерактивное обучение основам IP-адресации и сетевого проектирования',
                'Interactive learning of IP addressing and network design fundamentals'
              )}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{t('Обучение', 'Learning')}</h3>
            <ul className="space-y-2 text-sm">
              {navigation.learning.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>
                    <a className="text-gray-600 hover:text-[#2563EB]">{item.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{t('Ресурсы', 'Resources')}</h3>
            <ul className="space-y-2 text-sm">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>
                    <a className="text-gray-600 hover:text-[#2563EB]">{item.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{t('Язык', 'Language')}</h3>
            <div className="flex space-x-2 mb-4">
              <Button
                variant={language === 'ru' ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('ru')}
                className={language === 'ru' ? 'border-[#2563EB] text-[#2563EB]' : ''}
              >
                Русский
              </Button>
              <Button
                variant={language === 'en' ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('en')}
                className={language === 'en' ? 'border-[#2563EB] text-[#2563EB]' : ''}
              >
                English
              </Button>
            </div>
            <p className="text-gray-600 text-sm">
              {t('Версия:', 'Version:')} 1.0.2
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} NetBits. {t('Все права защищены.', 'All rights reserved.')}
        </div>
      </div>
    </footer>
  );
}
