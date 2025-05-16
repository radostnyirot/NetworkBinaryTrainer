import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Menu, HelpCircle, ChevronDown } from 'lucide-react';

export default function Header() {
  const [location] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navigation = [
    { name: t('Бинарные кубики', 'Binary Blocks'), href: '/binary-basics' },
    { name: t('IP-адреса', 'IP Addresses'), href: '/ip-addresses' },
    { name: t('Маски подсети', 'Subnet Masks'), href: '/subnet-masks' },
    { name: t('Проектирование', 'Network Design'), href: '/network-design' },
  ];
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <a className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-6 h-6 bg-[#DC2626] rounded"></div>
                <div className="w-6 h-6 bg-[#9CA3AF] rounded"></div>
                <div className="w-6 h-6 bg-[#2563EB] rounded"></div>
              </div>
              <h1 className="text-xl font-bold">NetBits</h1>
            </a>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={`font-medium ${
                  location === item.href ? 'text-[#2563EB]' : 'text-gray-600 hover:text-[#2563EB]'
                }`}
              >
                {item.name}
              </a>
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" aria-label={t('Помощь', 'Help')}>
            <HelpCircle className="h-5 w-5 text-gray-600 hover:text-[#2563EB]" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center space-x-1 text-gray-600 hover:text-[#2563EB]"
              >
                <span>{language.toUpperCase()}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('ru')}>
                Русский
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="bg-[#2563EB] text-white hover:bg-[#2563EB]/90">
            {t('Войти', 'Sign In')}
          </Button>
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a
                      className={`text-lg font-medium ${
                        location === item.href ? 'text-[#2563EB]' : 'text-gray-600'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
