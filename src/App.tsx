import { useConnection } from 'wagmi'
import Header from './components/Header'
import WalletButton from './components/WalletButton'
import TokensTable from './components/TokensTable'
import PortfolioTotal from './components/PortfolioTotal'
import { useWalletTokens } from './hooks/useWalletTokens'

function App() {
  const { isConnected } = useConnection();
  const { tokens, isLoading } = useWalletTokens();

  return (
    <div className="min-h-screen min-w-screen bg-slate-900 p-6 md:p-8">
      <div className="w-screen -mx-6 md:-mx-8 -mt-6 md:-mt-8">
        <Header />
      </div>
      <div className="max-w-7xl mx-auto pt-6 md:pt-8">
        <main style={{ paddingTop: '2rem', paddingBottom: '2rem', paddingLeft: '1.3rem', paddingRight: '1.3rem' }}>
          <h1 className="text-5xl font-medium text-white py-12">Dashboard</h1>

          {!isConnected ? (
            <div className="flex flex-col items-center gap-4 w-full">
              <h3 className="text-3xl font-medium text-white">Please connect your wallet to see your assets</h3>
              <WalletButton />
            </div>
          ) : (
            <div className="w-full">
              <PortfolioTotal tokens={tokens} isLoading={isLoading} />
              <h2 className="text-3xl font-medium text-white mb-6">Your Assets</h2>
              <TokensTable />
            </div>
          )}
          
        </main>
      </div>
    </div>
  )
}

export default App
