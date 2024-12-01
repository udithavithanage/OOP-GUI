const { Mutex } = require("async-mutex");
// const {upadateClients} = require('./main.js');

class TicketPool {
  constructor(
    maxCapacity,
    vendorCount,
    customerCount,
    upadateClients,
    totalTicketCount
  ) {
    this.totalTicketCount = totalTicketCount;
    this.addCount = 0;
    this.upadateClients = upadateClients;
    this.pool = [];
    this.maxCapacity = maxCapacity;
    this.mutex = new Mutex();
    this.vendors = {};
    this.customers = {};
    for (let i = 1; i <= vendorCount; i++) {
      this.vendors[i] = { add: 0, sale: 0 };
    }

    for (let i = 1; i <= customerCount; i++) {
      this.customers[i] = { sale: 0 };
    }
  }

  async addTickets(vendorId) {
    await this.mutex.runExclusive(() => {
      if (
        this.pool.length < this.maxCapacity &&
        this.addCount < this.totalTicketCount
      ) {
        // for (let i = 0; i < count; i++) {
        //     const ticket = `Vendor-${vendorId}-Ticket-${Date.now()}-${i}`;
        //     this.pool.push(ticket);
        // }

        // const ticket = `Vendor-${vendorId}-Ticket-${Date.now()}`;
        const ticket = {
          vendorId: vendorId,
          ticket: Date.now(),
        };
        this.pool.push(ticket);
        this.vendors[vendorId].add += 1;
        this.addCount += 1;
        this.upadateClients([
          this.totalTicketCount,
          this.addCount,
          this.pool.length,
          this.maxCapacity,
          this.vendors,
          this.customers,
        ]);
        // console.log(`Vendor-${vendorId} added ticket.`);
      }
    });
  }

  async removeTicket(customerId) {
    return await this.mutex.runExclusive(() => {
      if (this.pool.length > 0) {
        const ticket = this.pool.shift();
        this.vendors[ticket.vendorId].sale += 1;
        this.customers[customerId].sale += 1;
        this.upadateClients([
          this.totalTicketCount,
          this.addCount,
          this.pool.length,
          this.maxCapacity,
          this.vendors,
          this.customers,
        ]);
        // console.log(`Customer-${customerId} purchased ${ticket}.`);
        return ticket;
      } else {
        // console.log(`Customer-${customerId} could not purchase. No tickets available.`);
        return null;
      }
    });
  }

  // getTickets() {
  //     return this.pool;
  // }
}

module.exports = TicketPool;