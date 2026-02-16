import { useState } from 'react';
import { useConnection, useChainId } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { getWalletTokenTransactions, getWalletTransactions } from '../services/explorerApi';
import type { Transaction, TokenTransfer } from '../services/explorerApi';
import { useWalletTokens } from '../hooks/useWalletTokens';
import TransactionRow from './Transaction';

export type WalletActivity = Transaction | TokenTransfer;

function isTokenTransfer(tx: Transaction | TokenTransfer): tx is TokenTransfer {
  return 'contractAddress' in tx && 'tokenSymbol' in tx && 'tokenDecimal' in tx;
}

function RecentTransactions() {
  const { address, isConnected } = useConnection();
  const chainId = useChainId();
  const { tokens } = useWalletTokens();
  const [showZeroValueTokenTxs, setShowZeroValueTokenTxs] = useState(false);

  const {
    data: activities,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['wallet-transactions', address, chainId],
    queryFn: async (): Promise<WalletActivity[]> => {
      if (!address) {
        return [];
      }

      const [normalTxs, tokenTxs] = await Promise.all([
        getWalletTransactions(address, chainId, 15),
        getWalletTokenTransactions(address, chainId, 15),
      ]);

      const merged: WalletActivity[] = [...normalTxs, ...tokenTxs];
      merged.sort((a, b) => {
        const tsA = parseInt('timeStamp' in a ? a.timeStamp : '0', 10);
        const tsB = parseInt('timeStamp' in b ? b.timeStamp : '0', 10);
        return tsB - tsA;
      });
      return merged.slice(0, 20);
    },
    enabled: isConnected && !!address,
    refetchInterval: 60000, // Refetch every minute
  });


  if (!isConnected || !address) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="mt-8 mb-8 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
        <h2 className="text-2xl font-medium text-white mb-4">Last Transactions</h2>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-700 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 mb-8 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
        <h2 className="text-2xl font-medium text-white mb-4">Last Transactions</h2>
        <p className="text-slate-400">There was an error loading the transactions. Please try again later.</p>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="mt-8 mb-8 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
        <h2 className="text-2xl font-medium text-white mb-4">Last Transactions</h2>
        <p className="text-slate-400">No transactions found.</p>
      </div>
    );
  }

  const zeroValueTokenAddresses = new Set(
    tokens
      .filter((token) => (token.value || 0) === 0)
      .map((token) => token.address?.toLowerCase())
      .filter((address): address is string => !!address)
  );

  const hasZeroValueTokenTxs = activities.some(
    (tx) => isTokenTransfer(tx) && zeroValueTokenAddresses.has(tx.contractAddress.toLowerCase())
  );

  const filteredActivities = showZeroValueTokenTxs
    ? activities
    : activities.filter(
        (tx) => !isTokenTransfer(tx) || !zeroValueTokenAddresses.has(tx.contractAddress.toLowerCase())
      );

  return (
    <div className="mt-8 mb-8 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-medium text-white">Last Transactions</h2>
        {hasZeroValueTokenTxs && (
          <label className="flex items-center gap-2 text-slate-400 text-sm cursor-pointer hover:text-slate-300">
            <input
              type="checkbox"
              checked={showZeroValueTokenTxs}
              onChange={(e) => setShowZeroValueTokenTxs(e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-800"
            />
            Show transactions from possible scam tokens
          </label>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Hash</th>
              <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">From/To</th>
              <th className="text-right py-3 px-4 text-slate-400 text-sm font-medium">Value</th>
              <th className="text-right py-3 px-4 text-slate-400 text-sm font-medium">Gas</th>
              <th className="text-right py-3 px-4 text-slate-400 text-sm font-medium">Status</th>
              <th className="text-right py-3 px-4 text-slate-400 text-sm font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((activity: WalletActivity, index: number) => (
              <TransactionRow
                key={'contractAddress' in activity
                  ? `${activity.hash}-${activity.contractAddress}-${activity.value}-${index}`
                  : activity.hash}
                tx={activity}
                address={address}
                chainId={chainId}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentTransactions;

