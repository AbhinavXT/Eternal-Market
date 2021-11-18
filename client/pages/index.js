import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Head from 'next/head'
import axios from 'axios'

import { nftContractAddress, nftMarketAddress } from '../config.js'

import NFT from '../utils/EternalNFT.json'
import Market from '../utils/EternalMarketplace.json'

import Loader from 'react-loader-spinner'
import { useRouter } from 'next/router'

export default function Home() {
	const [account, setAccount] = useState('')
	const [nfts, setNfts] = useState([])
	const [loadingState, setLoadingState] = useState(0)
	const [txError, setTxError] = useState(null)

	const router = useRouter()

	// Routes to the buynft page
	const buyToken = (tokenId, itemId) => {
		router.push({
			pathname: '/buynft',
			query: { tokenid: tokenId, itemid: itemId },
		})
	}

	// Fetches the connected account address
	const getAccount = async () => {
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

	// Fetches the marketplace items put for sale
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
				setLoadingState(1)
				setNfts(items)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error loading eternal nft', error)
			setTxError(error.message)
		}
	}

	useEffect(() => {
		getAccount()
		loadEternalNFT()
	}, [])

	return (
		<div className='flex flex-col justify-center items-center'>
			<Head>
				<title>Eternal Domain</title>
				<meta name='description' content='Eternal Domain' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className='font-semibold text-lg mt-12'>Connected: {account}</div>

			<div>
				{loadingState === 0 ? (
					txError === null ? (
						<div className='flex flex-col justify-center items-center'>
							<div className='text-lg font-bold mt-16'>Loading Items</div>
							<Loader
								className='flex justify-center items-center pt-12'
								type='TailSpin'
								color='#6B7280'
								height={40}
								width={40}
							/>
						</div>
					) : (
						<div className='text-lg text-red-600 font-semibold'>{txError}</div>
					)
				) : nfts.length ? (
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
				) : (
					<div className='text-centre font-bold text-xl mt-16'>
						No Items in Marketplace
					</div>
				)}
			</div>
		</div>
	)
}
