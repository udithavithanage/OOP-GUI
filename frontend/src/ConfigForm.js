import React, { useRef, useState } from "react";
import Alert from "./Alert.js";

var msg;

function ConfigForm({ resetgraph }) {
  const [formData, setFormData] = useState({
    totalTicketCount: "",
    ticketReleaseRate: "",
    customerRetrieveRate: "",
    maxTicketCapacity: "",
    numberOfVendors: "",
    numberOfCustomers: "",
  });

  const refs = useRef([]);

  const [alert, setAlert] = useState(false);

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

    fetch("http://localhost:3000/stop")
      .then((res) => res.text())
      .then((text) => console.log(text))
      .catch((error) => console.log(error));

    resetgraph();
  };

  const handleStart = () => {
    if (
      formData.totalTicketCount > 0 &&
      formData.ticketReleaseRate > 0 &&
      formData.customerRetrieveRate > 0 &&
      formData.maxTicketCapacity > 0 &&
      formData.numberOfVendors > 0 &&
      formData.numberOfCustomers > 0
    ) {
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
    } else {
      formData.totalTicketCount < 1
        ? (msg = "Total Ticket Count must be greater than 1.")
        : formData.ticketReleaseRate < 1
        ? (msg = "Ticket Release Rate must be greater than 1.")
        : formData.customerRetrieveRate < 1
        ? (msg = "Customer Retrieve Rate must be greater than 1.")
        : formData.maxTicketCapacity < 1
        ? (msg = "Maximum Ticket Capacity must be greater than 1.")
        : formData.numberOfVendors < 1
        ? (msg = "Number of Vendors must be greater than 1.")
        : formData.numberOfCustomers < 1
        ? (msg = "Number of Customers must be greater than 1.")
        : (msg = "");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    }
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
        <h2 style={{ marginBottom: "10%" }}>Configuration Form</h2>
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
          ref={(el) => (refs.current[0] = el)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              refs.current[1].focus();
            }
          }}
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
          ref={(el) => (refs.current[1] = el)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              refs.current[2].focus();
            }
          }}
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
          ref={(el) => (refs.current[2] = el)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              refs.current[3].focus();
            }
          }}
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
          ref={(el) => (refs.current[3] = el)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              refs.current[4].focus();
            }
          }}
        />
        <label htmlFor="floatingPassword">Maximum Ticket Capacity</label>
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
          ref={(el) => (refs.current[4] = el)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              refs.current[5].focus();
            }
          }}
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
          ref={(el) => (refs.current[5] = el)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleStart();
            }
          }}
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
      {alert && <Alert msg={msg} />}
    </div>
  );
}

export default ConfigForm;
