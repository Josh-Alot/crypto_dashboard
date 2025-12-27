// Mock for explorers config to avoid import.meta.env issues in tests
export interface ExplorerConfig {
  baseUrl: string;
  apiKey?: string;
  enabled: boolean;
  chainId: number;
}

export const EXPLORER_APIS: Record<number, ExplorerConfig> = {
  1: {
    baseUrl: 'https://api.etherscan.io/v2/api',
    apiKey: 'test-api-key',
    enabled: true,
    chainId: 1,
  },
  8453: {
    baseUrl: 'https://api.etherscan.io/v2/api',
    apiKey: 'test-api-key',
    enabled: true,
    chainId: 8453,
  },
  137: {
    baseUrl: 'https://api.etherscan.io/v2/api',
    apiKey: 'test-api-key',
    enabled: true,
    chainId: 137,
  },
  42161: {
    baseUrl: 'https://api.etherscan.io/v2/api',
    apiKey: 'test-api-key',
    enabled: true,
    chainId: 42161,
  },
  10: {
    baseUrl: 'https://api.etherscan.io/v2/api',
    apiKey: 'test-api-key',
    enabled: true,
    chainId: 10,
  },
};

