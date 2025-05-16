import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/context/language-context';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocation, Link } from 'wouter';
import { Award, Download, ArrowLeft } from 'lucide-react';

export default function Certificate() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [generatingCertificate, setGeneratingCertificate] = useState(false);
  const [, setLocation] = useLocation();

  // Запрос статистики прогресса
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/progress/stats'],
    onError: () => {
      setLocation('/login');
    }
  });

  // Запрос сертификата
  const { data: certificate, isLoading: certificateLoading, refetch } = useQuery({
    queryKey: ['/api/certificate'],
    retry: false,
    onError: () => {} // Игнорируем ошибку, т.к. сертификата может не быть
  });

  // Генерация сертификата
  const generateCertificate = async () => {
    if (!stats || stats.completedLessons < stats.totalLessons) {
      toast({
        title: t('Недостаточно завершенных уроков', 'Not enough completed lessons'),
        description: t(
          `Завершите все ${stats?.totalLessons} уроков, чтобы получить сертификат.`,
          `Complete all ${stats?.totalLessons} lessons to get a certificate.`
        ),
        variant: 'destructive'
      });
      return;
    }

    setGeneratingCertificate(true);
    try {
      await apiRequest('POST', '/api/certificate');
      await refetch();
      toast({
        title: t('Сертификат создан!', 'Certificate created!'),
        description: t(
          'Ваш сертификат успешно создан',
          'Your certificate has been successfully created'
        )
      });
    } catch (error: any) {
      const errorMessage = error.certificate 
        ? t('Сертификат уже существует', 'Certificate already exists')
        : error.message || t('Ошибка при создании сертификата', 'Error creating certificate');
      
      toast({
        title: t('Не удалось создать сертификат', 'Failed to create certificate'),
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setGeneratingCertificate(false);
    }
  };

  // Форматирование даты для отображения
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (statsLoading || certificateLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="w-16 h-16 border-4 border-t-[#2563EB] border-[#E5E7EB] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-4 flex items-center text-gray-600" 
        onClick={() => setLocation('/')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('Вернуться на главную', 'Back to home')}
      </Button>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {t('Ваш сертификат', 'Your Certificate')}
          </h1>
          <Award className="h-10 w-10 text-[#2563EB]" />
        </div>

        {certificate ? (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
            <div className="mb-8 text-center">
              <div className="inline-block p-2 bg-[#2563EB]/10 rounded-full mb-4">
                <Award className="h-16 w-16 text-[#2563EB]" />
              </div>
              <h2 className="text-xl font-bold mb-1">{t('Сертификат о прохождении курса', 'Course Completion Certificate')}</h2>
              <p className="text-gray-600">{t('«Основы сетевой адресации»', '"Network Addressing Fundamentals"')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{t('Номер сертификата', 'Certificate Number')}</h3>
                <p className="font-mono">{certificate.certificateNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{t('Дата выдачи', 'Issue Date')}</h3>
                <p>{formatDate(certificate.issueDate)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{t('Общий балл', 'Total Score')}</h3>
                <p className="text-lg font-semibold">{certificate.totalScore} / 100</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{t('Дата завершения курса', 'Course Completion Date')}</h3>
                <p>{formatDate(certificate.completionDate)}</p>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Button className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                {t('Скачать PDF', 'Download PDF')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
            <div className="text-center py-8">
              <div className="inline-block p-3 bg-gray-200 rounded-full mb-4">
                <Award className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-medium mb-2">{t('У вас пока нет сертификата', 'You don\'t have a certificate yet')}</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {t(
                  'Завершите все уроки, чтобы получить сертификат о прохождении курса.',
                  'Complete all lessons to get a course completion certificate.'
                )}
              </p>
              
              <div className="bg-white p-4 rounded-lg shadow-sm max-w-md mx-auto mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">{t('Завершено:', 'Completed:')}</span>
                  <span className="font-semibold">{stats?.completedLessons || 0} / {stats?.totalLessons || 0}</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#2563EB] rounded-full" 
                    style={{ width: `${stats ? (stats.completedLessons / stats.totalLessons) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <Button 
                onClick={generateCertificate} 
                disabled={generatingCertificate || (stats?.completedLessons < stats?.totalLessons)}
                className="flex items-center mx-auto"
              >
                <Award className="mr-2 h-4 w-4" />
                {generatingCertificate 
                  ? t('Создание...', 'Generating...') 
                  : t('Получить сертификат', 'Get Certificate')}
              </Button>
            </div>
          </div>
        )}

        <div className="bg-[#2563EB]/5 p-6 rounded-lg border border-[#2563EB]/20">
          <h3 className="font-semibold mb-3">{t('О сертификате', 'About the Certificate')}</h3>
          <p className="text-gray-700 mb-4">
            {t(
              'Этот сертификат подтверждает, что вы успешно завершили курс по основам сетевой адресации, включая бинарные вычисления, IP-адресацию и маски подсети. Вы можете использовать этот сертификат, чтобы продемонстрировать свои навыки.',
              'This certificate confirms that you have successfully completed the network addressing fundamentals course, including binary calculations, IP addressing, and subnet masks. You can use this certificate to demonstrate your skills.'
            )}
          </p>
          
          <h3 className="font-semibold mb-3">{t('Навыки, подтверждаемые сертификатом', 'Skills Validated by This Certificate')}</h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>{t('Понимание двоичной системы счисления', 'Understanding of the binary number system')}</li>
            <li>{t('Работа с IP-адресами и их структурой', 'Working with IP addresses and their structure')}</li>
            <li>{t('Маски подсети и CIDR-нотация', 'Subnet masks and CIDR notation')}</li>
            <li>{t('Расчет количества хостов в сети', 'Calculating the number of hosts in a network')}</li>
            <li>{t('Основы проектирования сетей', 'Network design fundamentals')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}