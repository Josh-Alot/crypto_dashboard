import { getERC20TokenInfo, getMultipleERC20Balances } from '../erc20';
import { createPublicClient } from 'viem';
import { mainnet } from 'viem/chains';
import type { Address } from 'viem';

// Mock viem
jest.mock('viem', () => {
  const actualViem = jest.requireActual('viem');
  return {
    ...actualViem,
    createPublicClient: jest.fn(),
    getAddress: jest.fn((addr: string) => addr),
  };
});

describe('erc20 service', () => {
  const mockTokenAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as Address;
  const mockOwnerAddress = '0x1234567890123456789012345678901234567890' as Address;
  const mockChain = mainnet;

  const mockPublicClient = {
    readContract: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createPublicClient as jest.Mock).mockReturnValue(mockPublicClient);
  });

  describe('getERC20TokenInfo', () => {
    it('should fetch token info successfully', async () => {
      mockPublicClient.readContract
        .mockResolvedValueOnce('USD Coin')
        .mockResolvedValueOnce('USDC')
        .mockResolvedValueOnce(6)
        .mockResolvedValueOnce(1000000000n); // 1000 USDC (6 decimals)

      const result = await getERC20TokenInfo(mockTokenAddress, mockOwnerAddress, mockChain);

      expect(result).toEqual({
        address: mockTokenAddress,
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        balance: 1000000000n,
      });

      expect(mockPublicClient.readContract).toHaveBeenCalledTimes(4);
    });

    it('should return null on contract error', async () => {
      const error = new Error('Contract error');
      error.name = 'ContractFunctionZeroDataError';
      
      mockPublicClient.readContract.mockRejectedValueOnce(error);

      const result = await getERC20TokenInfo(mockTokenAddress, mockOwnerAddress, mockChain);

      expect(result).toBeNull();
    });

    it('should return null on invalid contract address', async () => {
      const error = new Error('Invalid contract');
      error.name = 'InvalidAddressError';
      
      mockPublicClient.readContract.mockRejectedValueOnce(error);

      const result = await getERC20TokenInfo(mockTokenAddress, mockOwnerAddress, mockChain);

      expect(result).toBeNull();
    });

    it('should normalize addresses', async () => {
      const { getAddress } = require('viem');
      getAddress.mockImplementation((addr: string) => addr.toLowerCase());

      mockPublicClient.readContract
        .mockResolvedValueOnce('Token')
        .mockResolvedValueOnce('TKN')
        .mockResolvedValueOnce(18)
        .mockResolvedValueOnce(0n);

      await getERC20TokenInfo(mockTokenAddress, mockOwnerAddress, mockChain);

      expect(getAddress).toHaveBeenCalledWith(mockTokenAddress);
      expect(getAddress).toHaveBeenCalledWith(mockOwnerAddress);
    });
  });

  describe('getMultipleERC20Balances', () => {
    it('should fetch multiple token balances successfully', async () => {
      const tokenAddresses = [
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as Address,
        '0xdAC17F958D2ee523a2206206994597C13D831ec7' as Address,
      ];

      // Mock first token
      mockPublicClient.readContract
        .mockResolvedValueOnce('USD Coin')
        .mockResolvedValueOnce('USDC')
        .mockResolvedValueOnce(6)
        .mockResolvedValueOnce(1000000000n)
        // Mock second token
        .mockResolvedValueOnce('Tether USD')
        .mockResolvedValueOnce('USDT')
        .mockResolvedValueOnce(6)
        .mockResolvedValueOnce(2000000000n);

      const results = await getMultipleERC20Balances(tokenAddresses, mockOwnerAddress, mockChain);

      expect(results).toHaveLength(2);
      expect(results[0].symbol).toBe('USDC');
      expect(results[1].symbol).toBe('USDT');
    });

    it('should filter out tokens with zero balance', async () => {
      const tokenAddresses = [
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as Address,
        '0xdAC17F958D2ee523a2206206994597C13D831ec7' as Address,
      ];

      // Mock first token with balance
      mockPublicClient.readContract
        .mockResolvedValueOnce('USD Coin')
        .mockResolvedValueOnce('USDC')
        .mockResolvedValueOnce(6)
        .mockResolvedValueOnce(1000000000n)
        // Mock second token with zero balance
        .mockResolvedValueOnce('Tether USD')
        .mockResolvedValueOnce('USDT')
        .mockResolvedValueOnce(6)
        .mockResolvedValueOnce(0n);

      const results = await getMultipleERC20Balances(tokenAddresses, mockOwnerAddress, mockChain);

      expect(results).toHaveLength(1);
      expect(results[0].symbol).toBe('USDC');
    });

    it('should filter out failed token fetches', async () => {
      const tokenAddresses = [
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as Address,
        '0xdAC17F958D2ee523a2206206994597C13D831ec7' as Address,
      ];

      // Mock first token successfully
      mockPublicClient.readContract
        .mockResolvedValueOnce('USD Coin')
        .mockResolvedValueOnce('USDC')
        .mockResolvedValueOnce(6)
        .mockResolvedValueOnce(1000000000n)
        // Mock second token failure
        .mockRejectedValueOnce(new Error('Contract error'));

      const results = await getMultipleERC20Balances(tokenAddresses, mockOwnerAddress, mockChain);

      expect(results).toHaveLength(1);
      expect(results[0].symbol).toBe('USDC');
    });

    it('should return empty array when no tokens provided', async () => {
      const results = await getMultipleERC20Balances([], mockOwnerAddress, mockChain);

      expect(results).toEqual([]);
      expect(mockPublicClient.readContract).not.toHaveBeenCalled();
    });

    it('should normalize all addresses', async () => {
      const { getAddress } = require('viem');
      getAddress.mockImplementation((addr: string) => addr.toLowerCase());

      const tokenAddresses = [
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as Address,
      ];

      mockPublicClient.readContract
        .mockResolvedValueOnce('Token')
        .mockResolvedValueOnce('TKN')
        .mockResolvedValueOnce(18)
        .mockResolvedValueOnce(1000000000000000000n);

      await getMultipleERC20Balances(tokenAddresses, mockOwnerAddress, mockChain);

      expect(getAddress).toHaveBeenCalled();
    });
  });
});

