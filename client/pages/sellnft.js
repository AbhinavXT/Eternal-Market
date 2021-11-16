import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'

import { nftContractAddress, nftMarketAddress } from '../config.js'

import NFT from '../utils/EternalNFT.json'
import Market from '../utils/EternalMarketplace.json'

import { useRouter } from 'next/router'

const sellnft = () => {
	const [price, setPrice] = useState('')
	const [nft, setNft] = useState({})
	const [id, setId] = useState(null)
	const [contractAddress, setContractAddress] = useState('')
	const [owner, setOwner] = useState('')

	const router = useRouter()

	const handleChange = useCallback(
		(e) => {
			setPrice(e.target.value)
		},
		[setPrice]
	)

	const getAccount = async () => {
		try {
			const { ethereum } = window

			if (!ethereum) {
				console.log('Metamask not detected')
				return
			}

			const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

			console.log('Found account', accounts[0])
			setOwner(accounts[0])
		} catch (error) {
			console.log('Error connecting to metamask', error)
		}
	}

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
				setContractAddress(nftContractAddress)

				const tokenId = router.query.id
				setId(tokenId)

				const itemData = await nftContract.tokenURI(tokenId)
				const data = await axios.get(itemData)

				setNft(data.data)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error minting character', error)
		}
	}

	const sellItem = async () => {
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

				const tokenId = router.query.id

				let listingPrice = await marketContract.getListingPrice()
				listingPrice = listingPrice.toString()

				const itemPrice = ethers.utils.parseUnits(price, 'ether')
				console.log('price', itemPrice)

				let tx = await marketContract.createEternalMarketItem(
					nftContractAddress,
					tokenId,
					price,
					{ value: listingPrice }
				)
				console.log('Mining:', tx.hash)
				await tx.wait()
				console.log('Mined!', tx.hash)
				router.push('/')
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error minting character', error)
		}
	}

	useEffect(() => {
		if (!router.isReady) return
		getNFTData()
		getAccount()
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
					<div>Owner:</div>
					<div className='text-gray-600'>{owner}</div>
				</div>
				<div className='flex gap-x-4 text-xl'>
					<div>Contract Address:</div>
					<div className='text-gray-600'>{contractAddress}</div>
				</div>
				<div className='flex flex-col gap-y-4 w-96'>
					<input
						type='text'
						onChange={handleChange}
						name='name'
						placeholder='Eternal NFT Price'
						className='h-12 rounded-lg shadow-lg px-4 font-bold bg-gray-100'
					/>
					<buttom
						onClick={sellItem}
						className='flex justify-center items-center h-12 rounded-lg shadow-lg bg-gray-400 hover:bg-gray-500 font-bold text-lg cursor-pointer'
					>
						Sell
					</buttom>
				</div>
			</div>
		</div>
	)
}

export default sellnft
