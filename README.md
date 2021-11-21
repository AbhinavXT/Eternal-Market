# Eternal Domain Marketplace

## Table of Contents:
  - [Deployed Website url](#deployed-website-url)
  - [Screencast link](#screencast-link)
  - [Project Description](#project-description)
  - [Workflow](#workflow)
  - [Directory structure](#directory-structure)
  - [Clone, Install and Build steps](#clone-install-and-build-steps)
    - [Prerequisites](#prerequisites)
    - [Cloning and installing dependencies](#cloning-and-installing-dependencies)
    - [Testing Contracts](#testing-contracts)
    - [Running the frontend](#running-the-frontend)
    - [Deploying and running against a local instance](#deploying-and-running-against-a-local-instance)
  - [Troubleshooting](#troubleshooting)
    - [For custom chainId](#for-custom-chainid)
    - [For 'Nonce too High' Error](#for-nonce-too-high-error)

## Deployed Website url
https://eternal-market.vercel.app/

## Screencast link
https://youtu.be/DE216KMBUMg

## Project Description

**Eternal Domain** is a marketplace where users can buy, sell and mint **Eternal Characters**, which are ERC-721 standard (NFT) tokens.

Eternal Characters are the residents of **Eternal Domain** world. They consists of 3 main characteristics, **Area of Control, Weapon and Rank**.

- **Area of Control -** Fire, Wind, Wave, Earth, Light, Shadow, Thunder, Space, Time, Gravity, Ice
- **Weapon -** Sword, Spear, Shield, Hammer, Saber, Axe, Bow, Staff, Wand, Fist, Dagger, Scythe, Mace, Blade, Katana
- **Rank -** Lord, King, Emperor, Venerable, Ancestor, Saint, God

## Workflow

1. Enter the dApp and connect the wallet to rinkeby network.
2. After entering the dApp the user can:
   1. **Buy Characters**
      - Go to the **Home** page and click on the **Buy** button under the item which user want to buy.
      - User will be redirected to the **BuyNFT** page which shows the price and other details about the item.
      - Click on the **Buy** button to buy the item.
      - Metamask pops up and asks to confirm the transaction for the price of the item.
      - After the transaction is successfully processed user is redirected to the **My NFT** page.
      - The bought item is displayed under the **Bought Characters** section
   2. **Mint Characters**
      - Go to the mint page and click on the **Mint Character** button.
      - Metamask pops up and asks to confirm the transaction.
      - After the transaction is successfully processed the user can see the minted character.
      - The minted character is also added to **My NFT** page under **Minted Characters** section.
   3. **Sell Characters**
      - Go to the **My NFT** page and click on the **Sell** button under the minted item which user want to sell.
      - User will be redirected to the **SellNFT** page where user can enter the price for the item.
      - After entering the desired price, click on the **Sell** button to list the item in the market place.
      - Metamask pops up and asks to confirm the transaction for the listing price.
      - After the transaction is successfully processed user is redirected to the **Home** page.
      - The item will be listed in the marketplace to be bought for the price entered by the user.

## Directory structure

```
blockchain-developer-bootcamp-final-project
 ┣ client
 ┃ ┣ pages
 ┃ ┃ ┣ _app.js
 ┃ ┃ ┣ buynft.js
 ┃ ┃ ┣ index.js
 ┃ ┃ ┣ mint.js
 ┃ ┃ ┣ mynft.js
 ┃ ┃ ┗ sellnft.js
 ┃ ┣ public
 ┃ ┃ ┣ favicon.ico
 ┃ ┃ ┗ vercel.svg
 ┃ ┣ utils
 ┃ ┃ ┣ EternalMarketplace.json
 ┃ ┃ ┗ EternalNFT.json
 ┃ ┣ .gitignore
 ┃ ┣ README.md
 ┃ ┣ config.js
 ┃ ┣ package-lock.json
 ┃ ┣ package.json
 ┃ ┣ postcss.config.js
 ┃ ┗ tailwind.config.js
 ┣ contracts
 ┃ ┣ libraries
 ┃ ┃ ┗ Base64.sol
 ┃ ┣ EternalMarketplace.sol
 ┃ ┗ EternalNFT.sol
 ┣ scripts
 ┃ ┣ deploy.js
 ┃ ┗ run.js
 ┣ test
 ┃ ┗ eternalTest.js
 ┣ .gitignore
 ┣ README.md
 ┣ avoiding_common_attacks.md
 ┣ deployed_address.txt
 ┣ design_pattern_decisions.md
 ┣ hardhat.config.js
 ┣ package-lock.json
 ┗ package.json
```

## Clone, Install and Build steps

### Prerequisites

1. [Git](https://git-scm.com/)
2. [Node JS](https://nodejs.org/en/) (everything was installed and tested under v15.12.0)
3. A Browser with the [MetaMask extension](https://metamask.io/) installed.
4. Test Ether on the Rinkeby network.

<br>

### Cloning and installing dependencies

1. Clone the project repository on your local machine

```
 git clone https://github.com/AbhinavXT/blockchain-developer-bootcamp-final-project.git

 cd blockchain-developer-bootcamp-final-project
```

2. Installing dependencies

- For contracts -
  ```
  npm install
  ```
- For client -
  ```
  cd client
  npm install
  ```

### Testing Contracts

For testing contracts run command:

```
npx hardhat test
```

### Running the frontend

For running frontend locally run command:

```
cd client
npm run dev
```

### Deploying and running against a local instance

1. For deploying and running the dApp against a local instance run commands:

```
npx hardhat node
```

2. This should create a local network with 19 accounts. Keep it running, and in another terminal run:

```
npx hardhat run scripts/deploy.js --network localhost
```

3. When the deployment is complete, the CLI should print out the addresses of the contracts that were deployed:

```
nftMarket contract deployed to: 'EternalMarketplace contract address'

nft contract deployed to: 'EternalNFT contract address'
```

4. Copy these addresses and paste them in the [**config.js**](https://github.com/AbhinavXT/Eternal-Market/blob/main/client/config.js) file inside the client folder, in place of current addresses.

```
export const nftContractAddress = 'EternalMarketplace contract address'

export const nftMarketAddress = 'EternalNFT contract address''
```

5. For importing account to metamask

   1. Import account using private key from one of the accounts that were logged on running `npx hardhat node`
   2. Create a custom network (if not already there) pointing to http://127.0.0.1:8545 with **chainId 1337**
   3. Switch to this network and connect it to the dApp and reload it.
   4. For better testing of the transfer of tokens and transactions import at least 2 accounts\*\_
   5. For changing chainId and other possible errors see [Troubleshooting](#troubleshooting)

6. Now run the frontend locally in another terminal using command:

```
cd client
npm run dev
```

After this you can run and test the dApp locally in your web browser.

## Troubleshooting

### For custom chainId

The default chainId for network localhost8545 is 1337. To change the chainId, the user should follow these steps :

1. Change the chainId in networks under hardhat in [hardhat.config.js](https://github.com/AbhinavXT/Eternal-Market/blob/main/hardhat.config.js) file.

```
hardhat: {
  chainId: 1337,
}
```

2. After this the user needs to change the chainId in the [\_app.js](https://github.com/AbhinavXT/Eternal-Market/blob/main/client/pages/_app.js) file on line 42 and 67 under the functions **connectWallet()** and **checkCorrectNetwork()** respectively.

```
const devChainId = 1337
```

### For 'Nonce too High' Error

While testing the dApp on against a local instance, if you get the **Nonce too high** error in the hardhat node terminal or the UI does not show processing your transaction after confirming a transaction, try **resetting your metamask account**. This can be done by going to **Settings > Advanced > Reset Account** in Metamask.
