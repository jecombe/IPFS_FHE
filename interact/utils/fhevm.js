const { createInstance } = require("fhevmjs");
const {
  JsonRpcProvider,
  Wallet,
  ethers
} = require("ethers");

const dotenv  = require("dotenv");

dotenv.config();

let _instance;
const provider = new JsonRpcProvider(process.env.PROVIDER);
console.log(process.env.SECRET, process.env.PROVIDER);
const signer = new Wallet(process.env.SECRET, provider);

 const createFhevmInstance = async () => {
  if (_instance) return _instance;

  // 1. Get chain id
  //console.log(provider);
  const network = await provider.getNetwork();

  const chainId = +network.chainId.toString();

  const ret = await provider.call({
    // fhe lib address, may need to be changed depending on network
    to: "0x000000000000000000000000000000000000005d",
    // first four bytes of keccak256('fhePubKey(bytes1)') + 1 byte for library
    data: "0xd9d47bb001",
  });
  const abiCoder = new ethers.AbiCoder();

  const decode = abiCoder.decode(["bytes"], ret);
  //const decoded = ethers.AbiCoder.defaultAbiCoder().decode(["bytes"], ret);
  const publicKey = decode[0];

  return createInstance({ chainId, publicKey });
};

 const getInstance = () => {
  return _instance;
};

 const getTokenSignature = async (contractAddress) => {
  if (getInstance().hasKeypair(contractAddress)) {
    return getInstance().getTokenSignature(contractAddress);
  } else {
    const generatedToken = getInstance().generatePublicKey({
      verifyingContract: process.env.CONTRACT,
    });
    const signature = await signer._signTypedData(
      generatedToken.eip712.domain,
      { Reencrypt: generatedToken.eip712.types.Reencrypt }, // Need to remove EIP712Domain from types
      generatedToken.eip712.message
    );
    getInstance().setSignature(contractAddress, signature);
    return { signature, publicKey: generatedToken.publicKey };
  }
};

module.exports = {
  getInstance,
  getTokenSignature,
  createFhevmInstance
}
