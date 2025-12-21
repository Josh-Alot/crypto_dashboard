import { useConnection } from 'wagmi'
import HeaderLogo from './HeaderLogo'
import WalletButton from "./WalletButton"
import BlockchainScanButton from './BlockchainScanButton';
import RefreshButton from './RefreshButton';

function Header() {
    const { address, isConnected } = useConnection();

    return (
        <header 
            className="flex flex-row items-center justify-between w-screen bg-slate-900 border border-slate-800 rounded-xl shadow-sm"
            style={{ paddingTop: '2rem', paddingBottom: '2rem', paddingLeft: '1.3rem', paddingRight: '1.3rem' }}
        >   
            <HeaderLogo />
            
            <div className="flex flex-row items-center gap-3 flex-shrink-0">
                {isConnected && address && (
                    <>
                        <RefreshButton />
                        <BlockchainScanButton /> 
                    </>
                )}
                
                <div className="flex-shrink-0">
                    <WalletButton />
                </div>
            </div>
        </header>
    )
}

export default Header