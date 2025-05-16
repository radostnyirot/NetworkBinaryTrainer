import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BinaryBlock } from '@/components/ui/binary-block';
import { FeedbackMessage } from '@/components/feedback-message';
import { useLanguage } from '@/context/language-context';
import { getBitValues, calculateDecimalValue } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useProgress } from '@/context/progress-context';
import { BINARY_BASICS_MODULE, BINARY_INTRO_LESSON } from '@shared/schema';

export default function BinaryBasics() {
  const { t } = useLanguage();
  const { updateLessonProgress, isAuthenticated } = useProgress();
  
  // Bit values (128, 64, 32, etc.)
  const bitValues = getBitValues();
  
  // Example bits
  const exampleBits = [1, 0, 1, 0, 1, 1, 0, 0]; // 172 in decimal
  
  // Exercise bits state
  const [bits, setBits] = useState<number[]>(new Array(8).fill(0));
  const [targetValue, setTargetValue] = useState<number>(250);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  
  // Calculate decimal value from bits
  const decimalValue = calculateDecimalValue(bits);
  
  // Handle bit toggle
  const toggleBit = (index: number) => {
    const newBits = [...bits];
    newBits[index] = newBits[index] === 0 ? 1 : 0;
    setBits(newBits);
    
    // Reset feedback messages when user makes changes
    setShowSuccess(false);
    setShowError(false);
  };
  
  // Reset exercise
  const resetExercise = () => {
    setBits(new Array(8).fill(0));
    setShowSuccess(false);
    setShowError(false);
  };
  
  // Check answer
  const checkAnswer = () => {
    if (decimalValue === targetValue) {
      setShowSuccess(true);
      setShowError(false);
      
      // Update progress if user is authenticated
      if (isAuthenticated) {
        updateLessonProgress(BINARY_BASICS_MODULE, BINARY_INTRO_LESSON, true, 100);
      }
    } else {
      setShowSuccess(false);
      setShowError(true);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t('Бинарные кубики: основы', 'Binary Blocks: Basics')}</h2>
          <div className="flex items-center">
            <span className="mr-2 font-medium">{t('Урок 1 из 4', 'Lesson 1 of 4')}</span>
            <div className="flex space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <p className="text-gray-700 mb-4">
            {t(
              'В двоичной системе каждый бит имеет значение 0 или 1. IP-адрес состоит из четырех октетов — групп по 8 бит. Разберемся, как эти биты преобразуются в десятичные числа, которые мы видим в IP-адресах.',
              'In binary, each bit has a value of 0 or 1. An IP address consists of four octets — groups of 8 bits. Let\'s understand how these bits are converted to the decimal numbers we see in IP addresses.'
            )}
          </p>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <p className="font-mono text-sm">
              {t(
                'Например, октет ',
                'For example, octet '
              )}
              <span className="bg-[#DC2626]/10 text-[#DC2626] px-1 rounded">10101100</span>
              {t(
                ' в десятичной системе равен ',
                ' in decimal equals '
              )}
              <span className="font-bold">172</span>
            </p>
          </div>
        </div>

        {/* Binary Blocks Explanation */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">
            {t('Значения позиций бит в октете', 'Bit Position Values in an Octet')}
          </h3>
          <div className="overflow-x-auto">
            <div className="inline-flex space-x-2 mb-4">
              {exampleBits.map((bit, index) => (
                <BinaryBlock
                  key={index}
                  value={bit as 0 | 1}
                  position={index}
                  decimalValue={bitValues[index]}
                />
              ))}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <span className="font-medium mr-2">{t('Расчет:', 'Calculation:')}</span>
              <span className="font-mono text-sm">
                128 + 0 + 32 + 0 + 8 + 4 + 0 + 0 = 172
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Exercise */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">
            {t('Упражнение: составьте октет со значением 250', 'Exercise: Create an octet with a value of 250')}
          </h3>
          <p className="text-gray-700 mb-4">
            {t(
              'Переключите биты (кликните по кубикам), чтобы получить десятичное число 250.',
              'Toggle the bits (click on the blocks) to get the decimal number 250.'
            )}
          </p>
          
          <div className="mb-6">
            <div className="inline-flex space-x-2 mb-4">
              {bits.map((bit, index) => (
                <BinaryBlock
                  key={index}
                  value={bit as 0 | 1}
                  position={index}
                  decimalValue={bitValues[index]}
                  onChange={() => toggleBit(index)}
                />
              ))}
            </div>
          </div>
          
          <div className="flex space-x-4 items-center mb-4 flex-wrap gap-4">
            <div className="bg-gray-50 p-3 rounded-lg flex items-center">
              <span className="font-medium mr-2">{t('Десятичное значение:', 'Decimal value:')}</span>
              <span className="font-mono text-lg">{decimalValue}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg flex items-center">
              <span className="font-medium mr-2">{t('Цель:', 'Target:')}</span>
              <span className="font-mono text-lg">{targetValue}</span>
            </div>
          </div>
          
          {showSuccess && (
            <FeedbackMessage
              type="success"
              title={t('Правильно!', 'Correct!')}
              message={t(
                '250 = 128 + 64 + 32 + 16 + 8 + 2. Вы успешно составили двоичное представление числа 250!',
                '250 = 128 + 64 + 32 + 16 + 8 + 2. You successfully created the binary representation of 250!'
              )}
            />
          )}
          
          {showError && (
            <FeedbackMessage
              type="error"
              title={t('Неверно', 'Incorrect')}
              message={t(
                `Ваше текущее значение: ${decimalValue}. Попробуйте еще раз, чтобы получить 250.`,
                `Your current value: ${decimalValue}. Try again to get 250.`
              )}
            />
          )}
          
          <div className="flex space-x-4">
            <Button onClick={checkAnswer}>
              {t('Проверить', 'Check')}
            </Button>
            <Button variant="outline" onClick={resetExercise}>
              {t('Сбросить', 'Reset')}
            </Button>
          </div>
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
