const sha2566 = require('crypto-js/sha256')

class Block{
    constructor(data, mydate){
        this.nonce = 0
        this.index = 0
        this.timestamp = mydate
        this.data = data
        this.precedinglash = "0"
        this.hash = this.computeHash()
    }

    computeHash(){
        return sha2566(this.index + this.precedingHash + this.timestamp + JSON.stringify(this.data)+this.nonce).toString();
    }

    proofOfWork(difficulty){
        while(this.hash.substring(0, difficulty) !==Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.computeHash();
        }      
        this.timestamp = Date.now();  
        this.hash = this.computeHash();
    }
}

module.exports = Block