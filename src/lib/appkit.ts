import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient } from '@tanstack/react-query'
import { mainnet } from '@reown/appkit/networks'

// 0. QueryClient (React Query)
export const queryClient = new QueryClient()

// 1.  (pegue em https://cloud.walletconnect.com → agora é Reown Dashboard)
export const projectId = import.meta.env.REOWN_PROJECT_ID

// 2. Metadados da sua DApp
const metadata = {
  name: 'Crypto Portfolio DApp',
  description: 'Cryptocurrencies Portfolio Dashboard',
  url: import.meta.env.PROJECT_URL,
  icons: ['https://avatars.githubusercontent.com/u/179229932'], // TODO: create a logo for the Dapp
}

// 3. Redes suportadas (você pode adicionar mais depois)
const networks = [mainnet];

// 4. Criar Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
})

// 5. Criar o modal da AppKit (uma vez só, fora de componente React)
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
})

// 6. Exportar o config Wagmi para usar no provider
export const wagmiConfig = wagmiAdapter.wagmiConfig