// KDFSHA512 is a key-derivation-function using SHA512 as the inner and outer hash.
import { hexToUint8Array, uint8ArrayToHex } from './buffer';

export async function KDFSHA512(salt: Uint8Array, username: string, password: string): Promise<bigint> {
  const innerInput = stringToUint8Array(`${ username }:${ password }`);
  const innerResult = await sumSHA512(innerInput);

  let outerInput = new Uint8Array(salt.length + innerResult.length);
  outerInput.set(salt, 0);
  outerInput.set(innerResult, salt.length);
  const outerResult = await sumSHA512(outerInput);

  return BigInt(`0x${ uint8ArrayToHex(outerResult) }`);
}

export function stringToUint8Array(input: string): Uint8Array {
  return Uint8Array.from(input, c => c.charCodeAt(0));
}

// sumSHA512 just takes the provided string and returns the sum of the SHA512 hash of that string.
export async function sumSHA512(input: Uint8Array): Promise<Uint8Array> {
  const outerResult = await crypto.subtle.digest('SHA-512', input.buffer)
    .then(buf => Array.prototype.map.call(new Uint8Array(buf), (x: number) => (('00' + x.toString(16)).slice(-2))).join(''));

  return hexToUint8Array(outerResult.toString());
}

export async function sumSHA256(input: Uint8Array): Promise<string> {
  const result = await crypto.subtle.digest('SHA-256', input.buffer)
    .then(buf => {
      return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString()).slice(-2))).join('');
    });

  return result.toString();
}
