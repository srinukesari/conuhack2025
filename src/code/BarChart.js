import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const BarChart = (labels) => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  console.log("labels", labels);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Low", "Medium", "High"],
        datasets: [
          {
            label: "# of Votes",
            data: labels.chartData,
            backgroundColor: [
              "rgba(75, 192, 192, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(255, 99, 132, 0.2)",
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(255, 99, 132, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false,
            },
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Fire Severity Report",
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [labels]);

  return (
    <canvas
      ref={canvasRef}
      id="BarChart"
      style={{ width: "300px", height: "200px" }}></canvas>
  );
};

export default BarChart;
