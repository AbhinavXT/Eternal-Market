const { assert } = require('chai')

describe('EternalNFT Contract', async () => {
	let nft
	let market
	let marketContractAddress
	let nftContractAddress
	let tokenId

	before('Setup Contract', async () => {
		const Market = await ethers.getContractFactory('EternalMarketplace')
		market = await Market.deploy()
		await market.deployed()
		marketContractAddress = await market.address

		const EternalNFT = await ethers.getContractFactory('EternalNFT')
		nft = await EternalNFT.deploy(marketContractAddress)
		await nft.deployed()
		nftContractAddress = await nft.address
	})

	it('Should have an address', async () => {
		assert.notEqual(nftContractAddress, 0x0)
		assert.notEqual(nftContractAddress, '')
		assert.notEqual(nftContractAddress, null)
		assert.notEqual(nftContractAddress, undefined)
	})

	it('Should have a name', async () => {
		const name = await nft.collectionName()

		assert.equal(name, 'EternalNFT')
	})

	it('Should have a symbol', async () => {
		const symbol = await nft.collectionSymbol()

		assert.equal(symbol, 'ENFT')
	})

	it('Should be able to mint NFT', async () => {
		let txn = await nft.createEternalNFT()
		let tx = await txn.wait()

		let event = tx.events[0]
		let value = event.args[2]
		tokenId = value.toNumber()

		assert.equal(tokenId, 0)

		txn = await nft.createEternalNFT()
		tx = await txn.wait()

		event = tx.events[0]
		value = event.args[2]
		tokenId = value.toNumber()

		assert.equal(tokenId, 1)
	})

	it('Should be able to return number of NFTs owned by and address', async () => {
		let tokensOwned = await nft.getMyEternalNFT()

		assert.equal(tokensOwned.length, 2)
	})
})

describe('EternalMarket', function () {
	let nft
	let market
	let marketContractAddress
	let nftContractAddress
	let listingPrice
	let auctionPrice

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

	it('Should be able to create an Eternal Item', async () => {
		await nft.createEternalNFT()

		await market.createEternalMarketItem(nftContractAddress, 0, auctionPrice, {
			value: listingPrice,
		})

		let items = await market.fetchEternalItems()

		assert.equal(items.length, 1)
	})

	it('Should be able to execute Eternal Item Sale', async () => {
		await nft.createEternalNFT()
		await nft.createEternalNFT()

		await market.createEternalMarketItem(nftContractAddress, 0, auctionPrice, {
			value: listingPrice,
		})

		await market.createEternalMarketItem(nftContractAddress, 1, auctionPrice, {
			value: listingPrice,
		})

		const [_, buyerAddress] = await ethers.getSigners()

		await market
			.connect(buyerAddress)
			.createEternalItemSale(nftContractAddress, 1, { value: auctionPrice })

		let items = await market.fetchEternalItems()

		assert.equal(items.length, 1)
	})

	it('Should be able to get an Eternal by its tokenId', async () => {
		await nft.createEternalNFT()
		await nft.createEternalNFT()

		await market.createEternalMarketItem(nftContractAddress, 0, auctionPrice, {
			value: listingPrice,
		})

		await market.createEternalMarketItem(nftContractAddress, 1, auctionPrice, {
			value: listingPrice,
		})

		let item = await market.fetchEternalItemById(1)

		assert.equal(item.itemId, 1)
	})
})
