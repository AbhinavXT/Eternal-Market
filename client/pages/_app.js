import 'tailwindcss/tailwind.css'
import Link from 'next/link'
import { useState, useEffect } from 'react'

function MyApp({ Component, pageProps }) {
	const [account, setAccount] = useState('')

	const connectWallet = async () => {
		try {
			const { ethereum } = window

			if (!ethereum) {
				console.log('Metamask not detected')
				return
			}

			const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

			console.log('Found account', accounts[0])
			setAccount(accounts[0])
		} catch (error) {
			console.log('Error connecting to metamask', error)
		}
	}

	return (
		<div className='bg-gray-300 h-full min-h-screen'>
			{account === '' ? (
				<div className='flex justify-center pt-20'>
					<button
						className='text-2xl font-bold py-3 px-12 bg-gray-500 hover:text-gray-700 hover:bg-gray-400 transition-colors duration-300 shadow-lg rounded-lg mb-10'
						onClick={connectWallet}
					>
						Connect Wallet
					</button>
				</div>
			) : (
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
			)}
		</div>
	)
}

export default MyApp
