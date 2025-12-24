// Configuration for blockchain explorer APIs
// Get free API keys from:
// - Etherscan: https://etherscan.io/apis
// - Basescan: https://basescan.org/apis
// - Polygonscan: https://polygonscan.com/apis
// - Arbiscan: https://arbiscan.io/apis
// - Optimistic Etherscan: https://optimistic.etherscan.io/apis

export interface ExplorerConfig {
  baseUrl: string;
  apiKey?: string;
  enabled: boolean;
}

export const EXPLORER_APIS: Record<number, ExplorerConfig> = {
  // Ethereum Mainnet
  1: {
    baseUrl: 'https://api.etherscan.io/api',
    apiKey: import.meta.env.VITE_ETHERSCAN_API_KEY,
    enabled: true,
  },
  // Base
  8453: {
    baseUrl: 'https://api.basescan.org/api',
    apiKey: import.meta.env.VITE_BASESCAN_API_KEY,
    enabled: true,
  },
  // Polygon
  137: {
    baseUrl: 'https://api.polygonscan.com/api',
    apiKey: import.meta.env.VITE_POLYGONSCAN_API_KEY,
    enabled: true,
  },
  // Arbitrum
  42161: {
    baseUrl: 'https://api.arbiscan.io/api',
    apiKey: import.meta.env.VITE_ARBISCAN_API_KEY,
    enabled: true,
  },
  // Optimism
  10: {
    baseUrl: 'https://api-optimistic.etherscan.io/api',
    apiKey: import.meta.env.VITE_OPTIMISTIC_ETHERSCAN_API_KEY,
    enabled: true,
  },
};

