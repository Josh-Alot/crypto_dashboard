import { type Address, createPublicClient, http, erc20Abi, getAddress } from 'viem';
import type { Chain } from 'viem';

export interface ERC20TokenInfo {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  balance: bigint;
}

/**
 * Get ERC-20 token information and balance
 */
export async function getERC20TokenInfo(
  tokenAddress: Address,
  ownerAddress: Address,
  chain: Chain
): Promise<ERC20TokenInfo | null> {
  try {
    const normalizedTokenAddress = getAddress(tokenAddress);
    const normalizedOwnerAddress = getAddress(ownerAddress);

    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });

    const [name, symbol, decimals, balance] = await Promise.all([
      publicClient.readContract({
        address: normalizedTokenAddress,
        abi: erc20Abi,
        functionName: 'name',
      }),
      publicClient.readContract({
        address: normalizedTokenAddress,
        abi: erc20Abi,
        functionName: 'symbol',
      }),
      publicClient.readContract({
        address: normalizedTokenAddress,
        abi: erc20Abi,
        functionName: 'decimals',
      }),
      publicClient.readContract({
        address: normalizedTokenAddress,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [normalizedOwnerAddress],
      }),
    ]);

    return {
      address: normalizedTokenAddress,
      name: name as string,
      symbol: symbol as string,
      decimals: decimals as number,
      balance: balance as bigint,
    };
  } catch (error: any) {
    // Only log errors that are not expected (invalid contract, etc.)
    // Don't log ContractFunctionZeroDataError as it's expected for non-contracts
    if (error?.name !== 'ContractFunctionZeroDataError' && 
        error?.cause?.name !== 'ContractFunctionZeroDataError') {
      // Silently skip invalid contracts - this is expected behavior
      // when checking a list of potential token addresses
    }
    return null;
  }
}

/**
 * Get balance of multiple ERC-20 tokens
 */
export async function getMultipleERC20Balances(
  tokenAddresses: Address[],
  ownerAddress: Address,
  chain: Chain
): Promise<ERC20TokenInfo[]> {
  const normalizedTokenAddresses = tokenAddresses.map((address) => getAddress(address));
  const normalizedOwnerAddress = getAddress(ownerAddress);
  
  const results = await Promise.allSettled(
    normalizedTokenAddresses.map((address) => getERC20TokenInfo(address, normalizedOwnerAddress, chain))
  );

  return results
    .filter((result): result is PromiseFulfilledResult<ERC20TokenInfo> => 
      result.status === 'fulfilled' && result.value !== null
    )
    .map((result) => result.value)
    .filter((token) => token.balance > 0n); // Only return tokens with balance > 0
}

