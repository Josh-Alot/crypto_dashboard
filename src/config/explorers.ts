// Configuration for blockchain explorer APIs V2
// API V2 uses a unified endpoint with chainid parameter
// Get free API keys from: https://etherscan.io/myapikey
// The same API key works for all supported chains (60+ EVM chains)
// Supported chain IDs: 1 (Ethereum), 8453 (Base), 137 (Polygon), 42161 (Arbitrum), 10 (Optimism), etc.

export interface ExplorerConfig {
  baseUrl: string;
  apiKey?: string;
  enabled: boolean;
  chainId: number;
}

export const EXPLORER_APIS: Record<number, ExplorerConfig> = {
  // Ethereum Mainnet
  1: {
    baseUrl: 'https://api.etherscan.io/v2/api',
    apiKey: import.meta.env.ETHERSCAN_API_KEY,
    enabled: true,
    chainId: 1,
  },
  // Base
  8453: {
    baseUrl: 'https://api.etherscan.io/v2/api',
    apiKey: import.meta.env.ETHERSCAN_API_KEY,
    enabled: true,
    chainId: 8453,
  },
  // Polygon
  137: {
    baseUrl: 'https://api.etherscan.io/v2/api',
    apiKey: import.meta.env.ETHERSCAN_API_KEY,
    enabled: true,
    chainId: 137,
  },
  // Arbitrum
  42161: {
    baseUrl: 'https://api.etherscan.io/v2/api',
    apiKey: import.meta.env.ETHERSCAN_API_KEY,
    enabled: true,
    chainId: 42161,
  },
  // Optimism
  10: {
    baseUrl: 'https://api.etherscan.io/v2/api',
    apiKey: import.meta.env.ETHERSCAN_API_KEY,
    enabled: true,
    chainId: 10,
  },
};

