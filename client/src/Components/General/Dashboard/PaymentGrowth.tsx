import React, { useEffect, useState } from "react";
// import axios from "axios";
import axios from "@/security/axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const PaymentGrowth = () => {
  const [forecast, setForecast] = useState({});
  const [topCategories, setTopCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await axios.get('user/forecast');
        setForecast(response.data.forecasts);
        setTopCategories(response.data.highest_demand_categories);
        if (response.data.highest_demand_categories.length > 0) {
          setSelectedCategory(response.data.highest_demand_categories[0][0]);
        }
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    fetchForecast();
  }, []);

  const handleCategoryChange = (e:any) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div>
      <h1>AI-Powered Demand Forecasting</h1>
      <h2>Top 5 Categories with Highest Predicted Demand</h2>
      <ul>
        {topCategories.map((category, index) => (
          <li key={index}>{category[0]}: {category[1].toFixed(2)}</li>
        ))}
      </ul>

      <h2>Select Category to View Forecast</h2>
      <select value={selectedCategory} onChange={handleCategoryChange}>
      <option value="">Select category</option>
        {topCategories.map((category, index) => (
          <option key={index} value={category[0]}>{category[0]}</option>
        ))}
      </select>

      <h2>Forecast Chart</h2>
      {selectedCategory && forecast[selectedCategory] && (
        <div>
          <h3>{selectedCategory}</h3>
          <LineChart width={800} height={400} data={forecast[selectedCategory]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ds" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="yhat" stroke="#8884d8" />
          </LineChart>
        </div>
      )}
      {Object.keys(forecast).length === 0 && <p>No forecast data available.</p>}
    </div>
  );
};

export default PaymentGrowth;
                                            