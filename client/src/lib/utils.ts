import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateDecimalValue(bits: number[]): number {
  return bits.reduce((acc, bit, index) => {
    return acc + (bit * Math.pow(2, 7 - index));
  }, 0);
}

export function bitsToDecimal(bits: number[]): number {
  return bits.reduce((acc, bit, index) => {
    return acc + (bit * Math.pow(2, 7 - index));
  }, 0);
}

export function decimalToBits(decimal: number): number[] {
  const bits = new Array(8).fill(0);
  let value = decimal;
  
  for (let i = 7; i >= 0; i--) {
    const bitValue = Math.pow(2, i);
    if (value >= bitValue) {
      bits[7 - i] = 1;
      value -= bitValue;
    }
  }
  
  return bits;
}

export function calculateAvailableHosts(cidr: number): number {
  const hostBits = 32 - cidr;
  return Math.pow(2, hostBits) - 2;
}

export function getBitValues(): number[] {
  return [128, 64, 32, 16, 8, 4, 2, 1];
}
