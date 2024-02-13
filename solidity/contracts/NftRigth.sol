// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "fhevm/lib/TFHE.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

struct Data {
    euint32 privateKey;
}

contract NftRigth is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint => Data) private nftData;

    constructor() ERC721("DigitalNftRigth", "DNR") {}

    function mint() public {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        nftData[newTokenId].privateKey = createPrivateKeys();
        _safeMint(msg.sender, newTokenId);
    }

    function createPrivateKeys() internal view returns (euint32) {
        return TFHE.randEuint32();
    }

    function _baseURI() internal view override returns (string memory) {
        return "https://example.com/api/token/";
    }
}
