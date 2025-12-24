import { useWalletTokens } from '../hooks/useWalletTokens';
import TokenRow from './TokenRow';

function TokensTable() {
  const { tokens, isLoading, error } = useWalletTokens();

  // TODO: setup a way to change currencies
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

  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-400">Loading tokens...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-red-400">Error loading tokens. Please try again.</div>
        </div>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-400">No tokens found in your wallet.</div>
        </div>
      </div>
    );
  }

  const sortedTokens = [...tokens].sort((a, b) => (b.value || 0) - (a.value || 0));

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-4 px-4 text-slate-400 font-medium">Token</th>
            <th className="text-right py-4 px-4 text-slate-400 font-medium">Balance</th>
            <th className="text-right py-4 px-4 text-slate-400 font-medium">Price</th>
            <th className="text-right py-4 px-4 text-slate-400 font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {sortedTokens.map((token, index) => (
            <TokenRow
              key={token.address || token.symbol}
              token={token}
              index={index}
              formatCurrency={formatCurrency}
              formatBalance={formatBalance}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TokensTable;

