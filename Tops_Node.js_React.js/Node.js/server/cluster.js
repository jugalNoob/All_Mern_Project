const cluster = require('node:cluster');
const os = require('node:os');
const process = require('node:process');
const express = require('express');

const numCPUs = os.availableParallelism(); // Use number of CPU cores

let totalRequests = 0; // Track in master process

if (cluster.isPrimary) {
  console.log(`👑 Primary ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();

    // Setup message listener for each worker
    worker.on('message', (msg) => {
      if (msg.type === 'request') {
        totalRequests++;
        console.log(`📈 Total Requests: ${totalRequests}`);
      }
    });
  }

  // Auto-restart workers if they die
  cluster.on('exit', (worker, code, signal) => {
    console.log(`💀 Worker ${worker.process.pid} died. Restarting...`);
    const newWorker = cluster.fork();

    // Reattach message listener
    newWorker.on('message', (msg) => {
      if (msg.type === 'request') {
        totalRequests++;
        console.log(`📈 Total Requests: ${totalRequests}`);
      }
    });
  });

} else {
  // Worker process: start Express app
  const app = express();
  const PORT = 9000;

  app.get("/", (req, res) => {
    // Notify primary of request
    process.send({ type: 'request' });

    res.send(`Hello from Worker ${process.pid}`);
  });

  app.listen(PORT, () => {
    console.log(`🚀 Worker ${process.pid} is listening on port ${PORT}`);
  });
}
