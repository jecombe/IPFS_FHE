// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "fhevm/lib/TFHE.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "fhevm/abstracts/EIP712WithModifier.sol";

struct Data {
    euint32 privateKey;
    address owner;
    euint32[] metadata;
}

contract NftRigth is ERC721, Ownable, EIP712WithModifier {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint => Data) private nftData;
    // mapping(uint => euint32) private prvKey;

    event NftCreate(address indexed user, uint256 indexed tokenId);
    event ChangeMessage(address indexed user, uint256 indexed tokenId);
    event GetData(address indexed user, uint256 indexed tokenId);

    constructor() ERC721("DigitalNftRigth", "DNR") EIP712WithModifier("Authorization token", "1") {}

    function addMetadata(bytes[] calldata _metadata) internal pure returns (euint32[] memory) {
        euint32[] memory meta = new euint32[](_metadata.length);

        for (uint i = 0; i < _metadata.length; i++) {
            meta[i] = TFHE.asEuint32(_metadata[i]);
        }
        return meta;
    }

    function mintNft(bytes[] calldata _metadata) external {
        uint256 newTokenId = _tokenIds.current();

        Data storage newData = nftData[newTokenId];
        newData.privateKey = createPrivateKeys();

        newData.metadata = addMetadata(_metadata);
        newData.owner = msg.sender;

        _tokenIds.increment();

        emit NftCreate(msg.sender, newTokenId);

        _safeMint(msg.sender, newTokenId);
    }

    function getData(bytes32 publicKey, uint256 tokenId) internal view returns (bytes[] memory) {
        Data storage data = nftData[tokenId];
        bytes[] memory result = new bytes[](data.metadata.length);
        for (uint i = 0; i < data.metadata.length; i++) {
            result[i] = TFHE.reencrypt(nftData[tokenId].metadata[i], publicKey, 0);
        }

        return result;
    }

    function accessData(
        uint256 tokenId,
        bytes32 publicKey,
        bytes calldata signature
    ) external view onlySignedPublicKey(publicKey, signature) returns (bytes[] memory) {
        require(msg.sender == ownerOf(tokenId), "You are not the owner of this token");
        return getData(publicKey, tokenId);
    }

    function createPrivateKeys() internal view returns (euint32) {
        return TFHE.randEuint32();
    }
}
