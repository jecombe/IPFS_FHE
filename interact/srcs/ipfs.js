class Ipfs {
  constructor() {
    this.helia = null;
  }

  async create() {
    const { createHelia } = await import("helia");

    return createHelia();
  }

  async addData(string) {
    const { unixfs } = await import("@helia/unixfs");

    if (!this.helia) throw "helia not initialize";

    const fs = unixfs(this.helia);

    const encoder = new TextEncoder();
    const bytes = encoder.encode(string);
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
  Ipfs,
};
