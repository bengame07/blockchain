const fetch = require('node-fetch')

const Blockchain = require("./Blockchain");
const express = require('express')
const socketListener = require('./SocketListener')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const client = require('socket.io-client')

const PORT = process.env.PORT || 3001;
app.use(express.json());

const blockchain = new Blockchain(io)

app.get('/blocks',(req,res) => {
    res.json(blockchain.chain)
});

app.post('/mine', (req,res) =>{
    const {sender, receiver, qty} = req.body
    io.emit('mine', sender, receiver, qty)
    res.redirect('/blocks');
});

app.post('/nodes', (req,res) =>{
    const {host, port} = req.body;
    const {callback} = req.query;
    const node = `http://${host}:${port}`;
    const socketNode = socketListener(client(node), blockchain)
    blockchain.addNewNode(socketNode);

    if(callback === 'true'){
        console.info(`Node ${node} added via callback`)
        res.json({status: 'Added node', node: node, callback : true})
    }else{
        fetch(`${node}/nodes?callback=true`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({host: req.hostname, port: PORT})
        })
        res.json({status: 'Added node', node: node, callback : false})
    }
})

app.get('/nodes',(req,res) => {
    res.json(blockchain.chain)
});

io.on('connection', (socket) => {
    console.info(`Socket connected ${socket.id}`)
    socket.on('disconnect', () => {
        console.info('Socket disconnect')
    })
})
blockchain.addNewNode(socketListener(client(`http://localhost:${PORT}`), blockchain))

http.listen(PORT, () => {
    console.log("listening on port", PORT);
});