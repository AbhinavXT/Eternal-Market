import 'tailwindcss/tailwind.css'
import Link from 'next/link'
import { useState, useEffect } from 'react'

function MyApp({ Component, pageProps }) {
	const [currentAccount, setCurrentAccount] = useState('')
	const [correctNetwork, setCorrectNetwork] = useState(false)

	// Checks if wallet is connected
	const checkIfWalletIsConnected = async () => {
		const { ethereum } = window
		if (ethereum) {
			console.log('Got the ethereum obejct: ', ethereum)
		} else {
			console.log('No Wallet found. Connect Wallet')
		}

		const accounts = await ethereum.request({ method: 'eth_accounts' })

		if (accounts.length !== 0) {
			console.log('Found authorized Account: ', accounts[0])
			setCurrentAccount(accounts[0])
		} else {
			console.log('No authorized account found')
		}
	}

	// Calls Metamask to connect wallet on clicking Connect Wallet button
	const connectWallet = async () => {
		try {
			const { ethereum } = window

			if (!ethereum) {
				console.log('Metamask not detected')
				return
			}
			let chainId = await ethereum.request({ method: 'eth_chainId' })
			console.log('Connected to chain:' + chainId)
			const rinkebyChainId = '0x4'
			if (chainId !== rinkebyChainId) {
				alert('You are not connected to the Rinkeby Testnet!')
				return
			}

			const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

			console.log('Found account', accounts[0])
			setCurrentAccount(accounts[0])
		} catch (error) {
			console.log('Error connecting to metamask', error)
		}
	}

	// Checks if wallet is connected to the correct network
	const checkCorrectNetwork = async () => {
		const { ethereum } = window
		let chainId = await ethereum.request({ method: 'eth_chainId' })
		console.log('Connected to chain:' + chainId)
		const rinkebyChainId = '0x4'
		if (chainId !== rinkebyChainId) {
			setCorrectNetwork(false)
		} else {
			setCorrectNetwork(true)
		}
	}

	useEffect(() => {
		checkIfWalletIsConnected()
		checkCorrectNetwork()
	}, [])

	return (
		<div className='bg-gray-300 h-full min-h-screen'>
			{currentAccount === '' ? (
				<div className='flex flex-col justify-center items-center pt-20 gap-y-10'>
					<div className='text-3xl font-extrabold'>
						Welcome to Eternal Domain
					</div>
					<button
						className='text-2xl font-bold py-3 px-12 bg-gray-500 hover:bg-gray-400 transition-colors duration-300 shadow-lg rounded-lg mb-10'
						onClick={connectWallet}
					>
						Connect Wallet
					</button>
				</div>
			) : correctNetwork ? (
				<div>
					<div className='flex justify-between items-baseline pt-8 px-20'>
						<div className='font-extrabold text-3xl'>Eternal Domain</div>
						<div className='flex gap-x-12 text-xl font-bold'>
							<Link href='/'>Home</Link>
							<Link href='/mint'>Mint</Link>
							<Link href='/mynft'>My NFT</Link>
						</div>
					</div>
					<Component {...pageProps} />
				</div>
			) : (
				<div className='flex flex-col justify-center items-center pt-40 font-bold text-2xl gap-y-3'>
					<div>----------------------------------------</div>
					<div>Please connect to the Rinkeby Testnet</div>
					<div>and reload the page</div>
					<div>----------------------------------------</div>
				</div>
			)}
		</div>
	)
}

export default MyApp
