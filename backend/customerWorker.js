const { parentPort, workerData } = require("worker_threads");

class Customers {
  constructor(customerId, customerRetrieveRate) {
    this.customerId = customerId;
    this.customerRetrieveRate = customerRetrieveRate;
  }

  postMessageToParent() {
    parentPort.postMessage({
      action: "purchaseTicket",
      customerId: this.customerId,
    });
    setInterval(() => {
      parentPort.postMessage({
        action: "purchaseTicket",
        customerId: this.customerId,
      });
    }, this.customerRetrieveRate * 1000);
  }
}

const Customer = new Customers(
  workerData.customerId,
  workerData.customerRetrieveRate
);

Customer.postMessageToParent();
