require('@nomiclabs/hardhat-waffle')
require('dotenv').config()

module.exports = {
	solidity: '0.8.4',
	networks: {
		rinkeby: {
			url: process.env.INFURA_RINKEBY_URL,
			accounts: [process.env.ACCOUNT_KEY],
		},
		ropsten: {
			url: process.env.INFURA_ROPSTEN_URL,
			accounts: [process.env.ACCOUNT_KEY],
		},
	},
}
