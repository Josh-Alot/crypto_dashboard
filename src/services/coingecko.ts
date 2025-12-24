// CoinGecko API service for fetching token prices
// Free tier: 10-50 calls/minute

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// Mapping of common token symbols to CoinGecko IDs
const TOKEN_ID_MAP: Record<string, string> = {
  'ETH': 'ethereum',
  'MATIC': 'matic-network',
  'BNB': 'binancecoin',
  'AVAX': 'avalanche-2',
  'OP': 'optimism',
  'ARB': 'arbitrum',
  'USDC': 'usd-coin',
  'USDT': 'tether',
  'DAI': 'dai',
  'WBTC': 'wrapped-bitcoin',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'AAVE': 'aave',
  'CRV': 'curve-dao-token',
  'MKR': 'maker',
  'SNX': 'havven',
  'COMP': 'compound-governance-token',
  'YFI': 'yearn-finance',
  'SUSHI': 'sushi',
  '1INCH': '1inch',
  'BAL': 'balancer',
  'BAT': 'basic-attention-token',
  'ZRX': '0x',
  'ENJ': 'enjincoin',
  'MANA': 'decentraland',
  'SAND': 'the-sandbox',
  'AXS': 'axie-infinity',
  'GALA': 'gala',
  'CHZ': 'chiliz',
  'FTM': 'fantom',
  'NEAR': 'near',
  'SOL': 'solana',
  'ADA': 'cardano',
  'DOT': 'polkadot',
  'ATOM': 'cosmos',
  'ALGO': 'algorand',
  'XRP': 'ripple',
  'DOGE': 'dogecoin',
  'SHIB': 'shiba-inu',
  'PEPE': 'pepe',
  'FLOKI': 'floki',
};

// Network-specific native token IDs
const NATIVE_TOKEN_IDS: Record<number, string> = {
  1: 'ethereum', // Ethereum Mainnet
  137: 'matic-network', // Polygon
  56: 'binancecoin', // BSC
  43114: 'avalanche-2', // Avalanche
  10: 'ethereum', // Optimism (uses ETH)
  42161: 'ethereum', // Arbitrum (uses ETH)
  8453: 'ethereum', // Base (uses ETH)
};

export interface CoinGeckoPriceResponse {
  [tokenId: string]: {
    usd: number;
  };
}

/**
 * Get token price from CoinGecko by symbol
 */
export async function getTokenPrice(symbol: string, chainId?: number): Promise<number | null> {
  try {
    // For native tokens, use chain-specific ID
    if (chainId && NATIVE_TOKEN_IDS[chainId] && (symbol === 'ETH' || symbol === 'MATIC' || symbol === 'BNB' || symbol === 'AVAX')) {
      const tokenId = NATIVE_TOKEN_IDS[chainId];
      const response = await fetch(
        `${COINGECKO_API_BASE}/simple/price?ids=${tokenId}&vs_currencies=usd`
      );
      
      if (!response.ok) {
        console.error(`CoinGecko API error: ${response.status}`);
        return null;
      }
      
      const data: CoinGeckoPriceResponse = await response.json();
      return data[tokenId]?.usd ?? null;
    }

    // For ERC-20 tokens, try to find CoinGecko ID
    const tokenId = TOKEN_ID_MAP[symbol.toUpperCase()];
    if (!tokenId) {
      console.warn(`Token ${symbol} not found in CoinGecko ID map`);
      return null;
    }

    const response = await fetch(
      `${COINGECKO_API_BASE}/simple/price?ids=${tokenId}&vs_currencies=usd`
    );

    if (!response.ok) {
      console.error(`CoinGecko API error: ${response.status}`);
      return null;
    }

    const data: CoinGeckoPriceResponse = await response.json();
    return data[tokenId]?.usd ?? null;
  } catch (error) {
    console.error('Error fetching token price from CoinGecko:', error);
    return null;
  }
}

/**
 * Get multiple token prices in a single request
 */
export async function getTokenPrices(symbols: string[], chainId?: number): Promise<Record<string, number>> {
  try {
    const tokenIds: string[] = [];
    const symbolToIdMap: Record<string, string> = {};

    for (const symbol of symbols) {
      let tokenId: string | undefined;

      // Handle native tokens
      if (chainId && NATIVE_TOKEN_IDS[chainId] && (symbol === 'ETH' || symbol === 'MATIC' || symbol === 'BNB' || symbol === 'AVAX')) {
        tokenId = NATIVE_TOKEN_IDS[chainId];
      } else {
        tokenId = TOKEN_ID_MAP[symbol.toUpperCase()];
      }

      if (tokenId && !tokenIds.includes(tokenId)) {
        tokenIds.push(tokenId);
        symbolToIdMap[symbol.toUpperCase()] = tokenId;
      }
    }

    if (tokenIds.length === 0) {
      return {};
    }

    const response = await fetch(
      `${COINGECKO_API_BASE}/simple/price?ids=${tokenIds.join(',')}&vs_currencies=usd`
    );

    if (!response.ok) {
      console.error(`CoinGecko API error: ${response.status}`);
      return {};
    }

    const data: CoinGeckoPriceResponse = await response.json();
    const prices: Record<string, number> = {};

    for (const [symbol, tokenId] of Object.entries(symbolToIdMap)) {
      if (data[tokenId]?.usd) {
        prices[symbol] = data[tokenId].usd;
      }
    }

    return prices;
  } catch (error) {
    console.error('Error fetching token prices from CoinGecko:', error);
    return {};
  }
}

