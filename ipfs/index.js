import { Ipfs } from "./srcs/ipfs.js";

const create = async () => {
  return createHelia();
};

const addData = async (helia) => {
  const fs = unixfs(helia);

  // we will use this TextEncoder to turn strings into Uint8Arrays
  const encoder = new TextEncoder();
  const bytes = encoder.encode("TESTING");

  // add the bytes to your node and receive a unique content identifier
  const cid = await fs.addBytes(bytes);

  return cid.toString();
};

const start = async () => {
  try {
    const ipfs = new Ipfs();
    await ipfs.start()
    const rep = await ipfs.addData();
    // const helia = await create();
    // const rep = await addData(helia);
  } catch (error) {
    console.log(error);
  }
};

start();
