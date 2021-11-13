async function main() {
	const NFTMarket = await hre.ethers.getContractFactory('EternalMarketplace')
	const nftMarket = await NFTMarket.deploy()
	await nftMarket.deployed()
	console.log('nftMarket deployed to:', nftMarket.address)

	const NFT = await hre.ethers.getContractFactory('EternalNFT')
	const nft = await NFT.deploy(nftMarket.address)
	await nft.deployed()
	console.log('nft deployed to:', nft.address)

	const tx1 = await nft.createEternalNFT()
	await tx1.wait()

	// const tx2 = await nft.createEternalNFT()
	// await tx2.wait()

	// const price = await nftMarket.getLatestPrice()
	// console.log('price:', price)
}

const runMain = async () => {
	try {
		await main()
		process.exit(0)
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
}

runMain()
