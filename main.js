const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data)
    ).toString();
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, "01/04/2021", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

let grvCoin = new BlockChain();
grvCoin.addBlock(new Block(1, "02/04/2021", { amount: 4 }));
grvCoin.addBlock(new Block(2, "03/04/2021", { amount: 10 }));

console.log("Is BlockChain Valid? " + grvCoin.isChainValid());
console.log(JSON.stringify(grvCoin, null, 4));

grvCoin.chain[1].data = { amount: 100 };
grvCoin.chain[1].hash = grvCoin.chain[1].calculateHash();
console.log("Is BlockChain Valid? " + grvCoin.isChainValid());