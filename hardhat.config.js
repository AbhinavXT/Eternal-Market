require("@nomiclabs/hardhat-waffle")
require("dotenv").config()

module.exports = {
	solidity: {
		compilers: [
			{
				version: "0.8.7",
			},
			{
				version: "0.6.6",
			},
			{
				version: "0.4.24",
			},
			{
				version: "0.8.3",
			},
		],
	},
	networks: {
		hardhat: {
			chainId: 1337,
		},
		rinkeby: {
			url: process.env.ALCHEMY_RINKEBY_URL || "",
			accounts:
				process.env.ACCOUNT_KEY !== undefined
					? [process.env.ACCOUNT_KEY]
					: [],
		},
	},
}
