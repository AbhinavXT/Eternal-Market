import { useEffect, useState, useCallback } from 'react'
import { ethers } from 'ethers'

import { nftContractAddress, nftMarketAddress } from '../config.js'

import NFT from '../utils/EternalNFT.json'
import Market from '../utils/EternalMarketplace.json'
import axios from 'axios'
import Loader from 'react-loader-spinner'

import { useRouter } from 'next/router'

const Home = () => {
	const [nfts, setNfts] = useState([])
	const [boughtNfts, setBoughtNfts] = useState([])
	const [mintLoadingState, setMintLoadingState] = useState(0)
	const [boughtLoadingState, setBoughtLoadingState] = useState(0)
	const [txError, setTxError] = useState(null)

	const router = useRouter()

	let account

	// Routes to sellnft page
	const sellToken = (tokenId) => {
		router.push({
			pathname: '/sellnft',
			query: { id: tokenId },
		})
	}

	// Gets data of NFTs bought from the marketplace
	const loadBoughtNFT = async () => {
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

				const data = await marketContract.fetchMyEternalItems()

				const items = await Promise.all(
					data.map(async (i) => {
						const tokenUri = await nftContract.tokenURI(i.tokenId)
						const meta = await axios.get(tokenUri)
						let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
						let item = {
							price,
							tokenId: i.tokenId.toNumber(),
							seller: i.seller,
							owner: i.owner,
							image: meta.data.image,
						}
						return item
					})
				)
				setBoughtLoadingState(1)
				setBoughtNfts(items)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error loading eternal nft', error)
			setTxError(error.message)
		}
	}

	// Gets data of NFTs minted by the user
	const loadMyEternalNFT = async () => {
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

				account = await signer.getAddress()

				const itemsData = await nftContract.getMyEternalNFT()

				const items = await Promise.all(
					itemsData.map(async (i) => {
						const tokenId = i[0].toNumber()
						const tokenOwner = await nftContract.ownerOf(tokenId)
						const tokenUri = i[2]
						const meta = await axios.get(tokenUri)

						let item = {
							id: tokenId,
							name: meta.data.name,
							description: meta.data.description,
							image: meta.data.image,
							owner: tokenOwner,
						}
						return item
					})
				)
				const mintedItems = items.filter((item) => item.owner === account)
				setMintLoadingState(1)
				setNfts(mintedItems)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error loading eternal nft', error)
			setTxError(error.message)
		}
	}

	useEffect(() => {
		loadMyEternalNFT()
		loadBoughtNFT()
	}, [])

	return (
		<div className='flex flex-col justify-center items-center'>
			<div className='flex justify-center'>
				<div className='px-4 mt-12'>
					<div className='text-center text-2xl font-extrabold'>
						Minted Eternal Items
					</div>
					{mintLoadingState === 0 ? (
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
							<div className='text-lg text-red-600 font-semibold'>
								{txError}
							</div>
						)
					) : nfts.length === 0 ? (
						<div className='text-center text-lg font-semibold mt-4 text-gray-600'>
							No minted items.
						</div>
					) : (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4 mt-4'>
							{nfts.map((nft, i) => (
								<div
									key={i}
									className='border shadow-lg rounded-xl overflow-hidden w-60 h-80 border-gray-300'
								>
									<img src={nft.image} />
									<div className='p-4'>
										<button
											className='w-full bg-gray-800 text-white font-bold py-2 px-12 rounded-lg hover:shadow-lg hover:scale-105 transition duration-500 ease-in-out'
											onClick={() => sellToken(nft.id)}
										>
											Sell
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
			<div className='flex justify-center'>
				<div className='px-4 mt-12'>
					<div className='text-center text-2xl font-extrabold'>
						Bought Eternal Items
					</div>
					{boughtLoadingState === 0 ? (
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
							<div className='text-lg text-red-600 font-semibold'>
								{txError}
							</div>
						)
					) : boughtNfts.length === 0 ? (
						<div className='text-lg font-semibold mt-4 text-gray-600'>
							No bought Eternal items.
						</div>
					) : (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4 mt-4 pb-8'>
							{boughtNfts.map((boughtNft, i) => (
								<div
									key={i}
									className='border shadow-lg rounded-xl overflow-hidden w-60 h-72 border-gray-300 hover:shadow-lg hover:scale-105 transition duration-500 ease-in-out'
								>
									<img src={boughtNft.image} />
									<div className='flex items-center justify-center text-xl font-bold py-2 px-4'>
										<div>#{boughtNft.tokenId}</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Home
