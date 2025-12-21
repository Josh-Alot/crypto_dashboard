import type { Token } from '../../mocks/tokens';

interface TokenRowProps {
  token: Token;
  index: number;
  formatCurrency: (value: number) => string;
  formatBalance: (value: number) => string;
}

function TokenRow({ token, index, formatCurrency, formatBalance }: TokenRowProps) {
  return (
    <tr
      className={`border-b border-slate-800 hover:bg-slate-800/50 transition-colors ${
        index % 2 === 0 ? 'bg-slate-900' : 'bg-slate-900/50'
      }`}
    >
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-700 text-white text-sm font-medium">
            {token.symbol.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-white font-medium">{token.symbol}</span>
            <span className="text-slate-400 text-sm">{token.name}</span>
          </div>
        </div>
      </td>
      <td className="text-right py-4 px-4 text-white font-mono">
        {formatBalance(token.balance)}
      </td>
      <td className="text-right py-4 px-4 text-white font-mono">
        {formatCurrency(token.price)}
      </td>
      <td className="text-right py-4 px-4 text-white font-mono font-medium">
        {formatCurrency(token.value)}
      </td>
    </tr>
  );
}

export default TokenRow;

