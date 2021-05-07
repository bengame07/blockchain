const Block = require('./Block')

const socketListener = (socket, chain) => {
    socket.on('mine', (sender, receiver, qty) => {
        let block = new Block({ sender, receiver, qty })
        chain.addNewBlock(block)
        console.info(`Block number ${block.index} just mined`)
    })
    socket.on('blockmined', (newChain, time) =>{
        if (chain.chain[chain.chain.length-1].timestamp > time)
        {
            console.log(newChain);
            chain.chain = newChain;
            console.info('Blockchain synchronized')
        }
    })
    return socket
}

module.exports = socketListener