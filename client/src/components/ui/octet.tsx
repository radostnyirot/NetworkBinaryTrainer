import { BinaryBlock } from './binary-block';
import { bitsToDecimal } from '@/lib/ip-utils';
import { cn } from '@/lib/utils';

const BIT_VALUES = [128, 64, 32, 16, 8, 4, 2, 1];

interface OctetProps {
  bits: number[];
  onChange?: (index: number, value: 0 | 1) => void;
  networkPart?: boolean[];
  label?: string;
  className?: string;
}

export function Octet({ 
  bits, 
  onChange, 
  networkPart = new Array(8).fill(false),
  label,
  className 
}: OctetProps) {
  const decimalValue = bitsToDecimal(bits);
  
  // Handle bit change
  const handleBitChange = (index: number, value: 0 | 1) => {
    if (onChange) {
      onChange(index, value);
    }
  };
  
  return (
    <div className={cn("bg-gray-50 p-4 rounded-lg", className)}>
      {label && (
        <div className="text-center mb-2 font-medium">{label}</div>
      )}
      <div className="flex flex-wrap justify-center gap-1 mb-2">
        {bits.map((bit, index) => (
          <BinaryBlock
            key={index}
            value={bit as 0 | 1}
            position={index}
            decimalValue={BIT_VALUES[index]}
            onChange={(value) => handleBitChange(index, value)}
            networkPart={networkPart[index]}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs font-mono px-1">
        {BIT_VALUES.map((value, index) => (
          <span key={index}>{value}</span>
        ))}
      </div>
      <div className="text-center mt-2 font-mono">{decimalValue}</div>
    </div>
  );
}
