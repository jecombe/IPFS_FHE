// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "fhevm/lib/TFHE.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "fhevm/abstracts/EIP712WithModifier.sol";

struct Data {
    address owner;
    euint32[] metadata;
}

contract NftRigth is ERC721, Ownable, EIP712WithModifier {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => Data) private nftData;
    mapping(address => mapping(uint => euint32)) privateKey;
    mapping(uint256 => address) idsOwner;

    // mapping(uint => euint32) private prvKey;

    event NftCreate(address indexed user, uint256 indexed tokenId);
    event ChangeMessage(address indexed user, uint256 indexed tokenId);

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

        if (TFHE.decrypt(TFHE.eq(privateKey[msg.sender][newTokenId], 0))) {
            privateKey[msg.sender][newTokenId] = createPrivateKeys();
        }

        newData.metadata = addMetadata(_metadata);

        newData.owner = msg.sender;

        _tokenIds.increment();

        emit NftCreate(msg.sender, newTokenId);

        _safeMint(msg.sender, newTokenId);
    }

    // function getOwnerOf(uint256 tokenId) public view returns (address) {
    //     return idsOwner[tokenId];
    // }

    function comparePrivateKeys(euint32 _privateKey, address owner, uint256 tokenId) internal view {
        TFHE.optReq(TFHE.eq(_privateKey, TFHE.decrypt(privateKey[owner][tokenId])));
    }

    function isOwner(address owner, uint256 tokenId) internal view {
        require(owner == ownerOf(tokenId), "You are not the owner of this token");
    }

    function addingData(uint256 tokenId, bytes calldata metadata, bytes calldata _privateKey) external {
        isOwner(msg.sender, tokenId);
        comparePrivateKeys(TFHE.asEuint32(_privateKey), msg.sender, tokenId);

        nftData[tokenId].metadata.push(TFHE.asEuint32(metadata));
    }

    function cleanMapping(uint256 tokenId) internal {
        delete nftData[tokenId];
        //   delete privateKey[msg.sender][tokenId];
        delete idsOwner[tokenId];
    }

    function burnNft(uint256 tokenId, bytes calldata _privateKey) external {
        isOwner(msg.sender, tokenId);
        comparePrivateKeys(TFHE.asEuint32(_privateKey), msg.sender, tokenId);
        cleanMapping(tokenId);
        _burn(tokenId);
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
        bytes calldata signature,
        bytes calldata _privateKey
    ) external view onlySignedPublicKey(publicKey, signature) returns (bytes[] memory) {
        isOwner(msg.sender, tokenId);
        comparePrivateKeys(TFHE.asEuint32(_privateKey), msg.sender, tokenId);
        return getData(publicKey, tokenId);
    }

    function getPrivateKeys(
        uint256 tokenId,
        bytes32 publicKey,
        bytes calldata signature
    ) public view onlySignedPublicKey(publicKey, signature) returns (bytes memory) {
        return TFHE.reencrypt(privateKey[msg.sender][tokenId], publicKey, 0);
    }

    function createPrivateKeys() internal view returns (euint32) {
        return TFHE.randEuint32();
    }
}
