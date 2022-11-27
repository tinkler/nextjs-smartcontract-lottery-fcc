import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddresses } from '../constants/index.js'
import { ethers } from 'ethers'
import { useNotification } from 'web3uikit';

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()

    const chainId = parseInt(chainIdHex)
    console.log(chainId)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [entranceFee, setEntranceFee] = useState("0")
    const [numberPlayers, setNumberPlayers] = useState("1")
    const [recentWinner, setRecentWinner] = useState("2")

    const dispatch = useNotification()

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {}
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {}
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {}
    })


    const { runContractFunction: enterRaffle, isLoading, isFetching } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        msgValue: entranceFee,
        params: {}
    })



    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString();
        const numberPlayersFromCall = (await getNumberOfPlayers()).toString();
        const recentWinnerFromCall = (await getRecentWinner())
        setEntranceFee(entranceFeeFromCall)
        setNumberPlayers(numberPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled && raffleAddress) {
            updateUI()
        }

    }, [isWeb3Enabled])



    const handelSuccess = async function (tx) {
        try{
            await tx.wait(1)
            updateUI()
            handleNewNotification(tx)
        }catch (error) {
            console.error(error)
        }
       
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="p-5">Hi from lottery entrance
            {raffleAddress ? (<div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={async function () {
                    await enterRaffle({ onSuccess: handelSuccess, onError: (error) => console.log(error) })
                }} disabled={isLoading || isFetching}>{isLoading || isFetching ? <div className="animate-spin spiner-border h-8 w-8 border-b-2 rounded-full"></div> : <div>Enter Raffle</div>}</button>
                Number of Players {numberPlayers}
                Recent Winner: {recentWinner}
                Entrance Fee: <div>{ethers.utils.formatUnits(entranceFee, "ether")} ETH</div></div>)
                : (<div>No Raffle Address Detected</div>)}

        </div>
    )
}