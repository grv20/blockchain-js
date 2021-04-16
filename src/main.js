const { BlockChain, Transaction } = require("./blockchain");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate(
  "eb6de7362ec1d032db26b9a8e88e8b16d2fb3ba177ba0ac103786a5c6c416d79"
);
const myWalletAddress = myKey.getPublic("hex");

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
// grvCoin.createTransaction(new Transaction("address1", "address2", 100));
// //first transaction is noted down.. then added to pending transaction array.
// grvCoin.createTransaction(new Transaction("address2", "address1", 50));
// console.log("\n Starting the miner....");
// grvCoin.minePendingTransactions("xaviers-address");
// //miner initiates new block by sending timestamp & pending transaction array
// //then with given difficulty block will be mined(hashes generated)
// //then push the block to the chain
// //award the miner
// console.log(
//   "\nBalance of xavier is",
//   grvCoin.getBalanceOfAddress("xaviers-address")
// );
// //balance shows zero, because reqwrd is added to pending transactions
// console.log("\n Starting the miner again....");
// grvCoin.minePendingTransactions("xaviers-address");
// console.log(
//   "\nBalance of xavier is",
//   grvCoin.getBalanceOfAddress("xaviers-address")
// );

//--------------4------------------------
console.log("\n Starting the miner....");
grvCoin.minePendingTransactions(myWalletAddress);
console.log(
  "\nBalance of xavier is",
  grvCoin.getBalanceOfAddress(myWalletAddress)
);
const tx1 = new Transaction(myWalletAddress, "public address goes here", 10);
//walletAddress is generated using private key assigned to user
//also fromAddress is myWalletAddress
tx1.signTransaction(myKey);
//verifies walletAddress with fromAddress, then sign key with generated hex code
//from toAddress and fromAddress
grvCoin.addTransaction(tx1);
//add Transaction to pening list after checking validity
console.log("\n Starting the miner....");
grvCoin.minePendingTransactions(myWalletAddress);
console.log(JSON.stringify(grvCoin, null, 4));
console.log(
  "\nBalance of xavier is",
  grvCoin.getBalanceOfAddress(myWalletAddress)
);

console.log("Is chain valid?", grvCoin.isChainValid());
