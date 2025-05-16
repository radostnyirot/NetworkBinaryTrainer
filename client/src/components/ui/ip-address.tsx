import { Octet } from './octet';
import { useEffect } from 'react';
import { useBitToggle } from '@/hooks/use-bit-toggle';
import { Button } from './button';
import { useLanguage } from '@/context/language-context';
import { decimalToBits } from '@/lib/ip-utils';

interface IPAddressProps {
  targetIP?: string;
  onCorrect?: () => void;
}

export function IPAddress({ targetIP = "192.168.1.10", onCorrect }: IPAddressProps) {
  const { t } = useLanguage();
  const { octets, ipAddress, toggleOctetBit, resetOctets, setOctets } = useBitToggle();
  
  // For handling target IP loading
  useEffect(() => {
    if (targetIP) {
      // Clear for new target
      resetOctets();
    }
  }, [targetIP, resetOctets]);
  
  // Convert target IP to bits for comparison
  const targetIPBits = targetIP.split('.').map(octet => decimalToBits(parseInt(octet)));
  
  // Handle checking the answer
  const checkAnswer = () => {
    if (ipAddress === targetIP && onCorrect) {
      onCorrect();
    }
  };
  
  const handleBitChange = (octetIndex: number, bitIndex: number, value: 0 | 1) => {
    toggleOctetBit(octetIndex, bitIndex);
  };
  
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {octets.map((bits, octetIndex) => (
          <Octet
            key={octetIndex}
            bits={bits}
            label={`${t('Октет', 'Octet')} ${octetIndex + 1}`}
            onChange={(bitIndex, value) => handleBitChange(octetIndex, bitIndex, value)}
          />
        ))}
      </div>
      
      <div className="flex items-center mb-6 flex-wrap gap-4">
        <div className="bg-gray-50 px-4 py-3 rounded-lg flex items-center">
          <span className="font-medium mr-2">{t('Ваш IP-адрес:', 'Your IP address:')}</span>
          <span className="font-mono text-lg">{ipAddress}</span>
        </div>
        <div className="bg-gray-50 px-4 py-3 rounded-lg flex items-center">
          <span className="font-medium mr-2">{t('Требуемый IP:', 'Target IP:')}</span>
          <span className="font-mono text-lg">{targetIP}</span>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <Button onClick={checkAnswer}>
          {t('Проверить', 'Check')}
        </Button>
        <Button variant="outline" onClick={resetOctets}>
          {t('Сбросить', 'Reset')}
        </Button>
      </div>
    </div>
  );
}
