import { useConnection, useBalance, useChainId } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { formatUnits, getAddress } from 'viem';
import { getMultipleERC20Balances } from '../services/erc20';
import { getTokenPrices } from '../services/coingecko';
import { getTokenAddressesFromExplorer } from '../services/explorerApi';
import { NATIVE_TOKEN_SYMBOLS, NATIVE_TOKEN_NAMES } from '../config/popularTokens';
import type { Token } from '../types/token';
import { useConfig } from 'wagmi';

/**
 * Hook to fetch all tokens (native + ERC-20) for the connected wallet
 */
export function useWalletTokens() {
  const { address, isConnected } = useConnection();
  const chainId = useChainId();
  const config = useConfig();
  const chain = config.chains.find((c) => c.id === chainId);

  // Get native token balance
  const { data: nativeBalance, isLoading: isLoadingNative } = useBalance({
    address,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  });

  // Get ERC-20 tokens
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

      // 1. Add native token (always include if balance exists, even if 0)
      if (nativeBalance) {
        const nativeSymbol = NATIVE_TOKEN_SYMBOLS[chainId] || 'ETH';
        const nativeName = NATIVE_TOKEN_NAMES[chainId] || 'Ethereum';
        const nativeBalanceFormatted = parseFloat(formatUnits(nativeBalance.value, nativeBalance.decimals));

        // Only add if balance > 0
        if (nativeBalance.value > 0n) {
          allTokens.push({
            symbol: nativeSymbol,
            name: nativeName,
            balance: nativeBalanceFormatted,
            price: 0, // Will be updated below
            value: 0, // Will be calculated below
            isNative: true,
            decimals: nativeBalance.decimals,
          });
        }
      }

      // 2. Get token addresses from Explorer API (automated discovery)
      const normalizedOwnerAddress = getAddress(address);
      const tokenAddresses = await getTokenAddressesFromExplorer(normalizedOwnerAddress, chainId);
      
      if (tokenAddresses.length > 0) {
        // Get balances for discovered tokens
        const erc20Tokens = await getMultipleERC20Balances(
          tokenAddresses,
          normalizedOwnerAddress,
          chain
        );

        // Add ERC-20 tokens to the list
        for (const token of erc20Tokens) {
          const balanceFormatted = parseFloat(formatUnits(token.balance, token.decimals));
          allTokens.push({
            symbol: token.symbol,
            name: token.name,
            balance: balanceFormatted,
            price: 0, // Will be updated below
            value: 0, // Will be calculated below
            address: token.address,
            decimals: token.decimals,
            isNative: false,
          });
        }
      }

      // 3. Fetch prices for all tokens
      const symbols = allTokens.map((t) => t.symbol);
      const prices = await getTokenPrices(symbols, chainId);

      // 4. Update tokens with prices and calculate values
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
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  return {
    tokens: tokens || [],
    isLoading: isLoadingNative || isLoadingTokens,
    error,
    refetch,
  };
}

