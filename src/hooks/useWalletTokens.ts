import { useConnection, useBalance, useChainId } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { formatUnits, getAddress } from 'viem';
import { getMultipleERC20Balances } from '../services/erc20';
import { getTokenPrices } from '../services/coingecko';
import { getTokenAddressesFromExplorer } from '../services/explorerApi';
import { NATIVE_TOKEN_SYMBOLS, NATIVE_TOKEN_NAMES } from '../config/popularTokens';
import type { Token } from '../types/token';
import { useConfig } from 'wagmi';

export function useWalletTokens() {
  const { address, isConnected } = useConnection();
  const chainId = useChainId();
  const config = useConfig();
  const chain = config.chains.find((c) => c.id === chainId);

  const { data: nativeBalance, isLoading: isLoadingNative } = useBalance({
    address,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 30000,
    },
  });

  const {
    data: tokens,
    isLoading: isLoadingTokens,
    error,
    refetch,
  } = useQuery({
    queryKey: ['wallet-tokens', address, chainId, nativeBalance?.value.toString()],
    queryFn: async (): Promise<Token[]> => {
      if (!address || !chain) {
        return [];
      }

      const allTokens: Token[] = [];

      if (nativeBalance) {
        const nativeSymbol = NATIVE_TOKEN_SYMBOLS[chainId] || 'ETH';
        const nativeName = NATIVE_TOKEN_NAMES[chainId] || 'Ethereum';
        const nativeBalanceFormatted = parseFloat(formatUnits(nativeBalance.value, nativeBalance.decimals));


        if (nativeBalance.value > 0n) {
          allTokens.push({
            symbol: nativeSymbol,
            name: nativeName,
            balance: nativeBalanceFormatted,
            price: 0,
            value: 0,
            isNative: true,
            decimals: nativeBalance.decimals,
          });
        }
      }

      const normalizedOwnerAddress = getAddress(address);
      const tokenAddresses = await getTokenAddressesFromExplorer(normalizedOwnerAddress, chainId);
      
      if (tokenAddresses.length > 0) {
        const erc20Tokens = await getMultipleERC20Balances(
          tokenAddresses,
          normalizedOwnerAddress,
          chain
        );

        for (const token of erc20Tokens) {
          const balanceFormatted = parseFloat(formatUnits(token.balance, token.decimals));
          allTokens.push({
            symbol: token.symbol,
            name: token.name,
            balance: balanceFormatted,
            price: 0,
            value: 0,
            address: token.address,
            decimals: token.decimals,
            isNative: false,
          });
        }
      }

      const symbols = allTokens.map((t) => t.symbol);
      const prices = await getTokenPrices(symbols, chainId);

      return allTokens.map((token) => {
        const price = prices[token.symbol.toUpperCase()] || 0;
        const value = price * token.balance;

        return {
          ...token,
          price,
          value,
        };
      });
    },
    enabled: isConnected && !!address && !!chain && !isLoadingNative,
    refetchInterval: 60000,
    staleTime: 30000,
  });

  return {
    tokens: tokens || [],
    isLoading: isLoadingNative || isLoadingTokens,
    error,
    refetch,
  };
}

