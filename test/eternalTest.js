const { assert } = require('chai')

describe('EternalNFT Contract', async () => {
	let nft
	let market
	let marketContractAddress
	let nftContractAddress
	let tokenId

	// Deploys the EternalNFT contract and the EternalMarket contract before each test
	beforeEach('Setup Contract', async () => {
		const Market = await ethers.getContractFactory('EternalMarketplace')
		market = await Market.deploy()
		await market.deployed()
		marketContractAddress = await market.address

		const EternalNFT = await ethers.getContractFactory('EternalNFT')
		nft = await EternalNFT.deploy(marketContractAddress)
		await nft.deployed()
		nftContractAddress = await nft.address
	})

	// Tests address for the EternalNFT contract
	it('Should have an address', async () => {
		assert.notEqual(nftContractAddress, 0x0)
		assert.notEqual(nftContractAddress, '')
		assert.notEqual(nftContractAddress, null)
		assert.notEqual(nftContractAddress, undefined)
	})

	// Tests name for the token of EternalNFT contract
	it('Should have a name', async () => {
		// Returns the name of the token
		const name = await nft.collectionName()

		assert.equal(name, 'EternalNFT')
	})

	// Tests symbol for the token of EternalNFT contract
	it('Should have a symbol', async () => {
		// Returns the symbol of the token
		const symbol = await nft.collectionSymbol()

		assert.equal(symbol, 'ENFT')
	})

	// Tests for NFT minting function of EternalNFT contract using tokenID of the minted NFT
	it('Should be able to mint NFT', async () => {
		// Mints a NFT
		let txn = await nft.createEternalNFT()
		let tx = await txn.wait()

		// tokenID of the minted NFT
		let event = tx.events[0]
		let value = event.args[2]
		tokenId = value.toNumber()

		assert.equal(tokenId, 0)

		// Mints another NFT
		txn = await nft.createEternalNFT()
		tx = await txn.wait()

		// tokenID of the minted NFT
		event = tx.events[0]
		value = event.args[2]
		tokenId = value.toNumber()

		assert.equal(tokenId, 1)
	})

	// Test for number of NFTs owned by an address
	it('Should be able to return number of NFTs owned by and address', async () => {
		// Mints a NFT
		let txn = await nft.createEternalNFT()
		await txn.wait()

		// Returns the array of NFTs owned by the address
		let tokensOwned = await nft.getMyEternalNFT()

		assert.equal(tokensOwned.length, 1)
	})
})

describe('EternalMarket', function () {
	let nft
	let market
	let marketContractAddress
	let nftContractAddress
	let listingPrice
	let auctionPrice

	// Deploys the EternalNFT contract and the EternalMarket contract before each test
	beforeEach('Eternal Marketplace', async () => {
		const Market = await ethers.getContractFactory('EternalMarketplace')
		market = await Market.deploy()
		await market.deployed()
		marketContractAddress = await market.address

		const EternalNFT = await ethers.getContractFactory('EternalNFT')
		nft = await EternalNFT.deploy(marketContractAddress)
		await nft.deployed()
		nftContractAddress = await nft.address

		listingPrice = await market.getListingPrice()
		listingPrice = listingPrice.toString()

		auctionPrice = ethers.utils.parseUnits('1', 'ether')
	})

	// Test for creation of an Eternal Marketplace item
	it('Should be able to create an Eternal Item', async () => {
		// Mints a NFT
		await nft.createEternalNFT()

		// Puts the NFT up for sale in the eternal marketplace
		await market.createEternalMarketItem(nftContractAddress, 0, auctionPrice, {
			value: listingPrice,
		})

		// Fetches the remaining unsold marketplace items
		let items = await market.fetchEternalItems()

		assert.equal(items.length, 1)
	})

	// Test for creation and sale of an Eternal Marketplace item
	it('Should be able to execute Eternal Item Sale', async () => {
		// Mints 2 NFTs
		await nft.createEternalNFT()
		await nft.createEternalNFT()

		// Puts the first NFT up for sale in the eternal marketplace
		await market.createEternalMarketItem(nftContractAddress, 0, auctionPrice, {
			value: listingPrice,
		})

		// Puts the second NFT up for sale in the eternal marketplace
		await market.createEternalMarketItem(nftContractAddress, 1, auctionPrice, {
			value: listingPrice,
		})

		const [_, buyerAddress] = await ethers.getSigners()

		// Creates a sale for the first NFT and transfers it from the owner to the buyer through the marketplace contract
		await market
			.connect(buyerAddress)
			.createEternalItemSale(nftContractAddress, 1, { value: auctionPrice })

		// Fetches the remaining unsold marketplace items
		// Returns one as one of the two NFT minted is sold
		let items = await market.fetchEternalItems()

		assert.equal(items.length, 1)
	})

	// Test for fetchng details of an Eternal Marketplace item using its itemId
	it('Should be able to get an Eternal by its tokenId', async () => {
		// Mints 2 NFTs
		await nft.createEternalNFT()
		await nft.createEternalNFT()

		// Puts the first NFT up for sale in the eternal marketplace
		await market.createEternalMarketItem(nftContractAddress, 0, auctionPrice, {
			value: listingPrice,
		})

		// Puts the second NFT up for sale in the eternal marketplace
		await market.createEternalMarketItem(nftContractAddress, 1, auctionPrice, {
			value: listingPrice,
		})

		// Fetches the details of first marketplace item by its itemId
		let item = await market.fetchEternalItemById(1)

		assert.equal(item.itemId, 1)
	})

	// Test for fetchng details of all created Eternal Marketplace items
	it('Should be able to get an Eternal by its tokenId', async () => {
		// Mints 2 NFTs
		await nft.createEternalNFT()
		await nft.createEternalNFT()

		// Puts the first NFT up for sale in the eternal marketplace
		await market.createEternalMarketItem(nftContractAddress, 0, auctionPrice, {
			value: listingPrice,
		})

		// Puts the second NFT up for sale in the eternal marketplace
		await market.createEternalMarketItem(nftContractAddress, 1, auctionPrice, {
			value: listingPrice,
		})

		// Fetches the details of all unsold marketplace items
		// Returs 2 as two eternal items are created and none is sold
		let item = await market.fetchEternalItems()

		assert.equal(item.length, 2)
	})
})
