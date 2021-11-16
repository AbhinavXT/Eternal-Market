import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'

import { nftContractAddress, nftMarketAddress } from '../config.js'

import NFT from '../utils/EternalNFT.json'
import Market from '../utils/EternalMarketplace.json'

import { useRouter } from 'next/router'

const buynft = () => {
	const [nft, setNft] = useState({})
	const [id, setId] = useState(null)
	const [tokenData, setTokenData] = useState({})
	// const [owner, setOwner] = useState('')

	const router = useRouter()

	const getNFTData = async () => {
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum)
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

				const tokenId = router.query.tokenid
				setId(tokenId)

				const itemId = router.query.itemid

				const itemData = await nftContract.tokenURI(tokenId)
				const data = await axios.get(itemData)
				setNft(data.data)

				const tokenData = await marketContract.fetchEternalItemById(itemId)
				console.log(tokenData)

				const itemPrice = ethers.utils.formatEther(tokenData[5])

				const EternalToken = {
					seller: tokenData[3],
					price: itemPrice,
				}

				setTokenData(EternalToken)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error minting character', error)
		}
	}

	const buyEternalNft = async () => {
		const provider = await new ethers.providers.Web3Provider(ethereum)
		const signer = provider.getSigner()

		const marketContract = new ethers.Contract(
			nftMarketAddress,
			Market.abi,
			signer
		)

		const itemId = router.query.itemid

		const tokenData = await marketContract.fetchEternalItemById(itemId)
		const price = ethers.utils.parseUnits(tokenData[5].toString(), 'wei')

		const tx = await marketContract.createEternalItemSale(
			nftContractAddress,
			itemId,
			{
				value: price,
			}
		)
		console.log('Mining:', tx.hash)
		await tx.wait()
		console.log('Mined!', tx.hash)
		router.push('/mynft')
	}

	useEffect(() => {
		if (!router.isReady) return
		getNFTData()
	}, [router.isReady])

	return (
		<div className='flex px-60 pt-20 gap-x-20'>
			<div className='flex flex-col w-3/6 gap-y-8'>
				<div className='flex justify-center items-center h-96 w-full'>
					<img src={nft.image} alt='' className='h-80 rounded-xl shadow-xl' />
				</div>
				<div>
					<div className='flex justify-center items-center h-16 w-full text-lg rounded-lg shadow-lg'>
						{nft.description}
					</div>
				</div>
				<div>
					<div className='flex flex-col gap-y-2 w-full px-4 py-4 font-bold rounded-lg shadow-lg'>
						<div className='flex justify-between'>
							<div>TokenId:</div>
							<div>{id}</div>
						</div>
						<div className='flex justify-between'>
							<div>Token Standard:</div>
							<div>ERC-721</div>
						</div>
						<div className='flex justify-between'>
							<div>Blockchain:</div>
							<div>Rinkeby</div>
						</div>
					</div>
				</div>
			</div>
			<div className='flex flex-col font-bold w-full py-8 px-12 gap-y-12'>
				<div className='text-4xl'>{nft.name}</div>
				<div className='flex gap-x-4 text-xl'>
					<div>Seller:</div>
					<div className='text-gray-600'>{tokenData.seller}</div>
				</div>
				<div className='flex gap-x-4 text-xl'>
					<div>Contract Address:</div>
					<div className='text-gray-600'>{nftContractAddress}</div>
				</div>
				<div className='flex gap-x-4 text-xl'>
					<div>Price:</div>
					<div className='text-gray-600'>{tokenData.price} ETH</div>
				</div>
				<div className='flex flex-col gap-y-4 w-96'>
					<buttom
						onClick={buyEternalNft}
						className='flex justify-center items-center h-12 rounded-lg shadow-lg bg-gray-400 hover:bg-gray-500 font-bold text-lg cursor-pointer'
					>
						Buy
					</buttom>
				</div>
			</div>
		</div>
	)
}

export default buynft
