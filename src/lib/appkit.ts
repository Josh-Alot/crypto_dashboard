import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient } from '@tanstack/react-query'
import { mainnet } from '@reown/appkit/networks'

type AppKitNetwork = import('@reown/appkit-common').AppKitNetwork

export const queryClient = new QueryClient()
export const projectId = import.meta.env.REOWN_PROJECT_ID as string

const metadata = {
  name: 'Crypto Portfolio DApp',
  description: 'Cryptocurrencies Portfolio Dashboard',
  url: import.meta.env.PROJECT_URL,
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
}

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet];

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
})

export const wagmiConfig = wagmiAdapter.wagmiConfig