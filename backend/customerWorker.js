const { parentPort, workerData } = require("worker_threads");
// const TicketPool = require('./TicketPool');

// Shared TicketPool instance
// const ticketPool = new TicketPool(workerData.maxCapacity);

const customerId = workerData.customerId;
parentPort.postMessage({ action: "purchaseTicket", customerId: customerId });
setInterval(() => {
  // const ticket = await ticketPool.removeTicket(customerId);
  parentPort.postMessage({ action: "purchaseTicket", customerId: customerId });
}, workerData.customerRetrieveRate * 1000); // Every 1.5 seconds
