import { render, screen } from '@testing-library/react';
import PortfolioTotal from '../PortfolioTotal';
import type { Token } from '../../types/token';

describe('PortfolioTotal', () => {
  const mockTokens: Token[] = [
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
      isNative: false,
    },
  ];

  it('should display total portfolio value', () => {
    render(<PortfolioTotal tokens={mockTokens} isLoading={false} />);

    expect(screen.getByText('Total Portfolio Value')).toBeInTheDocument();
    expect(screen.getByText('$4,750.00')).toBeInTheDocument();
  });

  it('should display token count', () => {
    render(<PortfolioTotal tokens={mockTokens} isLoading={false} />);

    expect(screen.getByText('Tokens')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<PortfolioTotal tokens={mockTokens} isLoading={true} />);

    expect(screen.getByText('Total Portfolio Value')).toBeInTheDocument();
    // Check for loading skeleton
    const loadingElement = screen.getByText('Total Portfolio Value').parentElement;
    expect(loadingElement?.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should calculate total correctly with zero values', () => {
    const tokensWithZero: Token[] = [
      {
        symbol: 'ETH',
        name: 'Ethereum',
        balance: 0,
        price: 2500,
        value: 0,
        isNative: true,
      },
    ];

    render(<PortfolioTotal tokens={tokensWithZero} isLoading={false} />);

    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('should handle empty tokens array', () => {
    render(<PortfolioTotal tokens={[]} isLoading={false} />);

    expect(screen.getByText('Total Portfolio Value')).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should format currency correctly', () => {
    const tokensWithLargeValue: Token[] = [
      {
        symbol: 'ETH',
        name: 'Ethereum',
        balance: 100,
        price: 2500,
        value: 250000,
        isNative: true,
      },
    ];

    render(<PortfolioTotal tokens={tokensWithLargeValue} isLoading={false} />);

    expect(screen.getByText('$250,000.00')).toBeInTheDocument();
  });

  it('should handle tokens with undefined values', () => {
    const tokensWithUndefined: Token[] = [
      {
        symbol: 'ETH',
        name: 'Ethereum',
        balance: 1,
        price: 2500,
        value: undefined as any,
        isNative: true,
      },
    ];

    render(<PortfolioTotal tokens={tokensWithUndefined} isLoading={false} />);

    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });
});

