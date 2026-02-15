// Mock for explorers config to avoid import.meta.env issues in tests
export interface ExplorerConfig {
  baseUrl: string;
  apiKey?: string;
  enabled: boolean;
  chainId: number;
}

export const EXPLORER_APIS: Record<number, ExplorerConfig> = {
  1: {
    baseUrl: import.meta.env.ETHERSCAN_API_BASE_URL,
    apiKey: 'test-api-key',
    enabled: true,
    chainId: 1,
  },
  8453: {
    baseUrl: import.meta.env.ETHERSCAN_API_BASE_URL,
    apiKey: 'test-api-key',
    enabled: true,
    chainId: 8453,
  },
  137: {
    baseUrl: import.meta.env.ETHERSCAN_API_BASE_URL,
    apiKey: 'test-api-key',
    enabled: true,
    chainId: 137,
  },
  42161: {
    baseUrl: import.meta.env.ETHERSCAN_API_BASE_URL,
    apiKey: 'test-api-key',
    enabled: true,
    chainId: 42161,
  },
  10: {
    baseUrl: import.meta.env.ETHERSCAN_API_BASE_URL,
    apiKey: 'test-api-key',
    enabled: true,
    chainId: 10,
  },
};

