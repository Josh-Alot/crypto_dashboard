import type { Address } from 'viem';
import { getAddress } from 'viem';
import { EXPLORER_APIS } from '../config/explorers';

interface TokenTransfer {
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  value: string;
}

interface ExplorerResponse {
  status: string;
  message: string;
  result: TokenTransfer[] | string;
}

/**
 * Get all unique token addresses from a wallet using Explorer API
 * This method searches for all token transfers (incoming and outgoing)
 * to discover which tokens the wallet has interacted with
 */
export async function getTokenAddressesFromExplorer(
  address: Address,
  chainId: number
): Promise<Address[]> {
  const explorer = EXPLORER_APIS[chainId];
  
  // If explorer is not configured or disabled, return empty array
  if (!explorer || !explorer.enabled) {
    return [];
  }

  const normalizedAddress = getAddress(address);
  const tokenAddresses = new Set<string>();

  try {
    // Method 1: Get token transfers (tokentx) - this finds all tokens the address has interacted with
    const tokenTxUrl = `${explorer.baseUrl}?module=account&action=tokentx&address=${normalizedAddress}&startblock=0&endblock=99999999&sort=asc${explorer.apiKey ? `&apikey=${explorer.apiKey}` : ''}`;
    
    const response = await fetch(tokenTxUrl);
    
    if (!response.ok) {
      console.warn(`Explorer API request failed for chain ${chainId}: ${response.status}`);
      return [];
    }

    const data: ExplorerResponse = await response.json();

    if (data.status === '1' && Array.isArray(data.result)) {
      // Extract unique token contract addresses
      data.result.forEach((tx: TokenTransfer) => {
        if (tx.contractAddress) {
          try {
            // Normalize address to checksum format
            const normalized = getAddress(tx.contractAddress);
            tokenAddresses.add(normalized.toLowerCase());
          } catch (error) {
            // Skip invalid addresses
            console.warn(`Invalid token address: ${tx.contractAddress}`);
          }
        }
      });
    } else if (data.status === '0') {
      // API returned an error
      if (data.message.includes('rate limit') || data.message.includes('Max rate limit')) {
        console.warn(`Explorer API rate limit reached for chain ${chainId}`);
      } else if (data.message.includes('Invalid API Key')) {
        console.warn(`Invalid API key for explorer on chain ${chainId}`);
      } else {
        console.warn(`Explorer API error for chain ${chainId}: ${data.message}`);
      }
      return [];
    }

    return Array.from(tokenAddresses).map((addr) => getAddress(addr)) as Address[];
  } catch (error) {
    console.error(`Error fetching tokens from explorer for chain ${chainId}:`, error);
    return [];
  }
}

