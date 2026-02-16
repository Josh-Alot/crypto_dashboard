// Mock explorers config before any imports
jest.mock('../../config/explorers', () => ({
  EXPLORER_APIS: {
    1: { baseUrl: 'https://api.etherscan.io/api', apiKey: 'test', enabled: true, chainId: 1 },
    8453: { baseUrl: 'https://api.basescan.org/api', apiKey: 'test', enabled: true, chainId: 8453 },
    137: { baseUrl: 'https://api.polygonscan.com/api', apiKey: 'test', enabled: true, chainId: 137 },
    42161: { baseUrl: 'https://api.arbiscan.io/api', apiKey: 'test', enabled: true, chainId: 42161 },
    10: { baseUrl: 'https://api-optimistic.etherscan.io/api', apiKey: 'test', enabled: true, chainId: 10 },
  },
}));

// Mock services
jest.mock('../../services/explorerApi');

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RecentTransactions from '../RecentTransactions';
import { useConnection, useChainId } from 'wagmi';
import { useWalletTokens } from '../../hooks/useWalletTokens';
import { getWalletTransactions, getWalletTokenTransactions } from '../../services/explorerApi';

// Mock wagmi
jest.mock('wagmi', () => ({
  useConnection: jest.fn(),
  useChainId: jest.fn(),
}));

// Mock useWalletTokens
jest.mock('../../hooks/useWalletTokens');

const mockUseConnection = useConnection as jest.Mock;
const mockUseChainId = useChainId as jest.Mock;
const mockUseWalletTokens = useWalletTokens as jest.Mock;
const mockGetWalletTransactions = getWalletTransactions as jest.Mock;
const mockGetWalletTokenTransactions = getWalletTokenTransactions as jest.Mock;

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

describe('RecentTransactions', () => {
  const mockAddress = '0x1234567890123456789012345678901234567890';
  const mockChainId = 1;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseConnection.mockReturnValue({
      address: mockAddress,
      isConnected: true,
    });

    mockUseChainId.mockReturnValue(mockChainId);

    mockUseWalletTokens.mockReturnValue({
      tokens: [],
      isLoading: false,
      error: null,
    });

    mockGetWalletTransactions.mockResolvedValue([]);
    mockGetWalletTokenTransactions.mockResolvedValue([]);
  });

  it('should return null when not connected', () => {
    mockUseConnection.mockReturnValue({
      address: null,
      isConnected: false,
    });

    const { container } = render(<RecentTransactions />, { wrapper: createWrapper() });
    expect(container.firstChild).toBeNull();
  });

  it('should display loading state', () => {
    mockGetWalletTransactions.mockImplementation(() => new Promise(() => {}));
    mockGetWalletTokenTransactions.mockImplementation(() => new Promise(() => {}));

    render(<RecentTransactions />, { wrapper: createWrapper() });

    expect(screen.getByText('Last Transactions')).toBeInTheDocument();
  });

  it('should display empty state when no transactions', async () => {
    render(<RecentTransactions />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('No transactions found.')).toBeInTheDocument();
    });
  });

  it('should display transactions table with data', async () => {
    mockGetWalletTransactions.mockResolvedValue([
      {
        hash: '0xabc123def4567890abcdef1234567890abcdef1234567890abcdef1234567890',
        from: '0x1111111111111111111111111111111111111111',
        to: mockAddress,
        value: '1000000000000000000',
        timeStamp: '1700000000',
        isError: '0',
        txreceipt_status: '1',
        gas: '21000',
        gasPrice: '20000000000',
        gasUsed: '21000',
      },
    ]);

    render(<RecentTransactions />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Hash')).toBeInTheDocument();
      expect(screen.getByText('From/To')).toBeInTheDocument();
      expect(screen.getByText('Value')).toBeInTheDocument();
    });
  });

  it('should hide transactions from zero value tokens by default', async () => {
    const zeroValueTokenAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

    mockUseWalletTokens.mockReturnValue({
      tokens: [
        {
          symbol: 'ZERO',
          name: 'Zero Token',
          balance: 1000,
          price: 0,
          value: 0,
          address: zeroValueTokenAddress,
          isNative: false,
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          balance: 1.5,
          price: 2500,
          value: 3750,
          isNative: true,
        },
      ],
      isLoading: false,
      error: null,
    });

    mockGetWalletTransactions.mockResolvedValue([
      {
        hash: '0xabc123def4567890abcdef1234567890abcdef1234567890abcdef1234567890',
        from: '0x1111111111111111111111111111111111111111',
        to: mockAddress,
        value: '1000000000000000000',
        timeStamp: '1700000000',
        isError: '0',
        txreceipt_status: '1',
        gas: '21000',
        gasPrice: '20000000000',
        gasUsed: '21000',
      },
    ]);

    mockGetWalletTokenTransactions.mockResolvedValue([
      {
        hash: '0xdef456def4567890abcdef1234567890abcdef1234567890abcdef1234567890',
        from: mockAddress,
        to: '0x2222222222222222222222222222222222222222',
        value: '500000000',
        contractAddress: zeroValueTokenAddress,
        tokenName: 'Zero Token',
        tokenSymbol: 'ZERO',
        tokenDecimal: '6',
        timeStamp: '1700000001',
        isError: '0',
        txreceipt_status: '1',
        gasUsed: '65000',
        gasPrice: '20000000000',
      },
    ]);

    render(<RecentTransactions />, { wrapper: createWrapper() });

    await waitFor(() => {
      // ETH transaction should be visible
      expect(screen.getByText('Hash')).toBeInTheDocument();
      // ZERO token transaction should be hidden (only ETH transaction visible)
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(2); // Header + 1 transaction
    });
  });

  it('should show checkbox when transactions from zero value tokens exist', async () => {
    const zeroValueTokenAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

    mockUseWalletTokens.mockReturnValue({
      tokens: [
        {
          symbol: 'ZERO',
          name: 'Zero Token',
          balance: 1000,
          price: 0,
          value: 0,
          address: zeroValueTokenAddress,
          isNative: false,
        },
      ],
      isLoading: false,
      error: null,
    });

    mockGetWalletTokenTransactions.mockResolvedValue([
      {
        hash: '0xdef456def4567890abcdef1234567890abcdef1234567890abcdef1234567890',
        from: mockAddress,
        to: '0x2222222222222222222222222222222222222222',
        value: '500000000',
        contractAddress: zeroValueTokenAddress,
        tokenName: 'Zero Token',
        tokenSymbol: 'ZERO',
        tokenDecimal: '6',
        timeStamp: '1700000001',
        isError: '0',
        txreceipt_status: '1',
        gasUsed: '65000',
        gasPrice: '20000000000',
      },
    ]);

    render(<RecentTransactions />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByLabelText(/Show.*tokens/)).toBeInTheDocument();
    });
  });
});
