const { parentPort, workerData } = require("worker_threads");
// const TicketPool = require('./TicketPool');
// const { count } = require('console');

// Shared TicketPool instance
// const ticketPool = new TicketPool(workerData.maxCapacity);

const vendorId = workerData.vendorId;
parentPort.postMessage({ action: "addTickets", vendorId: vendorId });
setInterval(() => {
  // const count = Math.ceil(Math.random() * 5); // Add 1–5 tickets
  // await ticketPool.addTickets(vendorId, count);
  parentPort.postMessage({ action: "addTickets", vendorId: vendorId });
}, workerData.releaseRate * 1000); // Every 2 seconds
