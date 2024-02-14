import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";

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
    const helia = await create();
    const rep = await addData(helia);
    console.log(rep);
  } catch (error) {
    console.log(error);

  }
};

start();
