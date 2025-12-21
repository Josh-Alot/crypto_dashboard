export type Token = {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  value: number;
}

export const mockTokens: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: 2.5847,
    price: 3245.67,
    value: 8391.23,
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    balance: 0.1234,
    price: 67890.12,
    value: 8377.64,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    balance: 5420,
    price: 1.0,
    value: 5420.0,
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    balance: 145.32,
    price: 14.56,
    value: 2115.86,
  },
  {
    symbol: 'AAVE',
    name: 'Aave',
    balance: 12.5,
    price: 98.45,
    value: 1230.63,
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    balance: 89.45,
    price: 7.89,
    value: 705.76,
  },
];

