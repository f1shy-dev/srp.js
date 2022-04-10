// Modular exponentiation for a ^ b mod |m|
import { hexToUint8Array, uint8ArrayToHex } from './buffer';

export function exp(base: bigint, exponent: bigint, modulus: bigint): bigint {
  if (modulus === 1n) return 0n;
  let result = 1n;
  base = base % modulus
  while (exponent > 0) {
    if (exponent % 2n === 1n)
      result = (result * base) % modulus;
    exponent = exponent >> 1n;
    base = (base * base) % modulus;
  }

  return result;
}

export function exp2(a: bigint, b: bigint, m: bigint): bigint {
  a = a % m
  let result = 1n;
  while (b > 0) {
    const leastSignificantBit = b % 2n;
    b /= 2n;
    if (leastSignificantBit === 1n) {
      result *= a;
      result %= m;
    }

    a *= a;
    a %= m;
  }

  return result;
}

export function abs(input: bigint): bigint {
  return input < 0n ? -input : input;
}

// TODO I'm not sure if this is going to be correct
export function gcd(a: bigint, b: bigint): bigint {
  a = abs(a);
  b = abs(b);

  if (b > a) {
    let temp = a;
    a = b;
    b = temp;
  }

  while (true) {
    a %= b;
    if (a === 0n) {
      return b;
    }
    b %= a;
    if (b === 0n) {
      return a;
    }
  }
}

export function XORUint8Array(a: Uint8Array, b: Uint8Array): Uint8Array {
  // lifted straight from https://golang.org/src/crypto/cipher/xor.go
  // Only work with the shorter array to avoid index out of range issues.
  let n = b.length < a.length ? b.length : a.length;
  let dst = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    dst[i] = a[i] ^ b[i];
  }

  return dst;
}

export function ConstantTimeCompare(a: Uint8Array, b: Uint8Array): boolean {
  // lifted from https://golang.org/src/crypto/subtle/constant_time.go
  if (a.length != b.length) {
    return false;
  }

  let v: number;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

export function mod(a: bigint, b: bigint): bigint {
  return ((a % b) + b) % b;
}

export function BigIntFromUint8Array(input: Uint8Array): bigint {
  return BigInt(`0x${ uint8ArrayToHex(input) }`);
}

export function Uint8ArrayFromBigInt(input: bigint): Uint8Array {
  return hexToUint8Array(input.toString(16));
}
