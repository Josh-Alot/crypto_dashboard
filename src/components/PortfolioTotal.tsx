import type { Token } from '../types/token';

interface PortfolioTotalProps {
  tokens: Token[];
  isLoading?: boolean;
}

function PortfolioTotal({ tokens, isLoading }: PortfolioTotalProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const totalValue = tokens.reduce((sum, token) => sum + (token.value || 0), 0);

  if (isLoading) {
    return (
      <div className="mb-8 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm mb-1">Total Portfolio Value</p>
            <div className="h-8 w-32 bg-slate-700 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">Total Portfolio Value</p>
          <p className="text-3xl font-semibold text-white">{formatCurrency(totalValue)}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-sm mb-1">Tokens</p>
          <p className="text-xl font-medium text-white">{tokens.length}</p>
        </div>
      </div>
    </div>
  );
}

export default PortfolioTotal;

