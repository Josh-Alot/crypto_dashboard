export type Token = {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  value: number;
  address?: string;
  decimals?: number;
  logo?: string;
  isNative?: boolean;
}

export type TokenBalance = {
  address: string;
  balance: bigint;
  decimals: number;
  symbol: string;
  name: string;
}

export type TokenWithBalance = TokenBalance & {
  price?: number;
  value?: number;
  logo?: string;
}

