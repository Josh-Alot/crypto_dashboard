import { mockTokens } from '../../mocks/tokens';
import TokenRow from './TokenRow';

function TokensTable() {
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

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-4 px-4 text-slate-400 font-medium">Token</th>
            <th className="text-right py-4 px-4 text-slate-400 font-medium">Saldo</th>
            <th className="text-right py-4 px-4 text-slate-400 font-medium">Preço</th>
            <th className="text-right py-4 px-4 text-slate-400 font-medium">Valor</th>
          </tr>
        </thead>
        <tbody>
          {mockTokens.map((token, index) => (
            <TokenRow
              key={token.symbol}
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

