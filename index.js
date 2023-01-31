// in nodejs
// require()

// in front-end javascript we can't use require()
// import

import { ethers } from "./ethers-5.2.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("ConnectButton")
const fundButton = document.getElementById("fundButton")
const BalanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
BalanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

console.log(ethers)

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({
            method: "eth_requestAccounts",
        })
        connectButton.innerHTML = "Connected"
    } else {
        connectButton.innerHTML = "No Metamask? LMAO."
    }
}

// Fund function
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding ${ethAmount} ether...`)
    if (typeof window.ethereum != "undefined") {
        // provider/connection to blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        // signer/wallet/someone with gas
        const signer = provider.getSigner()
        console.log(signer)

        // contract that we are interacting with
        // ^ABI & Address
        const contract = new ethers.Contract(contractAddress, abi, signer)

        //Making transactions
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTx(transactionResponse, provider)
            console.log("Done")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTx(transactionResponse, provider) {
    console.log(`mining ${transactionResponse.hash}....`)
    // create a listener for the blockchain
    return new Promise((resolve) => {
        provider.once(transactionResponse.hash, (transactionReciept) => {
            console.log(
                `COmpleted with ${transactionReciept.confirmations} confirmations`
            )
            resolve()
        })
    })
}
//Withdraw function

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Withdrawing....")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.withdraw()
            await listenForTx(transactionResponse, provider)
            console.log("Withdraw Done")
        } catch (error) {
            console.log(error)
        }
    }
}
