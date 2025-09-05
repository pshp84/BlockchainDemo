const crypto = require("crypto");

class Block {
  constructor(index, timestamp, transactions, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(this.index + this.timestamp + JSON.stringify(this.transactions) + this.previousHash)
      .digest("hex");
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, Date.now().toString(), "Genesis Block", "0");
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
      const prevBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) return false;
      if (currentBlock.previousHash !== prevBlock.hash) return false;
    }
    return true;
  }
}

// Example usage
let miniCoin = new Blockchain();
miniCoin.addBlock(new Block(1, Date.now().toString(), { from: "Alice", to: "Bob", amount: 1 }));
miniCoin.addBlock(new Block(2, Date.now().toString(), { from: "Bob", to: "Charlie", amount: 2 }));

console.log(JSON.stringify(miniCoin, null, 2));
console.log("Is blockchain valid?", miniCoin.isChainValid());
