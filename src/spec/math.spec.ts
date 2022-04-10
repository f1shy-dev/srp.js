import { exp } from 'math';

describe('exp', () => {
  it('will calculate the modular exponentiation', () => {
    expect(exp(BigInt(12), BigInt(53), BigInt(7))).toBe(BigInt(3));
    expect(exp(BigInt(7), BigInt(12), BigInt(10))).toBe(BigInt(1));
    expect(exp(BigInt(3), BigInt(51), BigInt(13))).toBe(BigInt(1));
  });
});
