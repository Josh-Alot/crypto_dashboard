import WalletButton from "./WalletButton";

function Header() {
    return (
        <div className="header-container">
            <span>Crypto Dashboard</span>
            <WalletButton />
        </div>
    )
}

export default Header