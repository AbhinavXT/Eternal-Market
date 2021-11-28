require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')
require('./tasks/random-number-consumer')
require('@appliedblockchain/chainlink-plugins-fund-link')

require('dotenv').config()

const INFURA_RINKEBY_URL =
	process.env.INFURA_RINKEBY_URL || 'https://rinkeby.infura.io/v3/your-api-key'

module.exports = {
	solidity: {
		compilers: [
			{
				version: '0.8.7',
			},
			{
				version: '0.6.6',
			},
			{
				version: '0.4.24',
			},
			{
				version: '0.8.3',
			},
		],
	},
	networks: {
		hardhat: {
			chainId: 1337,
		},
		rinkeby: {
			url: INFURA_RINKEBY_URL,
			accounts:
				process.env.ACCOUNT_KEY !== undefined ? [process.env.ACCOUNT_KEY] : [],
		},
	},
	namedAccounts: {
		deployer: {
			default: 0,
		},
	},
}
