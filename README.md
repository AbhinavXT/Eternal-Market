# Final project - Eternal Domain Marketplace

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
  - [TODO Fetures](#todo-fetures)

## Deployed Website url

https://eternal-domain.vercel.app/

## Screencast link

## Project Description

**Eternal Domain** is a marketplace where users can buy, sell and mint **Eternal Characters**, which are ERC-721 standard (NFT) tokens.

Eternal Characters are the residants of **Eternal Domain** world. They consists of 3 main characterstics, **Area of Control, Weapon and Rank**.

- **Area of Contral -** Fire, Wind, Wave, Earth, Light, Shadow, Thunder, Space, Time, Gravity, Ice
- **Weapon -** Sword, Spear, Shield, Hammer, Saber, Axe, Bow, Staff, Wand, Fist, Dagger, Scythe, Mace, Blade, Katana
- **Rank -** Lord, King, Emperor, Venerable, Ancestor, Saint, God

## Workflow

1. Enter the website and connect the wallet to **Rinkeby network**.
2. After enterning the site the user can:
   1. **Buy Charactersharacters**
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
      - After enterning the desired price, click on the **Sell** button to list the item in the market place.
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

## TODO Fetures
