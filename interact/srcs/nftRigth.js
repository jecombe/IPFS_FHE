const {
  Wallet,
  Contract,
  ethers
} = require("ethers");
const path  = require("path");
const dotenv = requrie("dotenv");
dotenv.config();

let _instance;
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);

// const signer = new Wallet(process.env.SECRET, provider);
const abi = path.resolve(__dirname, "../../abi/NftRigth-abi.json");
const contract = new Contract(process.env.CONTRACT, abi, provider);

 class NftRigth {
  constructor() {
    
  }

}

module.exports = {
  NftRigth
}
