import React, { useState, useEffect, use } from "react";
import BarChart from "./BarChart";
import Card from "./Card";
import MapWidget from "./MapWidget";
import "./Dashboard.css";
import { Zoom } from "react-reveal";

const Dashboard = () => {
  const [csvData, setCsvData] = useState([]);
  const [severity, setSeverity] = useState([]);
  const [onLoad, setOnLoad] = useState(false);
  const [fireAddressed, setFireAddressed] = useState(0);
  const [delayed, setDelayed] = useState(0);
  const [damageCost, setDamageCost] = useState(0);
  const [operationCost, setOperationCost] = useState(0);

  useEffect(() => {
    // Generate 10 random coordinates with labels
    // const labels = ["Low", "Medium", "High"];
    // const randomCoordinates = Array.from({ length: 10 }, () => [
    //   (Math.random() * 180 - 90).toFixed(6), // Latitude between -90 and 90
    //   (Math.random() * 360 - 180).toFixed(6), // Longitude between -180 and 180
    //   labels[Math.floor(Math.random() * labels.length)], // Random label
    // ]);
    // setCsvData(randomCoordinates);
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target.result;
      const rows = text.split("\n").map((row) => row.split(","));
      // setCsvData(rows);
      try {
        const response = await fetch("http://localhost:11000/process_csv", {
          method: "POST",
          headers: {
            "Content-Type": "text/csv",
          },
          body: text,
        });
        console.log("response", text.split("\n"));

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        const labels = Object.values(responseData.data?.Fire_severity_report);
        setFireAddressed(responseData.data?.Number_of_fires_addressed);
        setDelayed(responseData.data?.Number_of_fires_delayed);
        setDamageCost(
          responseData.data?.Estimated_damage_costs_from_delayed_responses
        );
        setOperationCost(responseData.data?.Total_operational_costs);
        setSeverity(labels);

        const coordinates = [];
        const { Coordinates } = responseData.data;
        Object.entries(Coordinates).forEach(([severity, severityGroup]) => {
          Object.entries(severityGroup).forEach(([level, coords]) => {
            coords.forEach((coord) => {
              coordinates.push([...coord, level]);
            });
          });
        });

        console.log("coordinates", coordinates);
        setCsvData(coordinates);
        setOnLoad(true);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="dashboard">
      <main className="dashboard-main">
        <h2>Hello, Admin</h2>
        <label className="trending-button">
          Upload CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="file-input"
          />
        </label>
        {onLoad && (
          <div className="content">
            <Zoom>
              <div className="cards">
                <Card title="Total Operation Cost" value={operationCost} />

                <Card title="No of Fires Addressed" value={fireAddressed} />

                <Card title="No of Delayed" value={delayed} />

                <Card title="Damage Cost" value={damageCost} />
              </div>
            </Zoom>

            <div className="chart-and-map">
              <Zoom>
                <div className="chart-container">
                  <BarChart label={severity} />
                </div>
              </Zoom>
              <Zoom>
                <div className="map-container">
                  <MapWidget coordinates={csvData} />
                </div>
              </Zoom>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
