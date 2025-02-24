// components/AdminDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import "./index.css"

const Dashboard = () => (
  <div className="admin-dashboard-container">
    <h1 className="admin-dashboard-title">Hello</h1>
    <button className="admin-dashboard-button">
      <Link to="/admin-book-store">Book Store</Link>
    </button>
    <button className="admin-dashboard-button">
      <Link to="/admin-dataset">Dataset</Link>
    </button>
  </div>
);

export default Dashboard;