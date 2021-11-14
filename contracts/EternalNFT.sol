//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import { Base64 } from "./libraries/Base64.sol";

import "hardhat/console.sol";

contract EternalNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    address contractAddress;
   
    string public collectionName;
    string public collectionSymbol;

    string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] first_word = [
        'Flame',
        'Wind',
        'Wave',
        'Rock',
        'Light',
        'Dark'
    ];

    string[] second_word = [
        'Mage',
        'Shield',
        'Assassin',
        'Saint',
        'Cleric',
        'Sword',
        'Spear'
    ];

    string[] third_word = [
        'Shi',
        'Lin',
        'Han',
        'Ren',
        'Qin',
        'Jin'
    ];

    //event EternalNFTMinted(address sender, uint256 tokenId);

    constructor(address marketplaceAddress) ERC721("EternalNFT", "ENFT") Ownable() {
        contractAddress = marketplaceAddress;
        collectionName = name();
        collectionSymbol = symbol();
    }

    function random(string memory _input) internal pure returns(uint256) {
        return uint256(keccak256(abi.encodePacked(_input)));
    }

    function pickFirstWord(uint256 tokenId) public view returns(string memory) {
        uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
        rand = rand % first_word.length;
        return first_word[rand];
    }

    function pickSecondWord(uint256 tokenId) public view returns(string memory) {
        uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
        rand = rand % second_word.length;
        return second_word[rand];
    }

    function pickThirdWord(uint256 tokenId) public view returns(string memory) {
        uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
        rand = rand % third_word.length;
        return third_word[rand];
    }

    function createEternalNFT() public returns(uint256) {
        _tokenId.increment();
        uint256 newItemId = _tokenId.current();

        string memory first = pickFirstWord(newItemId);
        string memory second = pickSecondWord(newItemId);
        string memory third = pickThirdWord(newItemId);
        string memory combinedWord = string(abi.encodePacked(first,second,third));

        string memory finalSvg = string(abi.encodePacked(baseSvg, first, second, third, "</text></svg>"));

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                    '{"name": "',
                        combinedWord,
                        '", "description": "A highly acclaimed collection Eternal Warriors", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(finalSvg)),
                    '"}'
                    )
                )
            )
        );

        string memory finalTokenURI = string(abi.encodePacked(
            "data:application/json;base64,", json
        ));

        //console.log(finalTokenURI);

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, finalTokenURI);
        setApprovalForAll(contractAddress, true);

        //emit EternalNFTMinted(msg.sender, newItemId);
        console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);

        //console.log(newItemId);
        return newItemId;
    }
}
