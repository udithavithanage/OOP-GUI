const { Worker } = require("worker_threads");
const TicketPool = require("./TicketPool");
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
const PORT = 3000;
app.use(cors());

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

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
        await ticketPool.addTickets(message.vendorId);
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
