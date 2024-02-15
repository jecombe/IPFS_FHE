import { createInstance } from "fhevmjs";
import {
  Wallet,
  Contract,
  ethers
} from "ethers";
import dotenv from "dotenv";
dotenv.config();

let _instance;
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);

const signer = new Wallet(process.env.SECRET, provider);

const createFhevmInstance = async () => {
  if (_instance) return _instance;

  const network = await provider.getNetwork();

  const chainId = +network.chainId.toString();

  const ret = await provider.call({
    to: "0x000000000000000000000000000000000000005d",
    data: "0xd9d47bb001",
  });
  const abiCoder = new ethers.utils.AbiCoder();

  const decode = abiCoder.decode(["bytes"], ret);
  const publicKey = decode[0];

  _instance = await createInstance({ chainId, publicKey });
};

const getInstance = () => {
  return _instance;
};

const getTokenSignature = async (contractAddress, userAddress) => {
  if (getInstance().hasKeypair(contractAddress)) {
    return getInstance().getTokenSignature(contractAddress);
  } else {
    const generatedToken = getInstance().generatePublicKey({
      verifyingContract: process.env.GAME,
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
