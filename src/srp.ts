import { hexToUint8Array, uint8ArrayToHex } from 'buffer';
import { Group } from 'group';
import { sumSHA256 } from 'kdf';
import { exp } from 'math';

export const MinGroupSize = 2048;
export const MinExponentSize = 32;
export const bigZero = BigInt(0);
export const bigOne = BigInt(1);

export enum Mode {
  Client,
  Server
}

export class SRP {
  private ephemeralPrivate: bigint | null;
  private ephemeralPublicA: bigint | null;
  private ephemeralPublicB: bigint | null;
  private x: bigint | null;
  private v: bigint | null;
  private u: bigint | null;
  private k: bigint | null;
  private preMasterKey: bigint | null;
  private readonly group: Group;
  key: Uint8Array | null;
  m: Uint8Array | null;
  cProof: Uint8Array | null;
  isServerProved: boolean;
  mode: Mode;
  badState: boolean;

  constructor(group: Group) {
    this.ephemeralPrivate = BigInt(0);
    this.ephemeralPublicA = BigInt(0);
    this.ephemeralPublicB = BigInt(0);
    this.u = BigInt(0);
    this.k = BigInt(0);
    this.x = BigInt(0);
    this.v = BigInt(0);
    this.preMasterKey = BigInt(0);
    this.key = null;
    this.group = group

    this.m = null;
    this.cProof = null;
  }

  // setup should be called after the constructor.
  public async setup(mode: Mode, xORv: bigint, k?: bigint | null): Promise<void> {
    switch (mode) {
      case Mode.Client:
        this.x = xORv;
        break;
      case Mode.Server:
        this.v = xORv;
        break;
    }

    if (k !== null) {
      this.k = k;
    } else {
      await this.makeLittleK();
    }

    this.generateMySecret();

    switch (mode) {
      case Mode.Client:
        this.makeA();
        break;
      case Mode.Server:
        this.makeB();
        break;
    }

    return;
  }

  // makeLittleK initializes multiplier based on group parameters
  // k = H(N, g)
  // BUG(jpg): Creation of multiplier, little k, does _not_ conform to RFC 5054 padding.
  private async makeLittleK(): Promise<bigint> {
    if (!this.group) {
      throw new Error('group not set')
    }

    const n = hexToUint8Array(this.group.n.toString(16));
    const g = hexToUint8Array(this.group.g.toString(16));
    const total = new Uint8Array(n.length + g.length);
    total.set(n, 0);
    total.set(g, n.length);

    this.k = BigInt(await sumSHA256(total));

    return this.k
  }

  // generateMySecret creates the little a or b
  // According to RFC 5054, this should be at least 32 bytes
  // According to RFC 2631 this should be uniform in the range
  // [2, q-2], where q is the Sophie Germain prime from which
  // N was created.
  // According to RFC 3526 §8 there are some specific sizes depending
  // on the group. We go with RFC 3526 values if available, otherwise
  // a minimum of 32 bytes.
  private generateMySecret(): bigint {
    const eSize = Math.max(this.group.ExponentSize, MinExponentSize);
    let bytes = new Uint8Array(eSize);
    bytes = crypto.getRandomValues(bytes);
    this.ephemeralPrivate = BigInt(uint8ArrayToHex(bytes));
    return this.ephemeralPrivate;
  }

  // makeA calculates A (if necessary) and returns it.
  private makeA(): bigint {
    if (!this.group) {
      throw new Error('group not set');
    }
    if (this.mode === Mode.Server) {
      throw new Error('only the client can make A');
    }

    if (this.ephemeralPrivate === bigZero) {
      // This is odd because generateMySecret already assigns to ephemeralPrivate, not sure what OP is trying to do
      // here.
      this.ephemeralPrivate = this.generateMySecret();
    }

    this.ephemeralPublicA = exp(this.group.g, this.ephemeralPrivate, this.group.n);
    return this.ephemeralPublicA;
  }

  private makeB(): bigint {
    // TODO
    return bigZero;
  }
}
