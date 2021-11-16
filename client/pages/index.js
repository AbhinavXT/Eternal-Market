import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Head from 'next/head'
import axios from 'axios'

import { nftContractAddress, nftMarketAddress } from '../config.js'

import NFT from '../utils/EternalNFT.json'
import Market from '../utils/EternalMarketplace.json'

import { useRouter } from 'next/router'

export default function Home() {
	const [account, setAccount] = useState('')
	const [nfts, setNfts] = useState([])
	//const [loadingState, setLoadingState] = useState(0)

	const router = useRouter()

	const buyToken = (tokenId, itemId) => {
		router.push({
			pathname: '/buynft',
			query: { tokenid: tokenId, itemid: itemId },
		})
	}

	const checkIfWalletIsConnected = async () => {
		const { ethereum } = window

		if (!ethereum) {
			alert('Metamask not detected. Install Metamask')
			return
		} else {
			console.log('Metamask detected')
		}

		const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

		if (accounts.length !== 0) {
			console.log('Found account', accounts[0])
			setAccount(accounts[0])
		}
	}

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

	const loadEternalNFT = async () => {
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = await new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()
				const nftContract = new ethers.Contract(
					nftContractAddress,
					NFT.abi,
					signer
				)
				const marketContract = new ethers.Contract(
					nftMarketAddress,
					Market.abi,
					signer
				)

				const itemsData = await marketContract.fetchEternalItems()

				const items = await Promise.all(
					itemsData.map(async (i) => {
						const tokenUri = await nftContract.tokenURI(i.tokenId)
						const meta = await axios.get(tokenUri)

						let price = ethers.utils.formatUnits(i.price.toString(), 'ether')

						let item = {
							price,
							itemId: i.itemId.toNumber(),
							tokenId: i.tokenId.toNumber(),
							seller: i.seller,
							owner: i.owner,
							image: meta.data.image,
							name: meta.data.name,
							description: meta.data.description,
						}
						return item
					})
				)
				setNfts(items)
				//setLoadingState(1)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error loading eternal nft', error)
		}
	}

	useEffect(() => {
		checkIfWalletIsConnected()
		loadEternalNFT()
	}, [])

	return (
		<div className='flex flex-col justify-center items-center'>
			<Head>
				<title>Eternal NFT</title>
				<meta name='description' content='Eternal Domain' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			{account === '' ? (
				<div className='mt-20'>
					<button
						className='text-2xl font-bold py-3 px-12 bg-gray-500 hover:text-gray-700 hover:bg-gray-400 transition-colors duration-300 shadow-lg rounded-lg mb-10'
						onClick={connectWallet}
					>
						Connect Wallet
					</button>
				</div>
			) : (
				<div className='font-semibold text-lg mt-12'>Connected: {account}</div>
			)}

			<div className='flex flex-col justify-center items-center'>
				<div className='flex justify-center'>
					<div className='px-4'>
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 mt-16'>
							{nfts.map((nft, i) => (
								<div
									key={i}
									className='border shadow-lg rounded-xl overflow-hidden w-60 h-84 border-gray-300'
								>
									<img src={nft.image} />
									<div className='flex justify-between px-2 font-bold text-lg'>
										<div>Price:</div>
										<div>{nft.price} ETH</div>
									</div>
									<div className='p-4'>
										<button
											onClick={() => buyToken(nft.tokenId, nft.itemId)}
											className='w-full bg-gray-500 text-white font-bold py-2 px-12 rounded'
										>
											Buy
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
