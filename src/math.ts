// Modular exponentiation for x ^ y mod |m|
export function exp(x: bigint, y: bigint, m: bigint): bigint {
  const one = BigInt(1);
  const two = BigInt(2);
  x = x % m
  let result = one;
  while (y > 0) {
    const leastSignificantBit = y % two;
    y /= two;
    if (leastSignificantBit === one) {
      result *= x;
      result %= m;
    }

    x *= x;
    x %= m;
  }

  return result;
}
