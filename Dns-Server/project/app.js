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
