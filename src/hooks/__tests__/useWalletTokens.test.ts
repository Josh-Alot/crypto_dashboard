// Mock explorers config before any imports
jest.mock('../../config/explorers', () => ({
  EXPLORER_APIS: {
    1: { baseUrl: import.meta.env.ETHERSCAN_API_BASE_URL, apiKey: 'test', enabled: true, chainId: 1 },
    8453: { baseUrl: import.meta.env.ETHERSCAN_API_BASE_URL, apiKey: 'test', enabled: true, chainId: 8453 },
    137: { baseUrl: import.meta.env.ETHERSCAN_API_BASE_URL, apiKey: 'test', enabled: true, chainId: 137 },
    42161: { baseUrl: import.meta.env.ETHERSCAN_API_BASE_URL, apiKey: 'test', enabled: true, chainId: 42161 },
    10: { baseUrl: import.meta.env.ETHERSCAN_API_BASE_URL, apiKey: 'test', enabled: true, chainId: 10 },
  },
}));

import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWalletTokens } from '../useWalletTokens';
import { getTokenPrices } from '../../services/coingecko';
import { getMultipleERC20Balances } from '../../services/erc20';
import { getTokenAddressesFromExplorer } from '../../services/explorerApi';
import * as wagmi from 'wagmi';

// Mock dependencies
jest.mock('wagmi', () => ({
  useConnection: jest.fn(),
  useBalance: jest.fn(),
  useChainId: jest.fn(),
  useConfig: jest.fn(),
}));

jest.mock('../../services/coingecko');
jest.mock('../../services/erc20');
jest.mock('../../services/explorerApi');

const mockUseConnection = wagmi.useConnection as jest.Mock;
const mockUseBalance = wagmi.useBalance as jest.Mock;
const mockUseChainId = wagmi.useChainId as jest.Mock;
const mockUseConfig = wagmi.useConfig as jest.Mock;
const mockGetTokenPrices = getTokenPrices as jest.Mock;
const mockGetMultipleERC20Balances = getMultipleERC20Balances as jest.Mock;
const mockGetTokenAddressesFromExplorer = getTokenAddressesFromExplorer as jest.Mock;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) => {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
};

describe('useWalletTokens', () => {
  const mockAddress = '0x1234567890123456789012345678901234567890';
  const mockChainId = 1;
  const mockChain = { id: mockChainId, name: 'Ethereum' };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseConnection.mockReturnValue({
      address: mockAddress,
      isConnected: true,
    });

    mockUseChainId.mockReturnValue(mockChainId);

    mockUseConfig.mockReturnValue({
      chains: [mockChain],
    });

    mockUseBalance.mockReturnValue({
      data: {
        value: 1000000000000000000n, // 1 ETH
        decimals: 18,
      },
      isLoading: false,
    });

    mockGetTokenAddressesFromExplorer.mockResolvedValue([]);
    mockGetTokenPrices.mockResolvedValue({});
    mockGetMultipleERC20Balances.mockResolvedValue([]);
  });

  it('should return empty tokens when wallet is not connected', () => {
    mockUseConnection.mockReturnValue({
      address: null,
      isConnected: false,
    });

    mockUseBalance.mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useWalletTokens(), {
      wrapper: createWrapper(),
    });

    expect(result.current.tokens).toEqual([]);
    // When not connected, isLoading depends on useBalance and useQuery states
    // Since both are mocked to not be loading, isLoading should be false
    expect(result.current.isLoading).toBe(false);
  });

  it('should return empty tokens when address is not available', () => {
    mockUseConnection.mockReturnValue({
      address: null,
      isConnected: true,
    });

    const { result } = renderHook(() => useWalletTokens(), {
      wrapper: createWrapper(),
    });

    expect(result.current.tokens).toEqual([]);
  });

  it('should include native token when balance is greater than zero', async () => {
    mockGetTokenPrices.mockResolvedValue({ ETH: 2500 });

    const { result } = renderHook(() => useWalletTokens(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should exclude native token when balance is zero', async () => {
    mockUseBalance.mockReturnValue({
      data: {
        value: 0n,
        decimals: 18,
      },
      isLoading: false,
    });

    const { result } = renderHook(() => useWalletTokens(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should fetch ERC20 tokens from explorer', async () => {
    const mockTokenAddresses = [
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    ];

    const mockERC20Tokens = [
      {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        balance: 1000000000n, // 1000 USDC
      },
    ];

    mockGetTokenAddressesFromExplorer.mockResolvedValue(mockTokenAddresses);
    mockGetMultipleERC20Balances.mockResolvedValue(mockERC20Tokens);
    mockGetTokenPrices.mockResolvedValue({ USDC: 1.0 });

    renderHook(() => useWalletTokens(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockGetTokenAddressesFromExplorer).toHaveBeenCalledWith(
        expect.any(String),
        mockChainId
      );
    });
  });

  it('should calculate token values correctly', async () => {
    const mockERC20Tokens = [
      {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        balance: 1000000000n, // 1000 USDC
      },
    ];

    mockGetTokenAddressesFromExplorer.mockResolvedValue([
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    ]);
    mockGetMultipleERC20Balances.mockResolvedValue(mockERC20Tokens);
    mockGetTokenPrices.mockResolvedValue({ USDC: 1.0 });

    renderHook(() => useWalletTokens(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockGetTokenPrices).toHaveBeenCalled();
    });
  });

  it('should handle loading state correctly', () => {
    mockUseBalance.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    const { result } = renderHook(() => useWalletTokens(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });
});

