import { getTokenPrices } from '../coingecko';

// Mock fetch globally
global.fetch = jest.fn();

describe('coingecko service', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('getTokenPrices', () => {
    it('should fetch prices for multiple tokens', async () => {
      const mockResponse = {
        ethereum: { usd: 2500.50 },
        'usd-coin': { usd: 1.00 },
        'tether': { usd: 1.00 },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const symbols = ['ETH', 'USDC', 'USDT'];
      const prices = await getTokenPrices(symbols);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('api.coingecko.com/api/v3/simple/price')
      );
      expect(prices).toEqual({
        ETH: 2500.50,
        USDC: 1.00,
        USDT: 1.00,
      });
    });

    it('should handle native tokens correctly for Ethereum mainnet', async () => {
      const mockResponse = {
        ethereum: { usd: 2500.50 },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const prices = await getTokenPrices(['ETH'], 1);

      expect(prices).toEqual({
        ETH: 2500.50,
      });
    });

    it('should handle native tokens correctly for Polygon', async () => {
      const mockResponse = {
        'matic-network': { usd: 0.85 },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const prices = await getTokenPrices(['MATIC'], 137);

      expect(prices).toEqual({
        MATIC: 0.85,
      });
    });

    it('should handle native tokens correctly for BSC', async () => {
      const mockResponse = {
        binancecoin: { usd: 350.25 },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const prices = await getTokenPrices(['BNB'], 56);

      expect(prices).toEqual({
        BNB: 350.25,
      });
    });

    it('should return empty object when no symbols provided', async () => {
      const prices = await getTokenPrices([]);

      expect(prices).toEqual({});
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
      });

      const prices = await getTokenPrices(['ETH']);

      expect(prices).toEqual({});
    });

    it('should handle network errors gracefully', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const prices = await getTokenPrices(['ETH']);

      expect(prices).toEqual({});
    });

    it('should deduplicate token IDs in request', async () => {
      const mockResponse = {
        ethereum: { usd: 2500.50 },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const symbols = ['ETH', 'ETH', 'ETH'];
      await getTokenPrices(symbols);

      const callUrl = (fetch as jest.Mock).mock.calls[0][0];
      const ethereumCount = (callUrl.match(/ethereum/g) || []).length;
      expect(ethereumCount).toBe(1);
    });

    it('should handle tokens not found in price response', async () => {
      const mockResponse = {
        ethereum: { usd: 2500.50 },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const prices = await getTokenPrices(['ETH', 'USDC']);

      expect(prices).toEqual({
        ETH: 2500.50,
      });
    });

    it('should handle unknown token symbols', async () => {
      const mockResponse = {
        ethereum: { usd: 2500.50 },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const prices = await getTokenPrices(['ETH', 'UNKNOWN']);

      expect(prices).toEqual({
        ETH: 2500.50,
      });
    });

    it('should handle case-insensitive symbols', async () => {
      const mockResponse = {
        ethereum: { usd: 2500.50 },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const prices = await getTokenPrices(['eth', 'ETH', 'Eth']);

      expect(prices).toEqual({
        ETH: 2500.50,
      });
    });
  });
});
