let { networkConfig } = require('../helper-hardhat-config')

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
	const { deploy, get, log } = deployments
	const { deployer } = await getNamedAccounts()
	const chainId = await getChainId()
	let linkTokenAddress
	let vrfCoordinatorAddress
	let additionalMessage = ''

	if (chainId == 1337) {
		let linkToken = await get('LinkToken')
		let VRFCoordinatorMock = await get('VRFCoordinatorMock')
		linkTokenAddress = linkToken.address
		vrfCoordinatorAddress = VRFCoordinatorMock.address
		additionalMessage = ' --linkaddress ' + linkTokenAddress
	} else {
		linkTokenAddress = networkConfig[chainId]['linkToken']
		vrfCoordinatorAddress = networkConfig[chainId]['vrfCoordinator']
	}
	const keyHash = networkConfig[chainId]['keyHash']
	const fee = networkConfig[chainId]['fee']

	const NFTMarket = await hre.ethers.getContractFactory('EternalMarketplace')
	const nftMarket = await NFTMarket.deploy()
	await nftMarket.deployed()
	console.log('nftMarket deployed to:', nftMarket.address)

	// const EternalNFT = await deploy('EternalNFT', {
	// 	from: deployer,
	// 	args: [
	// 		nftMarket.address,
	// 		vrfCoordinatorAddress,
	// 		linkTokenAddress,
	// 		keyHash,
	// 		fee,
	// 	],
	// 	log: true,
	// })

	const NFT = await hre.ethers.getContractFactory('EternalNFT')
	const nft = await NFT.deploy(
		nftMarket.address,
		vrfCoordinatorAddress,
		linkTokenAddress,
		keyHash,
		fee
	)
	await nft.deployed()
	console.log('nft contract deployed to:', nft.address)

	// console.log('EternalNFT deployed to:', EternalNFT.address)
	let tx = await nft.createEternalNFT()
	await tx.wait()

	log('Run the following command to fund contract with LINK:')
	log(
		'npx hardhat fund-link --contract ' +
			nft.address +
			' --network ' +
			networkConfig[chainId]['name'] +
			additionalMessage
	)
	log('Then run EternalNFT contract with the following command')
	log(
		'npx hardhat request-random-number --contract ' +
			nft.address +
			' --network ' +
			networkConfig[chainId]['name']
	)
	log('----------------------------------------------------')
}

module.exports.tags = ['all', 'ENFT']
