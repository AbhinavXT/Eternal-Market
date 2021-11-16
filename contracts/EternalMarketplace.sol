//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract EternalMarketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemId;
    Counters.Counter private _itemSold;

    address payable owner;
    uint256 listingPrice = 0.01 ether;
    //AggregatorV3Interface internal priceFeed;

    constructor() {
        owner = payable(msg.sender);
        //priceFeed = AggregatorV3Interface();
    }

    struct EternalItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => EternalItem) private idToEternalItem;

    event EternalItemCreated (
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    function getListingPrice() public view returns(uint256) {
        return listingPrice;
    }

    function createEternalMarketItem(
        address nftContract , 
        uint256 tokenId, 
        uint256 price) 
        public payable nonReentrant {
            
        require(price > 0, "Price must be greater than 0");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        uint256 itemId = _itemId.current();

        idToEternalItem[itemId] = EternalItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        _itemId.increment();

        emit EternalItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }

    function createEternalItemSale(
        address nftContract, 
        uint256 itemId
        ) public payable nonReentrant {

        uint256 tokenId = idToEternalItem[itemId].tokenId;
        uint256 price = idToEternalItem[itemId].price;

        require(msg.value == price, "Please submit the asked price in order to complete the purchase");

        idToEternalItem[itemId].seller.transfer(msg.value);

        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        idToEternalItem[itemId].owner = payable(msg.sender);
        idToEternalItem[itemId].sold = true;
        _itemSold.increment();

        payable(owner).transfer(listingPrice);
    }

    function fetchEternalItems() public view returns(EternalItem[] memory) {
        uint256 itemCount = _itemId.current();
        uint256 unsoldItemCount = _itemId.current() - _itemSold.current();
        uint256 currentIndex = 0;

        EternalItem[] memory items = new EternalItem[](unsoldItemCount);
        
        for(uint256 i = 0; i < itemCount; i++) {
            if (idToEternalItem[i].owner == address(0)) {
                uint256 currentId = i;
                EternalItem storage currentItem = idToEternalItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    function fetchEternalItemById(uint256 itemId) public view returns(EternalItem memory) {
        return idToEternalItem[itemId];
    }

    function fetchMyEternalItems() public view returns(EternalItem[] memory) {
        uint totalItemCount = _itemId.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToEternalItem[i].owner == msg.sender) {
                itemCount += 1;
            }
        }

        EternalItem[] memory items = new EternalItem[](itemCount);

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToEternalItem[i].owner == msg.sender) {
                uint currentId = i;
                EternalItem storage currentItem = idToEternalItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }
}