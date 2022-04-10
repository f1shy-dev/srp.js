// KDFSHA512 is a key-derivation-function using SHA512 as the inner and outer hash.
export async function KDFSHA512(salt: string, username: string, password: string): Promise<BigInt> {
  const innerInput = `${ username }:${ password }`;
  const innerResult = await sumSHA512(innerInput);

  const outerInput = `${ salt }${ innerInput }`;
  const outerResult = await sumSHA512(outerInput);

  return BigInt(`0x${ outerResult }`);
}

// sumSHA512 just takes the provided string and returns the sum of the SHA512 hash of that string.
export async function sumSHA512(input: string): Promise<string> {
  const outerResult = await crypto.subtle.digest('SHA-512', Uint8Array.from(decodeURI(encodeURIComponent(input)), c => c.charCodeAt(0)))
    .then(buf => Array.prototype.map.call(new Uint8Array(buf), (x: number) => (('00' + x.toString(16)).slice(-2))).join(''));

  return outerResult.toString();
}

export async function sumSHA256(input: Uint8Array): Promise<string> {
  const result = await crypto.subtle.digest('SHA-256', input.buffer)
    .then(buf => {
      return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString()).slice(-2))).join('');
    });

  return result.toString();
}
