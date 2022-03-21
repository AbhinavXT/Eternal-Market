let { networkConfig } = require("../helper-hardhat-config")

const chainId = 4

const linkTokenAddress = networkConfig[chainId]["linkToken"]
const vrfCoordinatorAddress = networkConfig[chainId]["vrfCoordinator"]
const keyHash = networkConfig[chainId]["keyHash"]
const fee = networkConfig[chainId]["fee"]

const deployContracts = async () => {
	const NFTMarket = await hre.ethers.getContractFactory("EternalMarketplace")
	const nftMarket = await NFTMarket.deploy()
	await nftMarket.deployed()
	console.log("nftMarket deployed to:", nftMarket.address)

	const NFT = await hre.ethers.getContractFactory("EternalNFT")
	const nft = await NFT.deploy(
		nftMarket.address,
		vrfCoordinatorAddress,
		linkTokenAddress,
		keyHash,
		fee
	)
	await nft.deployed()
	console.log("nft contract deployed to:", nft.address)
}

const main = async () => {
	try {
		await deployContracts()
	} catch (error) {
		console.log(error)
	}
}

main()
