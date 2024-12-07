const { parentPort, workerData } = require("worker_threads");

class Vendors {
  constructor(vendorId, releaseRate) {
    this.vendorId = vendorId;
    this.releaseRate = releaseRate;
  }

  postMessageToParent() {
    parentPort.postMessage({ action: "addTickets", vendorId: this.vendorId });
    setInterval(() => {
      parentPort.postMessage({ action: "addTickets", vendorId: this.vendorId });
    }, this.releaseRate * 1000);
  }
}

const vendor = new Vendors(workerData.vendorId, workerData.releaseRate);
vendor.postMessageToParent();
