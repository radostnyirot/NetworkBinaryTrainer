import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SubnetMask } from '@/components/ui/subnet-mask';
import { useLanguage } from '@/context/language-context';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useProgress } from '@/context/progress-context';
import { SUBNET_MASKS_MODULE, SUBNET_CALCULATION_LESSON } from '@shared/schema';

export default function SubnetMasks() {
  const { t } = useLanguage();
  const { updateLessonProgress, isAuthenticated } = useProgress();
  
  // Target CIDR prefix
  const targetPrefix = 28; // /28
  
  // Handle correct submission
  const handleCorrect = () => {
    // Update progress if user is authenticated
    if (isAuthenticated) {
      updateLessonProgress(SUBNET_MASKS_MODULE, SUBNET_CALCULATION_LESSON, true, 100);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {t('Маски подсети: сетевая и хостовая часть', 'Subnet Masks: Network and Host Portions')}
          </h2>
          <div className="flex items-center">
            <span className="mr-2 font-medium">{t('Урок 2 из 4', 'Lesson 2 of 4')}</span>
            <div className="flex space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
              <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <p className="text-gray-700 mb-4">
            {t(
              'Маска подсети определяет, какая часть IP-адреса относится к сети (1 в двоичном представлении), а какая — к хостам (0 в двоичном представлении). В маске все биты сетевой части устанавливаются в 1, а все биты хостовой части — в 0.',
              'A subnet mask defines which part of an IP address refers to the network (1 in binary) and which part refers to hosts (0 in binary). In the mask, all network portion bits are set to 1, and all host portion bits are set to 0.'
            )}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">
                {t('Сетевая часть (красные биты)', 'Network portion (red bits)')}
              </h4>
              <p className="text-sm text-gray-600">
                {t(
                  'Определяет, к какой сети принадлежит адрес. Все устройства в одной сети имеют одинаковую сетевую часть.',
                  'Defines which network the address belongs to. All devices in the same network have identical network portions.'
                )}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">
                {t('Хостовая часть (синие биты)', 'Host portion (blue bits)')}
              </h4>
              <p className="text-sm text-gray-600">
                {t(
                  'Определяет конкретное устройство в сети. Должна быть уникальной для каждого устройства в пределах одной сети.',
                  'Identifies a specific device in the network. Must be unique for each device within the same network.'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Subnet Mask Builder */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">
            {t(
              `Задание: постройте маску подсети /${targetPrefix} (255.255.255.240)`,
              `Exercise: Create the subnet mask /${targetPrefix} (255.255.255.240)`
            )}
          </h3>
          <p className="text-gray-700 mb-4">
            {t(
              `Маска /${targetPrefix} означает, что первые ${targetPrefix} бит должны быть установлены в 1 (красные кубики), а остальные — в 0 (синие кубики). Определите количество доступных хостов в такой сети.`,
              `A /${targetPrefix} mask means that the first ${targetPrefix} bits should be set to 1 (red blocks), and the rest to 0 (blue blocks). Determine the number of available hosts in such a network.`
            )}
          </p>
          
          <SubnetMask targetPrefix={targetPrefix} onCorrect={handleCorrect} />
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
