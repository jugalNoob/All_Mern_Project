const express = require("express");
const dgram = require("dgram");
const dnsPacket = require("dns-packet");

// Create UDP server for DNS
const udpServer = dgram.createSocket("udp4");

// Custom DNS database
const db = {
  "jugal.dev": [
    { type: "A", data: "1.2.3.4" },
    { type: "AAAA", data: "2606:4700:4700::1111" }
  ],
  "blog.jugal.dev": [
    { type: "CNAME", data: "hashnode.network" }
  ],
  "mail.jugal.dev": [
    { type: "MX", data: { exchange: "mail.jugal.dev", preference: 10 } }
  ],
  "ns.jugal.dev": [
    { type: "NS", data: "ns1.jugal.dev" }
  ],
  "txt.jugal.dev": [
    { type: "TXT", data: "v=spf1 include:_spf.jugal.dev ~all" }
  ],
  "soa.jugal.dev": [
    {
      type: "SOA",
      data: {
        mname: "ns1.jugal.dev",
        rname: "admin.jugal.dev",
        serial: 2025041201,
        refresh: 3600,
        retry: 1800,
        expire: 604800,
        minimum: 60
      }
    }
  ]
};

// UDP DNS server logic
udpServer.on("message", (msg, rinfo) => {
  try {
    const incomingReq = dnsPacket.decode(msg);
    const question = incomingReq.questions[0];
    const domain = question.name;
    const records = db[domain];

    if (!records) return;

    const answers = records.map(record => ({
      type: record.type,
      class: "IN",
      name: domain,
      ttl: 300,
      data: record.data
    }));

    const response = dnsPacket.encode({
      type: "response",
      id: incomingReq.id,
      flags: dnsPacket.AUTHORITATIVE_ANSWER,
      questions: [question],
      answers
    });

    udpServer.send(response, rinfo.port, rinfo.address, () => {
      console.log(`[${new Date().toISOString()}] ${rinfo.address}:${rinfo.port} → ${question.name}`);
      console.log(`QUESTION: ${question.name}  ${question.class}  ${question.type}`);
      answers.forEach(a => {
        console.log(`ANSWER:   ${a.name}  0  IN  ${a.type}  ${JSON.stringify(a.data)}`);
      });
    });

  } catch (err) {
    console.error("❌ Error decoding/responding:", err);
  }
});

udpServer.bind(53, () => {
  console.log("🚀 DNS server running on port 53 (UDP)");
});

// Create Express server for HTTP requests
const app = express();
const port = 3000;

// Route to handle DNS lookups via HTTP
app.get("/dns", (req, res) => {
  const { name, type } = req.query;

  if (!name || !type) {
    return res.status(400).json({ error: "Missing 'name' or 'type' query parameter" });
  }

  const domainRecords = db[name];

  if (!domainRecords) {
    return res.status(404).json({ error: `No records found for ${name}` });
  }

  const record = domainRecords.find(r => r.type === type);

  if (!record) {
    return res.status(404).json({ error: `No ${type} record found for ${name}` });
  }

  res.json({ name, type, data: record.data });
});

// Start Express HTTP server
app.listen(port, () => {
  console.log(`🌐 HTTP server running at http://localhost:${port}`);
});



// http://localhost:3000/dns?name=jugal.dev&type=A
// {
//     "name": "jugal.dev",
//     "type": "A",
//     "data": "1.2.3.4"
//   }
  
// http://localhost:3000/dns?name=blog.jugal.dev&type=CNAME
// {
//     "name": "blog.jugal.dev",
//     "type": "CNAME",
//     "data": "hashnode.network"
//   }
  


// Things You Can Add Next:
// Error Handling: Improve the error handling in the HTTP route (e.g., invalid queries).

// More DNS Record Types: Add more DNS record types (e.g., PTR, SRV, etc.) to your database.

// Zone File Support: Load records from a .zone file to support bulk DNS record loading.

// Advanced Features: Implement DNS-over-HTTPS (DoH) for secure DNS queries over HTTP.

// Caching: Implement caching to avoid repetitive DNS lookups for the same queries.

