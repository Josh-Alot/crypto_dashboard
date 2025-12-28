# Crypto Portfolio DApp

A decentralized application (DApp) for viewing and managing cryptocurrency portfolios. Connect your wallet to see all your tokens (native and ERC-20) across multiple EVM networks.

## Features

- 🔗 Connect multiple wallets (MetaMask, WalletConnect, Coinbase Wallet)
- 💰 View all tokens (native + ERC-20) in your wallet
- 📊 Real-time price updates via CoinGecko API
- 🔍 Automated token discovery via Blockchain Explorer APIs
- 🌐 Multi-chain support (Ethereum, Base, Polygon, Arbitrum, Optimism)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Reown/WalletConnect Project ID (required)
REOWN_PROJECT_ID=your_project_id_here

# Blockchain Explorer API Keys (optional but recommended)
# Get free API keys from:
# - Etherscan: https://etherscan.io/apis
# - Basescan: https://basescan.org/apis
# - Polygonscan: https://polygonscan.com/apis
# - Arbiscan: https://arbiscan.io/apis
# - Optimistic Etherscan: https://optimistic.etherscan.io/apis

ETHERSCAN_API_KEY=your_etherscan_api_key_here
BASESCAN_API_KEY=your_basescan_api_key_here
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
ARBISCAN_API_KEY=your_arbiscan_api_key_here
OPTIMISTIC_ETHERSCAN_API_KEY=your_optimistic_etherscan_api_key_here
```

**Note:** The Explorer API keys are optional. Without them, the app will still work but may have rate limits. With API keys, you get:
- Higher rate limits
- More reliable token discovery
- Better performance

### 3. Run Development Server

```bash
npm run dev
```

## How Token Discovery Works

The app uses **Blockchain Explorer APIs** to automatically discover all tokens in your wallet:

1. **Explorer API**: Queries the blockchain explorer (Etherscan, Basescan, etc.) to find all token transfers associated with your wallet address
2. **Token Information**: Fetches token metadata (name, symbol, decimals) directly from the blockchain
3. **Balance Check**: Verifies current token balances
4. **Price Fetching**: Gets real-time prices from CoinGecko API

This approach is more automated than maintaining a hardcoded list of tokens and will discover any token your wallet has interacted with.

## Tech Stack

- **React** + **TypeScript** + **Vite**
- **wagmi** + **viem** for Web3 interactions
- **Reown AppKit** for wallet connections
- **TanStack Query** for data fetching and caching
- **Tailwind CSS** for styling

## Deploy

This project is configured for deployment on Cloudflare Pages.

For detailed deployment instructions, see:
- [DEPLOY.md](DEPLOY.md) - Complete deployment guide
- [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md) - Setup checklist

---

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
