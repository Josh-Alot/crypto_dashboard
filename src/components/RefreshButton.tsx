function RefreshButton() {
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <button 
                    onClick={handleRefresh}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-800/90 text-white text-xs font-medium border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-colors"
                    style={{ padding: '0.75rem 1rem' }}
                    type="button"
                >
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
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                        <path d="M21 3v5h-5"></path>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                        <path d="M3 21v-5h5"></path>
                    </svg>
                    <span>Refresh</span>
                </button>
    )
}

export default RefreshButton