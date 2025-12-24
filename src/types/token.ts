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

