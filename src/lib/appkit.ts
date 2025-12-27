import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient } from '@tanstack/react-query'
import { mainnet, base, arbitrum, polygon, optimism } from '@reown/appkit/networks'

type AppKitNetwork = import('@reown/appkit-common').AppKitNetwork

export const queryClient = new QueryClient()
export const projectId = import.meta.env.VITE_REOWN_PROJECT_ID as string

const metadata = {
  name: 'Crypto Portfolio DApp',
  description: 'Cryptocurrencies Portfolio Dashboard',
  url: import.meta.env.PROJECT_URL || 'https://crypto-dashboard.pages.dev',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
}

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, base, arbitrum, polygon, optimism];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
})

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
  themeVariables: {
    '--apkt-font-family': 'Roboto Flex, sans-serif',
    '--apkt-accent': '#10b981', // cor de destaque
    '--apkt-color-mix': '#10b981', // cor de fundo
    '--apkt-border-radius-master': '12px', // bordas arredondadas
  },
})

export const wagmiConfig = wagmiAdapter.wagmiConfig