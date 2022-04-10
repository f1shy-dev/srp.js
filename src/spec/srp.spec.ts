import { G4096 } from 'group';
import { KDFSHA512 } from 'kdf';
import { Mode, SRP } from 'srp';

describe('secure remote password', () => {
  it('will setup', async () => {
    const salt = new Uint8Array([123, 235, 5, 4, 65, 97, 43, 100]);
    const x = await KDFSHA512(salt, 'email@test.com', 'superSecureP@ssw0rd');

    const client = new SRP(G4096);
    await client.setup(Mode.Client, x, null);

    console.log('test');
  });
});
