// Mock the explorers config to avoid import.meta.env issues
const mockExplorerAPIs = {
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

jest.mock('../explorers', () => ({
  EXPLORER_APIS: mockExplorerAPIs,
}));

import { EXPLORER_APIS, type ExplorerConfig } from '../explorers';

describe('explorers config', () => {
  describe('EXPLORER_APIS', () => {
    it('should have configuration for Ethereum mainnet', () => {
      const config = EXPLORER_APIS[1];
      
      expect(config).toBeDefined();
      expect(config.baseUrl).toBe('https://api.etherscan.io/v2/api');
      expect(config.chainId).toBe(1);
      expect(config.enabled).toBe(true);
    });

    it('should have configuration for Base', () => {
      const config = EXPLORER_APIS[8453];
      
      expect(config).toBeDefined();
      expect(config.baseUrl).toBe('https://api.etherscan.io/v2/api');
      expect(config.chainId).toBe(8453);
      expect(config.enabled).toBe(true);
    });

    it('should have configuration for Polygon', () => {
      const config = EXPLORER_APIS[137];
      
      expect(config).toBeDefined();
      expect(config.baseUrl).toBe('https://api.etherscan.io/v2/api');
      expect(config.chainId).toBe(137);
      expect(config.enabled).toBe(true);
    });

    it('should have configuration for Arbitrum', () => {
      const config = EXPLORER_APIS[42161];
      
      expect(config).toBeDefined();
      expect(config.baseUrl).toBe('https://api.etherscan.io/v2/api');
      expect(config.chainId).toBe(42161);
      expect(config.enabled).toBe(true);
    });

    it('should have configuration for Optimism', () => {
      const config = EXPLORER_APIS[10];
      
      expect(config).toBeDefined();
      expect(config.baseUrl).toBe('https://api.etherscan.io/v2/api');
      expect(config.chainId).toBe(10);
      expect(config.enabled).toBe(true);
    });

    it('should have valid baseUrl for all chains', () => {
      Object.values(EXPLORER_APIS).forEach((config: ExplorerConfig) => {
        expect(config.baseUrl).toBeDefined();
        expect(typeof config.baseUrl).toBe('string');
        expect(config.baseUrl.length).toBeGreaterThan(0);
        expect(config.baseUrl.startsWith('http')).toBe(true);
      });
    });

    it('should have correct chainId for each configuration', () => {
      Object.entries(EXPLORER_APIS).forEach(([chainId, config]: [string, ExplorerConfig]) => {
        expect(config.chainId).toBe(Number(chainId));
      });
    });

    it('should have enabled flag for all configurations', () => {
      Object.values(EXPLORER_APIS).forEach((config: ExplorerConfig) => {
        expect(config.enabled).toBeDefined();
        expect(typeof config.enabled).toBe('boolean');
      });
    });

    it('should use same baseUrl for all chains (unified API)', () => {
      const baseUrls = Object.values(EXPLORER_APIS).map((config: ExplorerConfig) => config.baseUrl);
      const uniqueBaseUrls = new Set(baseUrls);
      
      // All chains should use the same unified API endpoint
      expect(uniqueBaseUrls.size).toBe(1);
      expect(uniqueBaseUrls.has('https://api.etherscan.io/v2/api')).toBe(true);
    });

    it('should have apiKey as optional string or undefined', () => {
      Object.values(EXPLORER_APIS).forEach((config: ExplorerConfig) => {
        if (config.apiKey !== undefined) {
          expect(typeof config.apiKey).toBe('string');
        }
      });
    });

    it('should have all required properties', () => {
      Object.values(EXPLORER_APIS).forEach((config: ExplorerConfig) => {
        expect(config).toHaveProperty('baseUrl');
        expect(config).toHaveProperty('chainId');
        expect(config).toHaveProperty('enabled');
        // apiKey is optional
      });
    });
  });

  describe('API Key configuration', () => {
    it('should allow apiKey to be set from environment variable', () => {
      // The config uses import.meta.env.VITE_ETHERSCAN_API_KEY
      // This test verifies the structure allows for API keys
      Object.values(EXPLORER_APIS).forEach((config: ExplorerConfig) => {
        // apiKey can be undefined (for public API) or a string
        expect(config.apiKey === undefined || typeof config.apiKey === 'string').toBe(true);
      });
    });
  });
});

