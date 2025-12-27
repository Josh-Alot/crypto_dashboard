import { NATIVE_TOKEN_SYMBOLS, NATIVE_TOKEN_NAMES } from '../popularTokens';

describe('popularTokens config', () => {
  describe('NATIVE_TOKEN_SYMBOLS', () => {
    it('should have correct symbols for Ethereum mainnet', () => {
      expect(NATIVE_TOKEN_SYMBOLS[1]).toBe('ETH');
    });

    it('should have correct symbols for Polygon', () => {
      expect(NATIVE_TOKEN_SYMBOLS[137]).toBe('MATIC');
    });

    it('should have correct symbols for BSC', () => {
      expect(NATIVE_TOKEN_SYMBOLS[56]).toBe('BNB');
    });

    it('should have correct symbols for Avalanche', () => {
      expect(NATIVE_TOKEN_SYMBOLS[43114]).toBe('AVAX');
    });

    it('should have correct symbols for Optimism', () => {
      expect(NATIVE_TOKEN_SYMBOLS[10]).toBe('ETH');
    });

    it('should have correct symbols for Arbitrum', () => {
      expect(NATIVE_TOKEN_SYMBOLS[42161]).toBe('ETH');
    });

    it('should have correct symbols for Base', () => {
      expect(NATIVE_TOKEN_SYMBOLS[8453]).toBe('ETH');
    });

    it('should have all required chain IDs', () => {
      const requiredChainIds = [1, 137, 56, 43114, 10, 42161, 8453];
      
      requiredChainIds.forEach(chainId => {
        expect(NATIVE_TOKEN_SYMBOLS[chainId]).toBeDefined();
        expect(typeof NATIVE_TOKEN_SYMBOLS[chainId]).toBe('string');
      });
    });
  });

  describe('NATIVE_TOKEN_NAMES', () => {
    it('should have correct names for Ethereum mainnet', () => {
      expect(NATIVE_TOKEN_NAMES[1]).toBe('Ethereum');
    });

    it('should have correct names for Polygon', () => {
      expect(NATIVE_TOKEN_NAMES[137]).toBe('Polygon');
    });

    it('should have correct names for BSC', () => {
      expect(NATIVE_TOKEN_NAMES[56]).toBe('BNB');
    });

    it('should have correct names for Avalanche', () => {
      expect(NATIVE_TOKEN_NAMES[43114]).toBe('Avalanche');
    });

    it('should have correct names for Optimism', () => {
      expect(NATIVE_TOKEN_NAMES[10]).toBe('Ethereum');
    });

    it('should have correct names for Arbitrum', () => {
      expect(NATIVE_TOKEN_NAMES[42161]).toBe('Ethereum');
    });

    it('should have correct names for Base', () => {
      expect(NATIVE_TOKEN_NAMES[8453]).toBe('Ethereum');
    });

    it('should have all required chain IDs', () => {
      const requiredChainIds = [1, 137, 56, 43114, 10, 42161, 8453];
      
      requiredChainIds.forEach(chainId => {
        expect(NATIVE_TOKEN_NAMES[chainId]).toBeDefined();
        expect(typeof NATIVE_TOKEN_NAMES[chainId]).toBe('string');
      });
    });
  });

  describe('Consistency between symbols and names', () => {
    it('should have matching chain IDs in both maps', () => {
      const symbolChainIds = Object.keys(NATIVE_TOKEN_SYMBOLS).map(Number);
      const nameChainIds = Object.keys(NATIVE_TOKEN_NAMES).map(Number);

      expect(symbolChainIds.sort()).toEqual(nameChainIds.sort());
    });

    it('should have consistent naming for L2 chains using ETH', () => {
      const ethL2Chains = [10, 42161, 8453];
      
      ethL2Chains.forEach(chainId => {
        expect(NATIVE_TOKEN_SYMBOLS[chainId]).toBe('ETH');
        expect(NATIVE_TOKEN_NAMES[chainId]).toBe('Ethereum');
      });
    });
  });
});

