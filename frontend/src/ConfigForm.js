import React, { useState } from "react";

function ConfigForm({ resetgraph }) {
  const [formData, setFormData] = useState({
    totalTicketCount: "",
    ticketReleaseRate: "",
    customerRetrieveRate: "",
    maxTicketCapacity: "",
    numberOfVendors: "",
    numberOfCustomers: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      totalTicketCount: "",
      ticketReleaseRate: "",
      customerRetrieveRate: "",
      maxTicketCapacity: "",
      numberOfVendors: "",
      numberOfCustomers: "",
    });
  };

  const handleStart = () => {
    fetch(
      `http://localhost:3000?totalTicketCount=${formData.totalTicketCount}&ticketReleaseRate=${formData.ticketReleaseRate}&customerRetrieveRate=${formData.customerRetrieveRate}&maxTicketCapacity=${formData.maxTicketCapacity}&numberOfVendors=${formData.numberOfVendors}&numberOfCustomers=${formData.numberOfCustomers}`
    )
      .then((res) => res.text())
      .then((text) => {
        if (text == "System already running...") {
          console.log(text);
        } else {
          resetgraph();
          console.log(text);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleStop = () => {
    fetch("http://localhost:3000/stop")
      .then((res) => res.text())
      .then((text) => console.log(text))
      .catch((error) => console.log(error));
  };

  return (
    <div style={{ width: "25%", margin: "2%" }}>
      <center>
        <h2>Configuration Form</h2>
      </center>
      <div className="form-floating mb-3">
        <input
          type="number"
          className="form-control"
          name="totalTicketCount"
          value={formData.totalTicketCount}
          onChange={handleInputChange}
          placeholder="Total Ticket Count"
          min={1}
        />
        <label htmlFor="floatingInput">Total Ticket Count</label>
      </div>

      <div className="form-floating mb-3">
        <input
          type="number"
          className="form-control"
          name="ticketReleaseRate"
          value={formData.ticketReleaseRate}
          onChange={handleInputChange}
          placeholder="Ticket Release Rate (Seconds)"
          min={1}
        />
        <label htmlFor="floatingPassword">Ticket Release Rate (Seconds)</label>
      </div>

      <div className="form-floating mb-3">
        <input
          type="number"
          className="form-control"
          name="customerRetrieveRate"
          value={formData.customerRetrieveRate}
          onChange={handleInputChange}
          placeholder="Customer Retrieve Rate (Seconds)"
          min={1}
        />
        <label htmlFor="floatingPassword">
          Customer Retrieve Rate (Seconds)
        </label>
      </div>

      <div className="form-floating mb-3">
        <input
          type="number"
          className="form-control"
          name="maxTicketCapacity"
          value={formData.maxTicketCapacity}
          onChange={handleInputChange}
          placeholder="Maximum Ticket Capacity"
          min={1}
        />
        <label htmlFor="floatingPassword">
          Maximum Ticket Capacity in Ticket Pool
        </label>
      </div>

      <div className="form-floating mb-3">
        <input
          type="number"
          className="form-control"
          name="numberOfVendors"
          value={formData.numberOfVendors}
          onChange={handleInputChange}
          placeholder="Number of Vendors"
          min={1}
        />
        <label htmlFor="floatingPassword">Number of Vendors</label>
      </div>

      <div className="form-floating mb-3">
        <input
          type="number"
          className="form-control"
          name="numberOfCustomers"
          value={formData.numberOfCustomers}
          onChange={handleInputChange}
          placeholder="Number of Customers"
          min={1}
        />
        <label htmlFor="floatingPassword">Number of Customers</label>
      </div>

      <div className="buttons">
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={handleStart}
        >
          Start
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={handleStop}
        >
          Stop
        </button>
      </div>
    </div>
  );
}

export default ConfigForm;
