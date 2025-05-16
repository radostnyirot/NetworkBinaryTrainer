import { useState, useEffect } from 'react';
import { Octet } from './octet';
import { Button } from './button';
import { useLanguage } from '@/context/language-context';
import { useBitToggle } from '@/hooks/use-bit-toggle';
import { 
  maskToCidr, 
  getAvailableHosts, 
  isValidSubnetMask,
  maskToDecimal
} from '@/lib/ip-utils';
import { FeedbackMessage } from '../feedback-message';

interface SubnetMaskProps {
  targetPrefix?: number;
  onCorrect?: () => void;
}

export function SubnetMask({ targetPrefix = 28, onCorrect }: SubnetMaskProps) {
  const { t } = useLanguage();
  const { octets, toggleOctetBit, resetOctets, setOctets } = useBitToggle();
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Calculate subnet properties
  const cidrPrefix = maskToCidr(octets);
  const hostsCount = getAvailableHosts(cidrPrefix);
  const subnetMask = maskToDecimal(octets);
  
  // Generate network part markers for visualization
  const getNetworkBits = () => {
    const networkBits: boolean[][] = [];
    
    for (let i = 0; i < 4; i++) {
      networkBits[i] = [];
      for (let j = 0; j < 8; j++) {
        // For subnet masks, 1s are network part, 0s are host part
        networkBits[i][j] = octets[i][j] === 0;
      }
    }
    
    return networkBits;
  };
  
  // Set initial values for subnet mask
  useEffect(() => {
    resetOctets();
    // This is simplified - normally we would create a proper subnet mask from the prefix
    if (targetPrefix >= 24) {
      setOctets([
        [1, 1, 1, 1, 1, 1, 1, 1], // 255
        [1, 1, 1, 1, 1, 1, 1, 1], // 255
        [1, 1, 1, 1, 1, 1, 1, 1], // 255
        new Array(8).fill(0)  // Set the last octet based on prefix
      ]);
    }
  }, [targetPrefix, resetOctets, setOctets]);
  
  // Handle bit change and make sure it's a valid subnet mask
  const handleBitChange = (octetIndex: number, bitIndex: number, value: 0 | 1) => {
    toggleOctetBit(octetIndex, bitIndex);
  };
  
  // Check if the subnet mask is correct
  const checkSubnetMask = () => {
    setShowSuccess(false);
    setShowError(false);
    
    // Check if it's a valid subnet mask (continuous 1s followed by continuous 0s)
    if (!isValidSubnetMask(octets)) {
      setErrorMessage(t(
        'Маска подсети должна состоять из непрерывной серии 1, за которой следует непрерывная серия 0.',
        'Subnet mask must consist of a continuous series of 1s followed by a continuous series of 0s.'
      ));
      setShowError(true);
      return;
    }
    
    // Check if the prefix matches the target
    if (cidrPrefix !== targetPrefix) {
      setErrorMessage(t(
        `Для маски /${targetPrefix} должно быть ровно ${targetPrefix} бит со значением 1.`,
        `For a /${targetPrefix} mask, there should be exactly ${targetPrefix} bits set to 1.`
      ));
      setShowError(true);
      return;
    }
    
    // Success!
    setShowSuccess(true);
    if (onCorrect) {
      onCorrect();
    }
  };
  
  // Get network and host bits count
  const networkBits = cidrPrefix;
  const hostBits = 32 - cidrPrefix;
  
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {octets.map((bits, octetIndex) => (
          <Octet
            key={octetIndex}
            bits={bits}
            label={`${t('Октет', 'Octet')} ${octetIndex + 1}`}
            onChange={(bitIndex, value) => handleBitChange(octetIndex, bitIndex, value)}
            networkPart={getNetworkBits()[octetIndex]}
          />
        ))}
      </div>
      
      <div className="flex items-center space-x-4 mb-6 flex-wrap gap-4">
        <div className="bg-gray-50 px-4 py-3 rounded-lg flex items-center">
          <span className="font-medium mr-2">{t('Ваша маска:', 'Your mask:')}</span>
          <span className="font-mono text-lg">{subnetMask}</span>
        </div>
        <div className="bg-gray-50 px-4 py-3 rounded-lg flex items-center">
          <span className="font-medium mr-2">{t('Префикс:', 'Prefix:')}</span>
          <span className="font-mono text-lg">/{cidrPrefix}</span>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold mb-2">{t('Расчёт количества хостов', 'Host Count Calculation')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-700 mb-2">
              {t('Количество хостовых бит (синих):', 'Number of host bits (blue):')} <span className="font-mono">{hostBits}</span>
            </p>
            <p className="text-sm text-gray-700">
              {t('Формула:', 'Formula:')} 2<sup>{t('хостовые биты', 'host bits')}</sup> - 2 = <span className="font-mono">2<sup>{hostBits}</sup> - 2</span> = <span className="font-mono">{hostsCount}</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              {t(
                'Минус 2 адреса (сеть и широковещательный), которые нельзя назначить хостам',
                'Minus 2 addresses (network and broadcast) that cannot be assigned to hosts'
              )}
            </p>
          </div>
        </div>
      </div>
      
      {showSuccess && (
        <FeedbackMessage 
          type="success"
          title={t('Правильно!', 'Correct!')}
          message={t(
            `Вы корректно создали маску подсети /${targetPrefix} (${subnetMask}) и правильно определили, что в такой сети может быть ${hostsCount} доступных хостов.`,
            `You've correctly created a /${targetPrefix} subnet mask (${subnetMask}) and correctly determined that such a network can have ${hostsCount} available hosts.`
          )}
        />
      )}
      
      {showError && (
        <FeedbackMessage 
          type="error"
          title={t('Ошибка в маске подсети', 'Subnet Mask Error')}
          message={errorMessage}
        />
      )}
      
      <div className="flex space-x-4">
        <Button onClick={checkSubnetMask}>
          {t('Проверить', 'Check')}
        </Button>
        <Button variant="outline" onClick={resetOctets}>
          {t('Сбросить', 'Reset')}
        </Button>
      </div>
    </div>
  );
}
