const { createHelia } = require("helia");
const { unixfs } = require("@helia/unixfs");

 class Ipfs {
  constructor() {
    this.helia = null;
  }

  async create() {
    return createHelia();
  }

  async addData() {
    if (!this.helia) throw "helia not initialize";

    const fs = unixfs(this.helia);

    const encoder = new TextEncoder();
    const bytes = encoder.encode("TESTING");
    try {
      const cid = await fs.addBytes(bytes);

      return cid.toString();
    } catch (error) {
      return error;
    }
  }

  async start() {
    try {
      this.helia = await this.create();
    } catch (error) {
      return error;
    }
  }
}

module.exports = {
  Ipfs
}