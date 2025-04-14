
const dgram = require("dgram");
const dnsPacket = require("dns-packet");

const server = dgram.createSocket("udp4");


// nslookup soa.jugal.dev 127.0.0.1


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

server.on("message", (msg, rinfo) => {
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

    server.send(response, rinfo.port, rinfo.address, () => {
      console.log(`QUESTION: ${question.name}  ${question.class}  ${question.type}`);
      answers.forEach(a => {
        console.log(`ANSWER:   ${a.name}  0  IN  ${a.type}  ${JSON.stringify(a.data)}`);
      });
    });

  } catch (err) {
    console.error("❌ Error decoding/responding:", err);
  }
});

server.bind(53, () => {
  console.log("🚀 DNS server running on port 53");
});
