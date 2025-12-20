import { AppKitButton } from "@reown/appkit/react"

function WalletButton() {
    return <AppKitButton 
                size="md" // ou "md", "lg"
                label="Connect Wallet"
                className="custom-wallet-button"
                style={{ borderRadius: '8px' }}
            />
}

export default WalletButton