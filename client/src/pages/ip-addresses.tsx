import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IPAddress } from '@/components/ui/ip-address';
import { FeedbackMessage } from '@/components/feedback-message';
import { useLanguage } from '@/context/language-context';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useProgress } from '@/context/progress-context';
import { IP_ADDRESSES_MODULE, IP_BUILDING_LESSON } from '@shared/schema';

export default function IpAddresses() {
  const { t } = useLanguage();
  const { updateLessonProgress, isAuthenticated } = useProgress();
  
  const [showSuccess, setShowSuccess] = useState(false);
  const targetIP = "192.168.1.10";
  
  // Handle correct submission
  const handleCorrect = () => {
    setShowSuccess(true);
    
    // Update progress if user is authenticated
    if (isAuthenticated) {
      updateLessonProgress(IP_ADDRESSES_MODULE, IP_BUILDING_LESSON, true, 100);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {t('IP-адреса: составление полного адреса', 'IP Addresses: Building a Complete Address')}
          </h2>
          <div className="flex items-center">
            <span className="mr-2 font-medium">{t('Урок 1 из 5', 'Lesson 1 of 5')}</span>
            <div className="flex space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <p className="text-gray-700 mb-4">
            {t(
              'IP-адрес (IPv4) состоит из четырех октетов, разделенных точками. Каждый октет — это число от 0 до 255 (8 бит). Теперь давайте соберем полный IP-адрес из двоичных кубиков.',
              'An IP address (IPv4) consists of four octets separated by dots. Each octet is a number from 0 to 255 (8 bits). Now let\'s build a complete IP address from binary blocks.'
            )}
          </p>
        </div>

        {/* IP Address Builder */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">
            {t('Задание: составьте IP-адрес 192.168.1.10', 'Exercise: Create the IP address 192.168.1.10')}
          </h3>
          
          <IPAddress targetIP={targetIP} onCorrect={handleCorrect} />
          
          {showSuccess && (
            <FeedbackMessage
              type="success"
              title={t('Правильно!', 'Correct!')}
              message={t(
                `Вы успешно составили IP-адрес ${targetIP}. Это типичный адрес для устройств в локальной сети.`,
                `You successfully created the IP address ${targetIP}. This is a typical address for devices in a local network.`
              )}
            />
          )}
        </div>

        <div className="border-t border-gray-200 pt-4 flex justify-between">
          <Button variant="ghost" className="text-gray-500 flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('Назад', 'Back')}
          </Button>
          <Button className="bg-[#2563EB] text-white hover:bg-[#2563EB]/90 flex items-center">
            {t('Продолжить', 'Continue')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
