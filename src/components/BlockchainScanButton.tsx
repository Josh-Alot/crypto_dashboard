import { useConnection } from 'wagmi'

function BlockchainScanButton() {
    const { address, isConnected } = useConnection();

    const handleNetworkScan = () => { // TODO: implement a way to verify which EVM is connected
        if (isConnected && address) {
            window.open(`https://etherscan.io/address/${address}`, '_blank');
        }
    };
    
    return (
        <button 
            onClick={handleNetworkScan}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-800/90 text-white text-xs font-medium border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-colors"
            style={{ padding: '0.75rem 1rem' }}
            type="button"
        >
            <span>Etherscan</span>
            <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="flex-shrink-0"
            >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
        </button>
    )
}

export default BlockchainScanButton