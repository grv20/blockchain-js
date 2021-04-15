const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash;
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      String(this.hash).substring(0, difficulty) !==
      Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    //keep calculating hash untill you get has value where, num of zeroes upfront === difficulty
    console.log("Block mined: " + this.hash);
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block("01/04/2021", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  //   addBlock(newBlock) {
  //     newBlock.previousHash = this.getLatestBlock().hash;
  //     //newBlock.hash = newBlock.calculateHash();
  //     newBlock.mineBlock(this.difficulty);
  //     this.chain.push(newBlock);
  //   }

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    //in reality miners have to pick which transaction goes, since
    //there are many transaction happening in 10mins and size of block is limited to 1MB
    block.mineBlock(this.difficulty);

    console.log("Block successfully mined!");
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
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
//-----------1--------------------------
// grvCoin.addBlock(new Block(1, "02/04/2021", { amount: 4 }));
// grvCoin.addBlock(new Block(2, "03/04/2021", { amount: 10 }));

// console.log("Is BlockChain Valid? " + grvCoin.isChainValid());
// console.log(JSON.stringify(grvCoin, null, 4));

// grvCoin.chain[1].data = { amount: 100 };
// grvCoin.chain[1].hash = grvCoin.chain[1].calculateHash();
// console.log("Is BlockChain Valid? " + grvCoin.isChainValid());

//-----------------2------------------
// console.log("Mining block 1...");
// grvCoin.addBlock(new Block(1, "02/04/2021", { amount: 4 }));
// console.log("Mining block 2...");
// grvCoin.addBlock(new Block(2, "03/04/2021", { amount: 10 }));
// console.log(JSON.stringify(grvCoin, null, 4));

//----------3------------------
grvCoin.createTransaction(new Transaction("address1", "address2", 100));
//first transaction is noted down.. then added to pending transaction array.
grvCoin.createTransaction(new Transaction("address2", "address1", 50));
console.log("\n Starting the miner....");
grvCoin.minePendingTransactions("xaviers-address");
//miner initiates new block by sending timestamp & pending transaction array
//then with given difficulty block will be mined(hashes generated)
//then push the block to the chain
//award the miner
console.log(
  "\nBalance of xavier is",
  grvCoin.getBalanceOfAddress("xaviers-address")
);
console.log("\n Starting the miner again....");
grvCoin.minePendingTransactions("xaviers-address");
console.log(
  "\nBalance of xavier is",
  grvCoin.getBalanceOfAddress("xaviers-address")
);
