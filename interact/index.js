const { Ipfs } = require("./srcs/ipfs.js");
// const { createFhevmInstance } = require("./utils/fhevm.js");

const { EventEmitter } = require('events');

const abortSignal = new EventEmitter();

abortSignal.setMaxListeners(20);

abortSignal.on('abort', () => {
});

const start = async () => {
  try {
  //  await createFhevmInstance();
    const ipfs = new Ipfs();
    // const ipfs = new Ipfs();
    await ipfs.start();
    const rep = await ipfs.addData("addData");
    console.log(rep);

    // const helia = await create();
    // const rep = await addData(helia);
  } catch (error) {
    console.log(error);
  }
};

start();
