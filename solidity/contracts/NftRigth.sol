// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "fhevm/lib/TFHE.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "fhevm/abstracts/EIP712WithModifier.sol";

struct Data {
    euint32 privateKey;
    euint32 metadata;
}

struct ReadData {
    bytes metadata;
}

contract NftRigth is ERC721, Ownable, EIP712WithModifier {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint => Data) private nftData;

    event NftCreate(address indexed user, uint256 indexed tokenId);
    event ChangeMessage(address indexed user, uint256 indexed tokenId);
    event GetData(address indexed user, uint256 indexed tokenId);

    constructor() ERC721("DigitalNftRigth", "DNR") EIP712WithModifier("Authorization token", "1") {}

    modifier isOwner(uint256 tokenId) {
        _;
    }

    function mint(bytes calldata _metadata) external {
        euint32 data = TFHE.asEuint32(_metadata);
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        nftData[newTokenId].privateKey = createPrivateKeys();
        nftData[newTokenId].metadata = data;
        _safeMint(msg.sender, newTokenId);
    }

    function changeData(uint256 tokenId, bytes calldata _newMetadata) external {
        require(msg.sender == ownerOf(tokenId), "You are not the owner of this token");
        nftData[tokenId].metadata = TFHE.asEuint32(_newMetadata);
        emit ChangeMessage(msg.sender, tokenId);
    }

    function getData(Data memory _nftData, bytes32 publicKey) internal view returns (ReadData memory) {
        bytes memory meta = TFHE.reencrypt(_nftData.metadata, publicKey, 0);
        return ReadData(meta);
    }

    function accessData(
        uint256 tokenId,
        bytes32 publicKey,
        bytes calldata signature
    ) external view onlySignedPublicKey(publicKey, signature) returns (ReadData memory) {
        require(msg.sender == ownerOf(tokenId), "You are not the owner of this token");
        return getData(nftData[tokenId], publicKey);
    }

    function createPrivateKeys() internal view returns (euint32) {
        return TFHE.randEuint32();
    }
}
