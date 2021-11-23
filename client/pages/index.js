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

			<div className='font-bold text-4xl mt-12'>Eternal Marketplace</div>

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
								<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16'>
									{nfts.map((nft, i) => (
										<div
											key={i}
											onClick={() => buyToken(nft.tokenId, nft.itemId)}
											className='border shadow-lg rounded-xl overflow-hidden w-60 h-84 border-gray-300 cursor-pointer hover:shadow-lg hover:scale-105 transition duration-500 ease-in-out'
										>
											<img src={nft.image} />
											<div className='flex justify-between p-4 font-bold text-lg'>
												<div>#{nft.tokenId}</div>
												<div className='flex items-center gap-x-1'>
													<div>
														<svg
															width='18'
															height='18'
															viewBox='0 0 256 417'
															xmlns='http://www.w3.org/2000/svg'
															preserveAspectRatio='xMidYMid'
														>
															<path
																fill='#343434'
																d='M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z'
															/>
															<path
																fill='#8C8C8C'
																d='M127.962 0L0 212.32l127.962 75.639V154.158z'
															/>
															<path
																fill='#3C3C3B'
																d='M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z'
															/>
															<path
																fill='#8C8C8C'
																d='M127.962 416.905v-104.72L0 236.585z'
															/>
															<path
																fill='#141414'
																d='M127.961 287.958l127.96-75.637-127.96-58.162z'
															/>
															<path
																fill='#393939'
																d='M0 212.32l127.96 75.638v-133.8z'
															/>
														</svg>
													</div>
													<div>{nft.price.split('.')[0]}</div>
												</div>
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
