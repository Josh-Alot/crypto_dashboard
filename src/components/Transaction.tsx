import { formatUnits } from 'viem';
import type { Transaction } from '../services/explorerApi';
import { NATIVE_TOKEN_SYMBOLS } from '../config/popularTokens';

interface TransactionRowProps {
  tx: Transaction;
  address: string;
  chainId: number;
  index: number;
}

function TransactionRow({ tx, address, chainId, index }: TransactionRowProps) {
  const isOutgoing = tx.from.toLowerCase() === address.toLowerCase();
  const isError = tx.isError === '1' || tx.txreceipt_status === '0';

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatValue = (value: string) => {
    const ethValue = parseFloat(formatUnits(BigInt(value), 18));
    if (ethValue === 0) return '0';
    if (ethValue < 0.0001) return '< 0.0001';
    return ethValue.toFixed(6);
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  const getExplorerUrl = (hash: string) => {
    const explorerUrls: Record<number, string> = {
      1: 'https://etherscan.io/tx/',
      8453: 'https://basescan.org/tx/',
      137: 'https://polygonscan.com/tx/',
      42161: 'https://arbiscan.io/tx/',
      10: 'https://optimistic.etherscan.io/tx/',
    };
    return `${explorerUrls[chainId] || 'https://etherscan.io/tx/'}${hash}`;
  };

  return (
    <tr
      className={`border-b border-slate-800 hover:bg-slate-800/50 transition-colors ${
        index % 2 === 0 ? 'bg-slate-900' : 'bg-slate-900/50'
      }`}
    >
      <td className="py-4 px-4">
        <a
          href={getExplorerUrl(tx.hash)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 font-mono text-sm flex items-center gap-2"
        >
          {truncateHash(tx.hash)}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </td>
      <td className="py-4 px-4">
        <div className="flex flex-col">
          <span className={`text-sm font-mono ${isOutgoing ? 'text-red-400' : 'text-emerald-400'}`}>
            {isOutgoing ? '→' : '←'} {truncateHash(isOutgoing ? tx.to : tx.from)}
          </span>
        </div>
      </td>
      <td className="text-right py-4 px-4 text-white font-mono text-sm">
        {formatValue(tx.value)} {NATIVE_TOKEN_SYMBOLS[chainId]}
      </td>
      <td className="text-right py-4 px-4">
        <span
          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
            isError
              ? 'bg-red-500/20 text-red-400'
              : 'bg-emerald-500/20 text-emerald-400'
          }`}
        >
          {isError ? 'Failed' : 'Success'}
        </span>
      </td>
      <td className="text-right py-4 px-4 text-slate-400 text-sm">
        {formatDate(tx.timeStamp)}
      </td>
    </tr>
  );
}

export default TransactionRow;

