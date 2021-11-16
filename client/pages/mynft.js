import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { nftContractAddress } from '../config.js'

import NFT from '../utils/EternalNFT.json'
import axios from 'axios'

import Link from 'next/link'
import { useRouter } from 'next/router'

const Home = () => {
	//const [account, setAccount] = useState('')
	const [nfts, setNfts] = useState([])
	//const [loadingState, setLoadingState] = useState(0)

	const router = useRouter()

	const sellToken = (tokenId) => {
		router.push({
			pathname: '/sellnft',
			query: { id: tokenId },
		})
	}

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

				const itemsData = await nftContract.getMyEternalNFT()

				const items = await Promise.all(
					itemsData.map(async (i) => {
						const tokenId = i[0].toNumber()
						const tokenUri = i[2]
						const meta = await axios.get(tokenUri)

						let item = {
							id: tokenId,
							name: meta.data.name,
							description: meta.data.description,
							image: meta.data.image,
						}
						return item
					})
				)
				//console.log(items)
				setNfts(items)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error loading eternal nft', error)
		}
	}

	useEffect(() => {
		loadMyEternalNFT()
	}, [])

	return (
		<div className='flex flex-col justify-center items-center'>
			<div className='flex justify-center'>
				<div className='px-4'>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 mt-16'>
						{nfts.map((nft) => (
							<div
								key={nft.id}
								className='border shadow-lg rounded-xl overflow-hidden w-60 h-80 border-gray-300'
							>
								<img src={nft.image} />
								<div className='p-4'>
									<button
										className='w-full bg-gray-500 text-white font-bold py-2 px-12 rounded'
										onClick={() => sellToken(nft.id)}
									>
										Sell
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Home
