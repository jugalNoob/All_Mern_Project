const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const proxy = httpProxy.createProxyServer({});

// Log incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request for: ${req.url}`);
    next(); // Call the next middleware or route handler
});

// Example route
app.get('/home', (req, res) => {
    res.send('Welcome to the home page!');
});

// Proxy all other requests
app.use((req, res) => {
    proxy.web(req, res, { target: 'http://www.example.com' }, (error) => {
        console.error(`Proxy error: ${error.message}`);
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Bad Gateway');
    });
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});



// The IP address 127.0.0.1 is the loopback address, or localhost, of a computer: 



// const http = require('http');
// const httpProxy = require('http-proxy');

// const proxy = httpProxy.createProxyServer({});

// const server = http.createServer((req, res) => {
//     proxy.web(req, res, { target: 'http://www.example.com' });
// });

// server.listen(8080, () => {
//     console.log('Proxy server running on http://localhost:8080');
// });





// const net = require('net');

// class BlockList {
//     constructor() {
//         this.blockedAddresses = new Set();
//         this.blockedRanges = [];
//         this.blockedSubnets = [];
//     }

//     addAddress(address) {
//         this.blockedAddresses.add(address);
//     }

//     addRange(start, end) {
//         this.blockedRanges.push({ start, end });
//     }

//     addSubnet(subnet, mask, version) {
//         this.blockedSubnets.push({ subnet, mask, version });
//     }

//     check(address) {
//         if (this.blockedAddresses.has(address)) {
//             return true;
//         }

//         // Check ranges and subnets here (additional logic needed)
//         return false;
//     }
// }

// // Example usage
// const blockList = new BlockList();
// blockList.addAddress('123.123.123.123');
// blockList.addRange('10.0.0.1', '10.0.0.10');

// console.log(blockList.check('123.123.123.123'));  // Prints: true
// console.log(blockList.check('10.0.0.3'));  // Implementation required to handle ranges
// console.log(blockList.check('222.111.111.222'));  // Prints: false
