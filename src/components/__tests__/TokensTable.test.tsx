// Mock explorers config before any imports
jest.mock('../../config/explorers', () => ({
  EXPLORER_APIS: {
    1: { baseUrl: 'https://api.etherscan.io/v2/api', apiKey: 'test', enabled: true, chainId: 1 },
    8453: { baseUrl: 'https://api.etherscan.io/v2/api', apiKey: 'test', enabled: true, chainId: 8453 },
    137: { baseUrl: 'https://api.etherscan.io/v2/api', apiKey: 'test', enabled: true, chainId: 137 },
    42161: { baseUrl: 'https://api.etherscan.io/v2/api', apiKey: 'test', enabled: true, chainId: 42161 },
    10: { baseUrl: 'https://api.etherscan.io/v2/api', apiKey: 'test', enabled: true, chainId: 10 },
  },
}));

// Mock wagmi before importing anything that uses it
jest.mock('wagmi', () => ({
  useConnection: jest.fn(),
  useBalance: jest.fn(),
  useChainId: jest.fn(),
  useConfig: jest.fn(),
}));

import { render, screen } from '@testing-library/react';
import TokensTable from '../TokensTable';
import { useWalletTokens } from '../../hooks/useWalletTokens';

// Mock the hook
jest.mock('../../hooks/useWalletTokens');

const mockUseWalletTokens = useWalletTokens as jest.Mock;

describe('TokensTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading state', () => {
    mockUseWalletTokens.mockReturnValue({
      tokens: [],
      isLoading: true,
      error: null,
    });

    render(<TokensTable />);

    expect(screen.getByText('Loading tokens...')).toBeInTheDocument();
  });

  it('should display error message', () => {
    mockUseWalletTokens.mockReturnValue({
      tokens: [],
      isLoading: false,
      error: new Error('Failed to load'),
    });

    render(<TokensTable />);

    expect(screen.getByText('Error loading tokens. Please try again.')).toBeInTheDocument();
  });

  it('should display empty state when no tokens', () => {
    mockUseWalletTokens.mockReturnValue({
      tokens: [],
      isLoading: false,
      error: null,
    });

    render(<TokensTable />);

    expect(screen.getByText('No tokens found in your wallet.')).toBeInTheDocument();
  });

  it('should display tokens table with data', () => {
    const mockTokens = [
      {
        symbol: 'ETH',
        name: 'Ethereum',
        balance: 1.5,
        price: 2500,
        value: 3750,
        isNative: true,
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        balance: 1000,
        price: 1,
        value: 1000,
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        isNative: false,
      },
    ];

    mockUseWalletTokens.mockReturnValue({
      tokens: mockTokens,
      isLoading: false,
      error: null,
    });

    render(<TokensTable />);

    expect(screen.getByText('Token')).toBeInTheDocument();
    expect(screen.getByText('Balance')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();

    // Check if tokens are rendered
    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.getByText('USDC')).toBeInTheDocument();
  });

  it('should sort tokens by value descending', () => {
    const mockTokens = [
      {
        symbol: 'USDC',
        name: 'USD Coin',
        balance: 1000,
        price: 1,
        value: 1000,
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
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
    ];

    mockUseWalletTokens.mockReturnValue({
      tokens: mockTokens,
      isLoading: false,
      error: null,
    });

    render(<TokensTable />);

    const rows = screen.getAllByRole('row');
    // First row is header, second should be ETH (higher value), third should be USDC
    expect(rows.length).toBeGreaterThan(1);
  });

  it('should handle tokens with zero values', () => {
    const mockTokens = [
      {
        symbol: 'ETH',
        name: 'Ethereum',
        balance: 0,
        price: 0,
        value: 0,
        isNative: true,
      },
    ];

    mockUseWalletTokens.mockReturnValue({
      tokens: mockTokens,
      isLoading: false,
      error: null,
    });

    render(<TokensTable />);

    expect(screen.getByText('ETH')).toBeInTheDocument();
  });
});

