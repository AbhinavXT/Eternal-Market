import { useState } from 'react'
import { nftContractAddress } from '../config.js'
import { ethers } from 'ethers'
import axios from 'axios'

import Loader from 'react-loader-spinner'

import NFT from '../utils/EternalNFT.json'

const mint = () => {
	const [mintedNFT, setMintedNFT] = useState(null)
	const [miningStatus, setMiningStatus] = useState(null)
	const [loadingState, setLoadingState] = useState(0)
	const [txError, setTxError] = useState(null)

	// Creates transaction to mint NFT on clicking Mint Character button
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
				setMiningStatus(0)

				let tx = await nftTx.wait()
				setLoadingState(1)

				let event = tx.events[0]
				let value = event.args[2]
				let tokenId = value.toNumber()

				console.log(
					`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`
				)

				getMintedNFT(tokenId)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error minting character', error)
			setTxError(error.message)
		}
	}

	// Gets the minted NFT data
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

				setMiningStatus(1)
				setMintedNFT(meta.image)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log(error)
			setTxError(error.message)
		}
	}

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
			{loadingState === 0 ? (
				miningStatus === 0 ? (
					txError === null ? (
						<div className='flex flex-col justify-center items-center'>
							<div className='text-lg font-bold'>
								Processing your transaction
							</div>
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
				) : (
					<div></div>
				)
			) : (
				<div>
					<div className='font-semibold text-lg text-center mb-4'>
						Your Eternal Domain Character
					</div>
					<img src={mintedNFT} alt='' className='h-80 w-80' />
				</div>
			)}
		</div>
	)
}

export default mint
