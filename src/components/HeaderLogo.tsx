import { useConnection } from 'wagmi'

function HeaderLogo() {
    const { address, isConnected } = useConnection();

    const truncateAddress = (addr: string | undefined) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <div className="flex flex-row items-center gap-3 text-white">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-500 text-white flex-shrink-0">
                    <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                    </svg>
                </div>
                <div className="flex flex-col leading-tight min-w-0">
                    <span className="text-xl font-medium text-white">
                        Crypto Portfolio
                    </span>
                    {isConnected && address && (
                        <span className="text-sm text-slate-500 font-mono">
                            {truncateAddress(address)}
                        </span>
                    )}
                </div>
            </div>
    )
}

export default HeaderLogo