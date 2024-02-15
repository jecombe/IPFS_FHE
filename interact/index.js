 const { Ipfs } = require("./srcs/ipfs.js");
const { createFhevmInstance } = require("./utils/fhevm.js");

const start = async () => {
  try {
    await createFhevmInstance();
    // const ipfs = new Ipfs()
   // const ipfs = new Ipfs();
    // await ipfs.start()
   // const rep = await ipfs.addData();

    // const helia = await create();
    // const rep = await addData(helia);
  } catch (error) {
    console.log(error);
  }
};

start();
