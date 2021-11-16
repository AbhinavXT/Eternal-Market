import { useState, useEffect } from 'react'
import { nftContractAddress, nftMarketAddress } from '../config.js'
import { ethers } from 'ethers'
import NFT from '../utils/EternalNFT.json'
import axios from 'axios'
// import Market from '../utils/EternalMarketplace.json'

const mint = () => {
	const [mintedNFT, setMintedNFT] = useState(null)

	const mintCharacter = async () => {
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

				let nftTx = await nftContract.createEternalNFT()
				console.log('Mining....', nftTx.hash)

				let tx = await nftTx.wait()

				let event = tx.events[0]
				let value = event.args[2]
				let tokenId = value.toNumber()

				console.log(
					`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`
				)
				console.log('Token ID:', tokenId)
				getMintedNFT(tokenId)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error minting character', error)
		}
	}

	const getMintedNFT = async (tokenId) => {
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

				let tokenUri = await nftContract.tokenURI(tokenId)
				let data = await axios.get(tokenUri)
				let meta = data.data

				setMintedNFT(meta.image)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error minting character', error)
		}
	}

	useEffect(() => {
		//setMintedNFT(null)
	})

	return (
		<div className='flex flex-col items-center pt-32'>
			<h2 className='text-3xl font-bold mb-20'>
				Mint your Eternal Domain NFT!
			</h2>
			<button
				className='text-2xl font-bold py-3 px-12 bg-gray-400 hover:bg-gray-500 transition-colors duration-300 shadow-lg rounded-lg mb-10'
				onClick={mintCharacter}
			>
				Mint Character
			</button>
			<div className='text-xl font-semibold mb-32'>
				<a
					href={`https://rinkeby.rarible.com/collection/${nftContractAddress}`}
					target='_blank'
				>
					<span className='underline'>View Collection on Rarible</span>
				</a>
			</div>
			{mintedNFT !== null && (
				<div>
					<div className='font-semibold text-lg text-center mb-2'>
						You have minted
					</div>
					<img src={mintedNFT} alt='' className='h-80 w-80' />
				</div>
			)}
		</div>
	)
}

export default mint
