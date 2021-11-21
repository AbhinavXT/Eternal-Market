require('@nomiclabs/hardhat-waffle')
require('dotenv').config()

module.exports = {
	solidity: '0.8.3',
	networks: {
		hardhat: {
			chainId: 1337,
		},
		rinkeby: {
			url: process.env.INFURA_RINKEBY_URL || '',
			accounts:
				process.env.ACCOUNT_KEY !== undefined ? [process.env.ACCOUNT_KEY] : [],
		},
	},
}
