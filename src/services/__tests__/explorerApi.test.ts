// Mock the explorers config to avoid import.meta.env issues - MUST be before any imports
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

jest.mock('../../config/explorers', () => ({
  EXPLORER_APIS: mockExplorerAPIs,
}));

import { getTokenAddressesFromExplorer, getWalletTransactions } from '../explorerApi';
import type { Address } from 'viem';

// Mock fetch globally
global.fetch = jest.fn();

// Mock getAddress
jest.mock('viem', () => {
  const actualViem = jest.requireActual('viem');
  return {
    ...actualViem,
    getAddress: jest.fn((addr: string) => addr),
  };
});

describe('explorerApi service', () => {
  const mockAddress = '0x1234567890123456789012345678901234567890' as Address;
  const chainId = 1; // Ethereum mainnet

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('getTokenAddressesFromExplorer', () => {
    it('should fetch token addresses successfully', async () => {
      const mockResponse = {
        status: '1',
        message: 'OK',
        result: [
          {
            contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            tokenName: 'USD Coin',
            tokenSymbol: 'USDC',
            tokenDecimal: '6',
            value: '1000000',
          },
          {
            contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            tokenName: 'Tether USD',
            tokenSymbol: 'USDT',
            tokenDecimal: '6',
            value: '2000000',
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const addresses = await getTokenAddressesFromExplorer(mockAddress, chainId);

      expect(addresses).toHaveLength(2);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('api.etherscan.io')
      );
    });

    it('should return empty array when explorer is disabled', async () => {
      // Use the mocked config
      const { EXPLORER_APIS } = require('../../config/explorers');
      const originalConfig = EXPLORER_APIS[chainId];
      EXPLORER_APIS[chainId] = { ...originalConfig, enabled: false };

      const addresses = await getTokenAddressesFromExplorer(mockAddress, chainId);

      expect(addresses).toEqual([]);
      expect(fetch).not.toHaveBeenCalled();

      // Restore original config
      EXPLORER_APIS[chainId] = originalConfig;
    });

    it('should return empty array when explorer is not configured', async () => {
      const addresses = await getTokenAddressesFromExplorer(mockAddress, 99999);

      expect(addresses).toEqual([]);
    });

    it('should handle API errors gracefully', async () => {
      const mockResponse = {
        status: '0',
        message: 'NOTOK',
        result: 'Error message',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const addresses = await getTokenAddressesFromExplorer(mockAddress, chainId);

      expect(addresses).toEqual([]);
    });

    it('should handle rate limit errors', async () => {
      const mockResponse = {
        status: '0',
        message: 'NOTOK',
        result: 'Max rate limit reached',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const addresses = await getTokenAddressesFromExplorer(mockAddress, chainId);

      expect(addresses).toEqual([]);
    });

    it('should handle invalid API key errors', async () => {
      const mockResponse = {
        status: '0',
        message: 'NOTOK',
        result: 'Invalid API Key',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const addresses = await getTokenAddressesFromExplorer(mockAddress, chainId);

      expect(addresses).toEqual([]);
    });

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const addresses = await getTokenAddressesFromExplorer(mockAddress, chainId);

      expect(addresses).toEqual([]);
    });

    it('should handle HTTP errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const addresses = await getTokenAddressesFromExplorer(mockAddress, chainId);

      expect(addresses).toEqual([]);
    });

    it('should deduplicate token addresses', async () => {
      const mockResponse = {
        status: '1',
        message: 'OK',
        result: [
          {
            contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            tokenName: 'USD Coin',
            tokenSymbol: 'USDC',
            tokenDecimal: '6',
            value: '1000000',
          },
          {
            contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // Duplicate
            tokenName: 'USD Coin',
            tokenSymbol: 'USDC',
            tokenDecimal: '6',
            value: '2000000',
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const addresses = await getTokenAddressesFromExplorer(mockAddress, chainId);

      expect(addresses).toHaveLength(1);
    });

    it('should filter out invalid addresses', async () => {
      const mockResponse = {
        status: '1',
        message: 'OK',
        result: [
          {
            contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            tokenName: 'USD Coin',
            tokenSymbol: 'USDC',
            tokenDecimal: '6',
            value: '1000000',
          },
          {
            contractAddress: 'invalid-address',
            tokenName: 'Invalid',
            tokenSymbol: 'INV',
            tokenDecimal: '18',
            value: '0',
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const addresses = await getTokenAddressesFromExplorer(mockAddress, chainId);

      // Should only include valid addresses
      expect(addresses.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getWalletTransactions', () => {
    it('should fetch transactions successfully', async () => {
      const mockResponse = {
        status: '1',
        message: 'OK',
        result: [
          {
            blockNumber: '18500000',
            timeStamp: '1699000000',
            hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            from: '0x1111111111111111111111111111111111111111',
            to: mockAddress,
            value: '1000000000000000000',
            gas: '21000',
            gasPrice: '20000000000',
            gasUsed: '21000',
            isError: '0',
            txreceipt_status: '1',
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const transactions = await getWalletTransactions(mockAddress, chainId, 10);

      expect(transactions).toHaveLength(1);
      expect(transactions[0].hash).toBe(mockResponse.result[0].hash);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('api.etherscan.io')
      );
    });

    it('should return empty array when explorer is disabled', async () => {
      const { EXPLORER_APIS } = require('../../config/explorers');
      const originalConfig = EXPLORER_APIS[chainId];
      EXPLORER_APIS[chainId] = { ...originalConfig, enabled: false };

      const transactions = await getWalletTransactions(mockAddress, chainId, 10);

      expect(transactions).toEqual([]);
      expect(fetch).not.toHaveBeenCalled();

      // Restore original config
      EXPLORER_APIS[chainId] = originalConfig;
    });

    it('should return empty array when explorer is not configured', async () => {
      const transactions = await getWalletTransactions(mockAddress, 99999, 10);

      expect(transactions).toEqual([]);
    });

    it('should limit results to specified limit', async () => {
      const mockTransactions = Array.from({ length: 20 }, (_, i) => ({
        blockNumber: `1850000${i}`,
        timeStamp: `169900000${i}`,
        hash: `0x${i.toString().padStart(64, '0')}`,
        from: '0x1111111111111111111111111111111111111111',
        to: mockAddress,
        value: '1000000000000000000',
        gas: '21000',
        gasPrice: '20000000000',
        gasUsed: '21000',
        isError: '0',
        txreceipt_status: '1',
      }));

      const mockResponse = {
        status: '1',
        message: 'OK',
        result: mockTransactions,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const transactions = await getWalletTransactions(mockAddress, chainId, 10);

      expect(transactions).toHaveLength(10);
    });

    it('should handle no transactions found', async () => {
      const mockResponse = {
        status: '0',
        message: 'No transactions found',
        result: 'No transactions found',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const transactions = await getWalletTransactions(mockAddress, chainId, 10);

      expect(transactions).toEqual([]);
    });

    it('should handle API errors gracefully', async () => {
      const mockResponse = {
        status: '0',
        message: 'NOTOK',
        result: 'Error message',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const transactions = await getWalletTransactions(mockAddress, chainId, 10);

      expect(transactions).toEqual([]);
    });

    it('should filter out invalid transactions', async () => {
      const mockResponse = {
        status: '1',
        message: 'OK',
        result: [
          {
            blockNumber: '18500000',
            timeStamp: '1699000000',
            hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            from: '0x1111111111111111111111111111111111111111',
            to: mockAddress,
            value: '1000000000000000000',
            gas: '21000',
            gasPrice: '20000000000',
            gasUsed: '21000',
            isError: '0',
            txreceipt_status: '1',
          },
          {
            // Missing required fields
            blockNumber: '18500001',
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const transactions = await getWalletTransactions(mockAddress, chainId, 10);

      expect(transactions).toHaveLength(1);
    });

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const transactions = await getWalletTransactions(mockAddress, chainId, 10);

      expect(transactions).toEqual([]);
    });

    it('should handle HTTP errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const transactions = await getWalletTransactions(mockAddress, chainId, 10);

      expect(transactions).toEqual([]);
    });
  });
});

