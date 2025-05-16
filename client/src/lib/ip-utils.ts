// Convert array of bits to a decimal octet value
export function bitsToDecimal(bits: number[]): number {
  if (bits.length !== 8) {
    throw new Error("An octet must have exactly 8 bits");
  }
  
  return bits.reduce((total, bit, index) => {
    return total + (bit * Math.pow(2, 7 - index));
  }, 0);
}

// Convert a decimal value to an array of 8 bits
export function decimalToBits(decimal: number): number[] {
  if (decimal < 0 || decimal > 255) {
    throw new Error("Decimal value must be between 0 and 255");
  }
  
  const bits = new Array(8).fill(0);
  let tempValue = decimal;
  
  for (let i = 7; i >= 0; i--) {
    const bitValue = Math.pow(2, i);
    if (tempValue >= bitValue) {
      bits[7 - i] = 1;
      tempValue -= bitValue;
    }
  }
  
  return bits;
}

// Check if a subnet mask is valid (continuous 1s followed by continuous 0s)
export function isValidSubnetMask(mask: number[][]): boolean {
  const flatMask = mask.flat();
  let foundFirstZero = false;
  
  for (let i = 0; i < flatMask.length; i++) {
    if (flatMask[i] === 0) {
      foundFirstZero = true;
    } else if (foundFirstZero && flatMask[i] === 1) {
      // Found a 1 after a 0 - invalid mask
      return false;
    }
  }
  
  return true;
}

// Convert subnet mask to CIDR notation
export function maskToCidr(mask: number[][]): number {
  const flatMask = mask.flat();
  return flatMask.reduce((count, bit) => count + bit, 0);
}

// Get available hosts from CIDR notation
export function getAvailableHosts(cidr: number): number {
  if (cidr < 0 || cidr > 32) {
    throw new Error("CIDR value must be between 0 and 32");
  }
  
  const hostBits = 32 - cidr;
  return Math.pow(2, hostBits) - 2; // Subtract network and broadcast addresses
}

// Construct a subnet mask from CIDR notation
export function cidrToMask(cidr: number): number[][] {
  if (cidr < 0 || cidr > 32) {
    throw new Error("CIDR value must be between 0 and 32");
  }
  
  const mask: number[][] = [
    new Array(8).fill(0),
    new Array(8).fill(0),
    new Array(8).fill(0),
    new Array(8).fill(0)
  ];
  
  let remainingBits = cidr;
  
  for (let octet = 0; octet < 4; octet++) {
    for (let bit = 0; bit < 8; bit++) {
      if (remainingBits > 0) {
        mask[octet][bit] = 1;
        remainingBits--;
      } else {
        mask[octet][bit] = 0;
      }
    }
  }
  
  return mask;
}

// Convert a subnet mask to decimal notation (e.g., 255.255.255.0)
export function maskToDecimal(mask: number[][]): string {
  const decimals = mask.map(octet => bitsToDecimal(octet));
  return decimals.join('.');
}

// Get bit position values (128, 64, 32, etc.)
export function getBitPositionValues(): number[] {
  return [128, 64, 32, 16, 8, 4, 2, 1];
}

// Calculate network address from IP and subnet mask
export function calculateNetworkAddress(ip: number[][], mask: number[][]): number[][] {
  const network: number[][] = [];
  
  for (let octet = 0; octet < 4; octet++) {
    network[octet] = [];
    for (let bit = 0; bit < 8; bit++) {
      network[octet][bit] = ip[octet][bit] & mask[octet][bit];
    }
  }
  
  return network;
}

// Validate an IP address
export function isValidIpAddress(ip: number[][]): boolean {
  // Ensure we have 4 octets
  if (ip.length !== 4) return false;
  
  // Ensure each octet has 8 bits
  for (const octet of ip) {
    if (octet.length !== 8) return false;
  }
  
  // Ensure each bit is either 0 or 1
  for (const octet of ip) {
    for (const bit of octet) {
      if (bit !== 0 && bit !== 1) return false;
    }
  }
  
  return true;
}
