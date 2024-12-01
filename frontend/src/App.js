import React, { useEffect, useState } from "react";
import ConfigForm from "./ConfigForm.js";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../src/App.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [WS, setWs] = useState(null);
  const [data, setData] = useState([0, 0, 0, 0, {}, {}]);
  const [timeData, setTimeData] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      const vendors = JSON.parse(event.data);
      setData(vendors);

      const totalSales = vendors[1] - vendors[2]; //Can not data[1] - data[2] because data update after
      setTimeData((prev) => [
        ...prev,
        { time: new Date().toLocaleTimeString(), sales: totalSales },
      ]);
    };

    socket.onerror = (error) => {
      console.log("WebSocket error:", error);
      alert("Network error");
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  // if (data[0] == data[1] - data[2]) {
  //   fetch("http://localhost:3000/stop")
  //     .then((res) => res.text())
  //     .then((text) => console.log(text))
  //     .catch((error) => console.log(error));
  // }

  const chartData = {
    labels: timeData.map((entry) => entry.time),
    datasets: [
      {
        label: "Sale Ticket Count",
        data: timeData.map((entry) => entry.sales),
        borderColor: "black",
        backgroundColor: "lightblue",
        fill: true,
      },
    ],
  };

  const resetgraph = () => {
    setTimeData([]);
  };

  return (
    <div style={{ display: "flex" }}>
      <ConfigForm resetgraph={resetgraph} />

      <div className="tickets-board">
        <center>
          <h2>Tickets Board</h2>
        </center>

        <table className="ticket-table">
          <thead>
            <tr>
              <th>#</th>
              <th style={{ textAlign: "center" }}>Add Ticket Count</th>
              <th style={{ textAlign: "center" }}>Sale Ticket Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data[4]).map((key) => (
              <tr key={key}>
                <td>Vendor {key}</td>
                <td style={{ textAlign: "center" }}>{data[4][key].add}</td>
                <td style={{ textAlign: "center" }}>{data[4][key].sale}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <table className="ticket-table">
          <thead>
            <tr>
              <th>#</th>
              <th style={{ textAlign: "center" }}>Sale Ticket Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data[5]).map((key) => (
              <tr key={key}>
                <td>Customer {key}</td>
                <td style={{ textAlign: "center" }}>{data[5][key].sale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "2.5%", marginLeft: "1.5%", width: "45%" }}>
        <center>
          <h2>Sale Ticket Count Over Time</h2>
        </center>
        <Line data={chartData} />

        {data[3] == data[2] && timeData.length ? (
          <p
            style={{
              color: "red",
              fontFamily: "Arial",
              textAlign: "center",
              fontWeight: "bold",
              letterSpacing: "3px",
            }}
          >
            Ticket pool fill
          </p>
        ) : (
          <p></p>
        )}
        {data[0] == data[1] - data[2] && timeData.length ? (
          <p
            style={{
              color: "blue",
              fontFamily: "Arial",
              textAlign: "center",
              fontWeight: "bold",
              letterSpacing: "3px",
            }}
          >
            Sold all tickets
          </p>
        ) : (
          <p></p>
        )}
        <table className="summary-table" style={{ marginTop: "20px" }}>
          <tbody>
            <tr>
              <td>Total Ticket Count</td>
              <td> : {data[0]}</td>
            </tr>
            <tr>
              <td>Maximum Ticket Capacity</td>
              <td> : {data[3]}</td>
            </tr>
            <tr>
              <td>Total Add Ticket Count</td>
              <td> : {data[1]}</td>
            </tr>
            <tr>
              <td>Total Sale Ticket Count</td>
              <td> : {data[1] - data[2]}</td>
            </tr>
            <tr>
              <td>Remaining Ticket Count</td>
              <td> : {data[2]}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
