import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";
import Card from "./Card";
import MapWidget from "./MapWidget";
import "./Dashboard.css";

const Dashboard = () => {
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    // Generate 10 random coordinates with labels
    const labels = ["Low", "Medium", "High"];
    const randomCoordinates = Array.from({ length: 10 }, () => [
      (Math.random() * 180 - 90).toFixed(6), // Latitude between -90 and 90
      (Math.random() * 360 - 180).toFixed(6), // Longitude between -180 and 180
      labels[Math.floor(Math.random() * labels.length)], // Random label
    ]);
    setCsvData(randomCoordinates);
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split("\n").map((row) => row.split(","));
      setCsvData(rows);
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
        <div className="content">
          <div className="cards">
            <Card title="Total Operation Cost" value="$1,000,000" />
            <Card title="No of Fires Addressed" value="150" />
            <Card title="No of Delayed" value="10" />
            <Card title="Damage Cost" value="$500,000" />
          </div>
          <div className="chart-and-map">
            <div className="chart-container">
              <BarChart />
            </div>
            <div className="map-container">
              <MapWidget coordinates={csvData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
