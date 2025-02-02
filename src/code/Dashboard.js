import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BarChart from "./BarChart";
import Card from "./Card";
import MapWidget from "./MapWidget";
import "./Dashboard.css";

const Dashboard = () => {
  const [csvData, setCsvData] = useState([]);
  const [severity, setSeverity] = useState([]);
  const [damageCost, setDamageCost] = useState(0);
  const [operationCost, setOperationCost] = useState(0);
  const [fireAddressed, setFireAddressed] = useState(0);
  const [delayed, setDelayed] = useState(0);

  const [fireEngines, setFireEngines] = useState(0);
  const [smokeJumpers, setSmokeJumpers] = useState(0);
  const [tankerPlanes, setTankerPlanes] = useState(0);
  const [helicopters, setHelicopters] = useState(0);
  const [groundCrews, setGroundCrews] = useState(0);

  const [onLoad, setOnLoad] = useState(false);

  useEffect(() => {
    fetch("http://localhost:11000/get_resources", {
      method: "GET",
      headers: {
        "Content-Type": "text/csv",
      },
    }).then(async (response) => {
      const responseData = await response.json();
      setHelicopters(responseData.data?.Available_resources?.Helicopters);
      setSmokeJumpers(responseData.data?.Available_resources?.Smoke_Jumpers);
      setTankerPlanes(responseData.data?.Available_resources?.Tanker_Planes);
      setFireEngines(responseData.data?.Available_resources?.Fire_Engines);
      setGroundCrews(responseData.data?.Available_resources?.Ground_Crews);
    });
  }, []);

  const readCSV = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split("\n").map((row) => row.split(","));
        resolve(rows);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    try {
      const rows = await readCSV(file);

      // Send POST request to /csv endpoint
      const response = await fetch("http://localhost:11000/process_csv", {
        method: "POST",
        headers: {
          "Content-Type": "text/csv",
        },
        body: rows.map((row) => row.join(",")).join("\n"),
      });

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

      setCsvData(coordinates);
      setOnLoad(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Whiplash Dashboard</h1>
          <p>
            Welcome to the admin dashboard. Here you can monitor and manage fire
            severity data.
          </p>
        </header>
        <main className="dashboard-main">
          {/* Phase 1 Section */}
          <section id="phase1">
            <div className="upload-and-cards">
              <label className="trending-button">
                Upload CSV
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="file-input"
                />
              </label>
              <div className="info-cards">
                <Card title="Ground Crew" value={groundCrews} />
                <Card title="Helicopters" value={helicopters} />
                <Card title="Smoke Jumpers" value={smokeJumpers} />
                <Card title="Fire Engines" value={fireEngines} />
                <Card title="Tanker Planes" value={tankerPlanes} />
              </div>
            </div>
            {onLoad && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="content">
                  <div className="cards">
                    <Card title="Total Operation Cost" value={`$${operationCost}`} />
                    <Card title="No of Fires Addressed" value={fireAddressed} />
                    <Card title="No of Delayed" value={delayed} />
                    <Card title="Damage Cost" value={`$${damageCost}`} />
                  </div>
                  <div className="chart-and-map">
                    <div className="chart-container">
                      <BarChart chartData={severity} />
                    </div>
                    <div className="map-container">
                      <MapWidget coordinates={csvData} />
                    </div>
                  </div>
                </motion.div>
            )}
          </section>
          {/* Phase 2 Section */}
          <section id="phase2">
            {/* Empty section for future use */}

          </section>
        </main>
      </div>
  );
};

export default Dashboard;