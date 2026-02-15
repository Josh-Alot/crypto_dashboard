import type { Address } from 'viem';
import { getAddress } from 'viem';
import { EXPLORER_APIS } from '../config/explorers';

/** ERC-20 token transfer from Etherscan tokentx endpoint (includes tx fields) */
export interface TokenTransfer {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  gasUsed?: string;
  gasPrice?: string;
  txreceipt_status?: string;
  isError?: string;
}

export interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  isError: string;
  txreceipt_status: string;
}

interface ExplorerResponse {
  status: string;
  message: string;
  result: TokenTransfer[] | Transaction[] | string;
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
    // API V2: uses chainid parameter instead of module
    const tokenTxUrl = `${explorer.baseUrl}?chainid=${explorer.chainId}&module=account&action=tokentx&address=${normalizedAddress}&startblock=0&endblock=99999999&sort=asc${explorer.apiKey ? `&apikey=${explorer.apiKey}` : ''}`;
    
    const response = await fetch(tokenTxUrl);
    
    if (!response.ok) {
      console.warn(`Explorer API request failed for chain ${chainId}: ${response.status}`);
      return [];
    }

    const data: ExplorerResponse = await response.json();

    if (data.status === '1' && Array.isArray(data.result)) {
      // Extract unique token contract addresses
      // Type guard: token transfers have contractAddress property
      const tokenTransfers = data.result.filter((tx): tx is TokenTransfer => 
        typeof tx === 'object' && tx !== null && 'contractAddress' in tx
      );
      
      tokenTransfers.forEach((tx) => {
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
      // API returned an error - check both message and result string
      const errorMessage = data.message?.toLowerCase() || '';
      const errorResult = typeof data.result === 'string' ? data.result.toLowerCase() : '';
      const combinedError = `${errorMessage} ${errorResult}`.trim();
      
      if (combinedError.includes('rate limit') || combinedError.includes('max rate limit') || combinedError.includes('rate limit exceeded')) {
        console.warn(`Explorer API rate limit reached for chain ${chainId}. Result: ${data.result}`);
      } else if (combinedError.includes('invalid api key') || combinedError.includes('api key') || errorResult.includes('invalid api key')) {
        console.warn(`Invalid API key for explorer on chain ${chainId}. Result: ${data.result}`);
      } else {
        console.warn(`Explorer API error for chain ${chainId}:`, {
          message: data.message,
          result: data.result
        });
      }
      return [];
    }

    return Array.from(tokenAddresses).map((addr) => getAddress(addr)) as Address[];
  } catch (error) {
    console.error(`Error fetching tokens from explorer for chain ${chainId}:`, error);
    return [];
  }
}

/**
 * Get the latest transactions for a wallet address using Explorer API
 * Returns the most recent transactions (sorted by descending block number)
 */
export async function getWalletTransactions(
  address: Address,
  chainId: number,
  limit: number = 10
): Promise<Transaction[]> {
  const explorer = EXPLORER_APIS[chainId];
  
  // If explorer is not configured or disabled, return empty array
  if (!explorer || !explorer.enabled) {
    console.warn(`Explorer is not configured or disabled for chain ${chainId}`);
    return [];
  }

  const normalizedAddress = getAddress(address);

  try {
    // Get normal transactions (txlist) - sorted by descending block number to get latest first
    // API V2: requires both chainid and module parameters
    const txUrl = `${explorer.baseUrl}?chainid=${explorer.chainId}&module=account&action=txlist&address=${normalizedAddress}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc${explorer.apiKey ? `&apikey=${explorer.apiKey}` : ''}`;
    
    console.log(`Fetching transactions from explorer for chain ${chainId}: ${txUrl}`);

    const response = await fetch(txUrl);
    
    if (!response.ok) {
      console.warn(`Explorer API request failed for chain ${chainId}: ${response.status}`);
      return [];
    }

    const data: ExplorerResponse = await response.json();

    if (data.status === '1' && Array.isArray(data.result)) {
      // Filter out invalid transactions and return up to limit
      const transactions = data.result
        .filter((tx): tx is Transaction => {
          return typeof tx === 'object' && tx !== null && 'hash' in tx && 'blockNumber' in tx;
        })
        .slice(0, limit);
      
      console.log(`Filtered ${transactions.length} valid transactions out of ${data.result.length} total`);
      return transactions;
    } else if (data.status === '1' && typeof data.result === 'string') {
      console.log(`No transactions found (string response): ${data.result}`);
      return [];
    } else if (data.status === '0') {
      // API returned an error - check both message and result string
      const errorMessage = data.message?.toLowerCase() || '';
      const errorResult = typeof data.result === 'string' ? data.result.toLowerCase() : '';
      const combinedError = `${errorMessage} ${errorResult}`.trim();
      
      if (combinedError.includes('rate limit') || combinedError.includes('max rate limit') || combinedError.includes('rate limit exceeded')) {
        console.warn(`Explorer API rate limit reached for chain ${chainId}. Result: ${data.result}`);
      } else if (combinedError.includes('invalid api key') || combinedError.includes('api key') || errorResult.includes('invalid api key')) {
        console.warn(`Invalid API key for explorer on chain ${chainId}. Result: ${data.result}`);
      } else if (combinedError.includes('no transactions found') || 
                 combinedError.includes('no transaction found') ||
                 errorResult.includes('no transactions found')) {
        // This is not really an error, just means no transactions
        console.log(`No transactions found for address ${normalizedAddress} on chain ${chainId}`);
        return [];
      } else {
        // Log the full error details for debugging
        console.warn(`Explorer API error for chain ${chainId}:`, {
          message: data.message,
          result: data.result,
          fullResponse: data
        });
      }
      return [];
    } else {
      console.warn(`Unexpected response format from explorer API for chain ${chainId}:`, {
        status: data.status,
        message: data.message,
        resultType: typeof data.result,
        result: data.result
      });
      return [];
    }
  } catch (error) {
    console.error(`Error fetching transactions from explorer for chain ${chainId}:`, error);
    return [];
  }
}

export async function getWalletTokenTransactions(
  address: Address,
  chainId: number,
  limit: number = 10
): Promise<TokenTransfer[]> {
  const explorer = EXPLORER_APIS[chainId];
  
  // If explorer is not configured or disabled, return empty array
  if (!explorer || !explorer.enabled) {
    console.warn(`Explorer is not configured or disabled for chain ${chainId}`);
    return [];
  }

  const normalizedAddress = getAddress(address);

  try {
    // Get normal transactions (txlist) - sorted by descending block number to get latest first
    // API V2: requires both chainid and module parameters
    const txUrl = `${explorer.baseUrl}?chainid=${explorer.chainId}&module=account&action=tokentx&address=${normalizedAddress}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc${explorer.apiKey ? `&apikey=${explorer.apiKey}` : ''}`;
    
    console.log(`Fetching token transactions from explorer for chain ${chainId}: ${txUrl}`);

    const response = await fetch(txUrl);
    
    if (!response.ok) {
      console.warn(`Explorer API request failed for chain ${chainId}: ${response.status}`);
      return [];
    }

    const data: ExplorerResponse = await response.json();

    if (data.status === '1' && Array.isArray(data.result)) {
      const tokenTransactions = data.result
        .filter((tx): tx is TokenTransfer =>
          typeof tx === 'object' && tx !== null && 'contractAddress' in tx && 'tokenSymbol' in tx && 'value' in tx && 'hash' in tx
        )
        .slice(0, limit);
      
      console.log(`Filtered ${tokenTransactions.length} valid token transactions out of ${data.result.length} total`);
      return tokenTransactions;
    } else if (data.status === '1' && typeof data.result === 'string') {
      console.log(`No token transactions found (string response): ${data.result}`);
      return [];
    } else if (data.status === '0') {
      // API returned an error - check both message and result string
      const errorMessage = data.message?.toLowerCase() || '';
      const errorResult = typeof data.result === 'string' ? data.result.toLowerCase() : '';
      const combinedError = `${errorMessage} ${errorResult}`.trim();
      
      if (combinedError.includes('rate limit') || combinedError.includes('max rate limit') || combinedError.includes('rate limit exceeded')) {
        console.warn(`Explorer API rate limit reached for chain ${chainId}. Result: ${data.result}`);
      } else if (combinedError.includes('invalid api key') || combinedError.includes('api key') || errorResult.includes('invalid api key')) {
        console.warn(`Invalid API key for explorer on chain ${chainId}. Result: ${data.result}`);
      } else if (combinedError.includes('no transactions found') || 
                 combinedError.includes('no transaction found') ||
                 errorResult.includes('no transactions found')) {
        // This is not really an error, just means no transactions
        console.log(`No token transactions found for address ${normalizedAddress} on chain ${chainId}`);
        return [];
      } else {
        // Log the full error details for debugging
        console.warn(`Explorer API error for chain ${chainId}:`, {
          message: data.message,
          result: data.result,
          fullResponse: data
        });
      }
      return [];
    } else {
      console.warn(`Unexpected response format from explorer API for chain ${chainId}:`, {
        status: data.status,
        message: data.message,
        resultType: typeof data.result,
        result: data.result
      });
      return [];
    }
  } catch (error) {
    console.error(`Error fetching token transactions from explorer for chain ${chainId}:`, error);
    return [];
  }
}

