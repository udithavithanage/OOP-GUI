const { Worker } = require("worker_threads");
const TicketPool = require("./TicketPool");
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
const PORT = 3000;
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server using the HTTP server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("New client connected");

  // Send a welcome message to the client
  // ws.send('Welcome to the WebSocket server!');

  // Handle incoming messages from the client
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
    //   ws.send(`Echo: ${message}`); // Echo the message back
  });

  // Handle client disconnect
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const upadateClients = (vendors) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(vendors));
    }
  });
};

// module.exports = {upadateClients};

var start = false;

const middleware = (req, res, next) => {
  if (start) {
    res.send("System already running...");
  } else {
    start = true;
    next();
  }
};

var threads = [];

app.get("/", middleware, (req, res) => {
  const maxCapacity = req.query.maxTicketCapacity;
  const numberOfVendors = req.query.numberOfVendors;
  const numberOfCustomers = req.query.numberOfCustomers;
  const releaseRate = req.query.ticketReleaseRate;
  const customerRetrieveRate = req.query.customerRetrieveRate;
  const totalTicketCount = req.query.totalTicketCount;

  // Shared TicketPool instance
  const ticketPool = new TicketPool(
    maxCapacity,
    numberOfVendors,
    numberOfCustomers,
    upadateClients,
    totalTicketCount
  );

  // Start vendors as worker threads
  for (let i = 1; i <= numberOfVendors; i++) {
    const vendorWorker = new Worker("./vendorWorker.js", {
      workerData: { vendorId: i, releaseRate: releaseRate },
    });
    threads.push(vendorWorker);

    vendorWorker.on("message", async (message) => {
      if (message.action === "addTickets") {
        // const count = Math.ceil(Math.random() * 5); // Add 1–5 tickets
        await ticketPool.addTickets(message.vendorId);
        // console.log(`Vendor-${message.vendorId} added ${count} tickets.`);
      }
    });

    vendorWorker.on("error", (err) => {
      console.error(`Error from Vendor-${i}:`, err);
    });

    vendorWorker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Vendor-${i} stopped with exit code ${code}`);
      }
    });
  }

  // Start customers as worker threads
  for (let i = 1; i <= numberOfCustomers; i++) {
    const customerWorker = new Worker("./customerWorker.js", {
      workerData: { customerId: i, customerRetrieveRate: customerRetrieveRate },
    });
    threads.push(customerWorker);

    customerWorker.on("message", async (message) => {
      if (message.action === "purchaseTicket") {
        const ticket = await ticketPool.removeTicket(message.customerId);
        // if (ticket) {
        //     console.log(`Customer-${message.customerId} purchased ${ticket}`);
        // } else {
        //     console.log(`Customer-${message.customerId} could not purchase. No tickets available.`);
        // }
      }
    });

    customerWorker.on("error", (err) => {
      console.error(`Error from Customer-${i}:`, err);
    });

    customerWorker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Customer-${i} stopped with exit code ${code}`);
      }
    });
  }

  res.send("System start");
});

app.get("/stop", (req, res) => {
  threads.forEach((thread) => {
    thread.terminate().catch((err) => {
      console.error("Error terminating thread:", err);
    });
  });
  start = false;
  threads = [];
  res.send("Terminated all threads and stopped the system.");
});
