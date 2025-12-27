import { render, screen } from '@testing-library/react';
import TokenRow from '../TokenRow';
import type { Token } from '../../types/token';

describe('TokenRow', () => {
  const mockToken: Token = {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: 1.5,
    price: 2500,
    value: 3750,
    isNative: true,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatBalance = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(value);
  };

  const renderInTable = (component: React.ReactElement) => {
    return render(
      <table>
        <tbody>{component}</tbody>
      </table>
    );
  };

  it('should render token information correctly', () => {
    renderInTable(
      <TokenRow
        token={mockToken}
        index={0}
        formatCurrency={formatCurrency}
        formatBalance={formatBalance}
      />
    );

    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('1.50')).toBeInTheDocument();
    expect(screen.getByText('$2,500.00')).toBeInTheDocument();
    expect(screen.getByText('$3,750.00')).toBeInTheDocument();
  });

  it('should display first letter of symbol as avatar', () => {
    renderInTable(
      <TokenRow
        token={mockToken}
        index={0}
        formatCurrency={formatCurrency}
        formatBalance={formatBalance}
      />
    );

    const avatar = screen.getByText('E');
    expect(avatar).toBeInTheDocument();
  });

  it('should apply alternating background colors based on index', () => {
    const { rerender } = renderInTable(
      <TokenRow
        token={mockToken}
        index={0}
        formatCurrency={formatCurrency}
        formatBalance={formatBalance}
      />
    );

    const row = screen.getByText('ETH').closest('tr');
    expect(row).toHaveClass('bg-slate-900');

    rerender(
      <table>
        <tbody>
          <TokenRow
            token={mockToken}
            index={1}
            formatCurrency={formatCurrency}
            formatBalance={formatBalance}
          />
        </tbody>
      </table>
    );

    const rowOdd = screen.getByText('ETH').closest('tr');
    expect(rowOdd).toHaveClass('bg-slate-900/50');
  });

  it('should format large balances correctly', () => {
    const largeToken: Token = {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 1234567.89,
      price: 1,
      value: 1234567.89,
      isNative: false,
    };

    renderInTable(
      <TokenRow
        token={largeToken}
        index={0}
        formatCurrency={formatCurrency}
        formatBalance={formatBalance}
      />
    );

    expect(screen.getByText('1,234,567.89')).toBeInTheDocument();
  });

  it('should handle zero values', () => {
    const zeroToken: Token = {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 0,
      price: 0,
      value: 0,
      isNative: true,
    };

    renderInTable(
      <TokenRow
        token={zeroToken}
        index={0}
        formatCurrency={formatCurrency}
        formatBalance={formatBalance}
      />
    );

    expect(screen.getByText('0.00')).toBeInTheDocument();
    expect(screen.getAllByText('$0.00').length).toBeGreaterThan(0);
  });

  it('should handle ERC20 tokens with address', () => {
    const erc20Token: Token = {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 1000,
      price: 1,
      value: 1000,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      isNative: false,
    };

    renderInTable(
      <TokenRow
        token={erc20Token}
        index={0}
        formatCurrency={formatCurrency}
        formatBalance={formatBalance}
      />
    );

    expect(screen.getByText('USDC')).toBeInTheDocument();
    expect(screen.getByText('USD Coin')).toBeInTheDocument();
  });
});

