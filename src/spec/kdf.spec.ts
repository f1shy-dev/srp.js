import { sumSHA512 } from 'kdf';

describe('key derivation functions', () => {
  it('will match golang #1', async () => {
    const result = await sumSHA512('my string for hashing');
    expect(result).toMatch(/4DC43467FE9140F217821252F94BE94E49F963EED1889BCEAB83A1C36FFE3EFE87334510605A9BF3B644626AC0CD0827A980B698EFBC1BDE75B537172AB8DBD0/i);
  });
  it('will match golang #2', async () => {
    const result = await sumSHA512('another test string that should match golang');
    expect(result).toMatch(/36ED8EF8DA5C2146C5605062880339CAAB10FA80FA80DD830964269243C4959D2E6620C48C21214A51BC5AF621FB2EA8D0A7EFF56309F7379C41F928DDDE2A87/i);
  });
});
