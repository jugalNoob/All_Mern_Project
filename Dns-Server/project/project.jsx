const { Resolver } = require('node:dns');
const resolver = new Resolver();

// Use a reliable DNS server
resolver.setServers(['1.1.1.1']);

resolver.resolve4('karan.com.mx', (err, addresses) => {
  if (err) {
    console.error('DNS lookup failed:', err);
  } else {
    console.log('Resolved addresses:', addresses);
  }
});


/// --- >> Server Create owne ::::::::::000>>>>>>>

const dgram = require("dgram");
const dnsPacket = require("dns-packet");

const server = dgram.createSocket("udp4");


[ { type: 'A', address: '127.0.0.1', ttl: 299 },
  { type: 'CNAME', value: 'example.com' },
  { type: 'MX', exchange: 'alt4.aspmx.l.example.com', priority: 50 },
  { type: 'NS', value: 'ns1.example.com' },
  { type: 'TXT', entries: [ 'v=spf1 include:_spf.example.com ~all' ] },
  { type: 'SOA',
    nsname: 'ns1.example.com',
    hostmaster: 'admin.example.com',
    serial: 156696742,
    refresh: 900,
    retry: 900,
    expire: 1800,
    minttl: 60 } ] 


// Custom DNS database
const db = {
  "jugal.dev": {
    type: "A",
    data: "1.2.3.4",
  },
  "blog.jugal.dev": {
    type: "CNAME",
    data: "Hashnode.network",
  },
  "mail.jugal.dev": {
    type: "MX",
    data: { exchange: "mail.jugal.dev", preference: 10 },
  },
};

server.on("message", (msg, rinfo) => {
  try {
    const incomingReq = dnsPacket.decode(msg);
    const domain = incomingReq.questions[0].name;
    const ipFromDb = db[domain];

    if (!ipFromDb) return;

    const ans = dnsPacket.encode({
      type: "response",
      id: incomingReq.id,
      flags: dnsPacket.AUTHORITATIVE_ANSWER,
      questions: incomingReq.questions,
      answers: [
        {
          type: ipFromDb.type,
          class: "IN",
          name: domain,
          ttl: 300,
          data: ipFromDb.data,
        },
      ],
    });


    server.send(ans, rinfo.port, rinfo.address, () => {
      const q = incomingReq.questions[0];
      const a = ipFromDb;
    
      console.log(`QUESTION: ${q.name}  ${q.class}  ${q.type}`);
      console.log(`ANSWER:   ${q.name}  0  IN  ${ipFromDb.type}  ${ipFromDb.data}`);
    });

    // server.send(ans, rinfo.port, rinfo.address, () => {
    //   // Log the answer in proper format
    //   console.log(
    //     `${domain}   0   IN   ${ipFromDb.type}   ${JSON.stringify(ipFromDb.data)}`
    //   );
    // });
  } catch (err) {
    console.error("❌ Error decoding or responding:", err);
  }
});

server.bind(53, () => {
  console.log("🚀 DNS server running on port 53");
});


// 💡 Bonus Ideas
// Want to extend it?

// Add support for AAAA (IPv6)

// Log every DNS query to a file

// Add wildcard subdomains

// Build a dashboard with stats

// Proxy to public DNS if domain not found


// ✅ Options to Fix:
// 🔧 Option 1: Use nslookup Instead
// nslookup comes built-in with Windows:

// bash
// Copy
// Edit
// nslookup jugal.dev 127.0.0.1

//nslookup blog.jugal.dev 127.0.0.1


// dig @localhost google.com  
  // console.log({
  //   msg:incomingReq.questions[0].name,
  //   rinfo
  // })


  // const buf = dnsPacket.encode({
//   type: 'query',
//   id: 1,
//   flags: dnsPacket.RECURSION_DESIRED,
//   questions: [{
//     type: 'A',
//     name: 'google.com'
//   }]
// })


//Check ip all domanain server  ---------------------->>

const dns = require('node:dns');

dns.lookup('google.com', { family: 6 }, (err, address, family) => {
    console.log('IPv6 → address: %j family: IPv%s', address, family);
  });
  
  dns.lookup('google.com', { family: 4 }, (err, address, family) => {
    console.log('IPv4 → address: %j family: IPv%s', address, family);
  });



const dns = require('dns');
const dnsPromises = require('dns').promises;

(async () => {
  try {
    const address = await dnsPromises.lookup('google.com');
    console.log('Promise-based lookup:', address);
  } catch (err) {
    console.error('Error in promise-based lookup:', err);
  }
})();

dns.lookup('google.com', (err, address, family) => {
  if (err) return console.error('Error in lookup:', err);
  console.log('Callback-based lookup:', address);
});

dns.resolve4('facebook.com', (err, addresses) => {
  if (err) return console.error('Error in resolve4:', err);
  console.log('IPv4 addresses:', addresses);
});

dns.resolve6('google.com', (err, addresses) => {
  if (err) return console.error('Error in resolve6:', err);
  console.log('IPv6 addresses:', addresses);
});



/// ---- > Check Domanin server  Ip Address ------------>>

const express = require("express");
const { DNS, UDPClient, TCPClient } = require("dns2");

const app = express();
const port = 9000;

// UDP DNS client (default behavior)
const udpClient = UDPClient();

// TCP DNS client
const tcpClient = TCPClient();

// Route to resolve domain using UDP and TCP
app.get("/resolve/:domain", async (req, res) => {
  const domain = req.params.domain;
  let udpResult = null;
  let tcpResult = null;

  try {
    const response = await udpClient(domain);
    udpResult = response.answers.map(ans => ({
      name: ans.name,
      address: ans.address,
      type: ans.type,
    }));
  } catch (err) {
    udpResult = `UDP error: ${err.message}`;
  }

  try {
    const response = await tcpClient(domain);
    tcpResult = response.answers.map(ans => ({
      name: ans.name,
      address: ans.address,
      type: ans.type,
    }));
  } catch (err) {
    tcpResult = `TCP error: ${err.message}`;
  }

  res.json({
    domain,
    udpResult,
    tcpResult,
  });
});

app.listen(port, () => {
  console.log(`DNS resolver API running on port ${port}`);
});


// http://localhost:9000/resolve/facebook.com
