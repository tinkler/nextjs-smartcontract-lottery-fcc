import { useMoralis } from 'react-moralis'
import { useEffect } from 'react'

export default function ManualHeader() {

    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis()

    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window !== 'undefined') {
            if (window.localStorage.getItem('connected')) {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null account found")
            }
        })
    }, [])

    // some button that connect us and change conntected and be be true

    return (<div>
        {account ? (<div>Connected! {account.slice(0, 6)}...{account.slice(- 4)}</div>) : (<button onClick={async () => {
            await enableWeb3()
            if (typeof window !== 'undefined') {
                window.localStorage.setItem("connected", "injected")
            }
            
        }} disabled={isWeb3EnableLoading}>Connect</button>)}

    </div>)
}

// I'm going to show you the hard way first
// Then the easy way

// learning how to calculate ad derivative