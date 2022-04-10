import { Group } from 'group';

export enum Mode {
  Client,
  Server
}

export class SRP {
  private ephemeralPrivate: BigInt | null;
  private ephemeralPublicA: BigInt | null;
  private ephemeralPublicB: BigInt | null;
  private x: BigInt | null;
  private v: BigInt | null;
  private u: BigInt | null;
  private k: BigInt | null;
  private preMasterKey: BigInt | null;
  private group: Group;
  key: Uint8Array | null;
  m: Uint8Array | null;
  cProof: Uint8Array | null;
  isServerProved: boolean;
  mode: Mode;
  badState: boolean;

  constructor(mode: Mode, group: Group, xORv: BigInt, k?: BigInt | null) {
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
    }
  }

  // makeLittleK initializes multiplier based on group parameters
  // k = H(N, g)
  // BUG(jpg): Creation of multiplier, little k, does _not_ conform to RFC 5054 padding.
  private async makeLittleK(): Promise<BigInt> {
    if (!this.group) {
      throw new Error('group not set')
    }

    this.group.n


    return BigInt(-1); // TODO
  }
}
