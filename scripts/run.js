async function main() {
	const NFTMarket = await hre.ethers.getContractFactory('EternalMarketplace')
	const nftMarket = await NFTMarket.deploy()
	await nftMarket.deployed()
	console.log('nftMarket deployed to:', nftMarket.address)

	const NFT = await hre.ethers.getContractFactory('EternalNFT')
	const nft = await NFT.deploy(nftMarket.address)
	await nft.deployed()
	console.log('nft deployed to:', nft.address)

	let tx = await nft.createEternalNFT()
	await tx.wait()
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
