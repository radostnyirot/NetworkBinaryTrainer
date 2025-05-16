import { useState, useCallback } from 'react';
import { bitsToDecimal } from '@/lib/ip-utils';

interface UseBitToggleResult {
  bits: number[];
  octets: number[][];
  decimalValue: number;
  ipAddress: string;
  toggleBit: (index: number) => void;
  toggleOctetBit: (octetIndex: number, bitIndex: number) => void;
  resetBits: () => void;
  resetOctets: () => void;
  setBits: (newBits: number[]) => void;
  setOctets: (newOctets: number[][]) => void;
}

export function useBitToggle(initialBits: number[] = new Array(8).fill(0)): UseBitToggleResult {
  const [bits, setBits] = useState<number[]>(initialBits);
  
  const toggleBit = useCallback((index: number) => {
    setBits(prev => {
      const newBits = [...prev];
      newBits[index] = newBits[index] === 0 ? 1 : 0;
      return newBits;
    });
  }, []);
  
  const resetBits = useCallback(() => {
    setBits(new Array(8).fill(0));
  }, []);
  
  const decimalValue = bitsToDecimal(bits);
  
  // For working with full IP addresses (4 octets)
  const [octets, setOctets] = useState<number[][]>([
    new Array(8).fill(0),
    new Array(8).fill(0),
    new Array(8).fill(0),
    new Array(8).fill(0)
  ]);
  
  const toggleOctetBit = useCallback((octetIndex: number, bitIndex: number) => {
    setOctets(prev => {
      const newOctets = [...prev.map(octet => [...octet])];
      newOctets[octetIndex][bitIndex] = newOctets[octetIndex][bitIndex] === 0 ? 1 : 0;
      return newOctets;
    });
  }, []);
  
  const resetOctets = useCallback(() => {
    setOctets([
      new Array(8).fill(0),
      new Array(8).fill(0),
      new Array(8).fill(0),
      new Array(8).fill(0)
    ]);
  }, []);
  
  // Calculate IP address in dotted decimal notation
  const ipAddress = octets.map(octet => bitsToDecimal(octet)).join('.');
  
  return {
    bits,
    octets,
    decimalValue,
    ipAddress,
    toggleBit,
    toggleOctetBit,
    resetBits,
    resetOctets,
    setBits,
    setOctets
  };
}
