/// --- >> Server Create owne ::::::::::000>>>>>>>

const dgram = require("dgram");
const dnsPacket = require("dns-packet");

const server = dgram.createSocket("udp4");

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
