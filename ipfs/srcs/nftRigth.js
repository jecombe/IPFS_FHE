import { createInstance } from "fhevmjs";
import {
  Wallet,
  Contract,
  ethers
} from "ethers";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

let _instance;
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);

// const signer = new Wallet(process.env.SECRET, provider);
const abi = path.resolve(__dirname, "../../abi/NftRigth-abi.json");
const contract = new Contract(process.env.CONTRACT, abi, provider);


export class NftRigth {
  constructor() {
  }

}
