import React from "react";
import "./dashboard.css";
import { Link } from 'react-router-dom';
import { Rectangle1217, Rectangle1224 } from "../../public/assets/dashboard";
import Icons from "../components/dashboard/Icons";

export const Dashboard = () => {
  return (
    <div className="dashboard">
      <Icons />
      <div className="text-wrapperdash">Dashboard</div>
      
      {/* Glaucoma Detection Container */}
      <div className="dashboard-container">
        <Link to='/uploadretinal' className="dashboard-card">
          <div className="card-gradient">
            <img className="card-image" alt="Glaucoma Detection" src={Rectangle1217} />
            <div className="card-title">Glaucoma Detection</div>
          </div>
        </Link>

        {/* View Past Reports Container */}
        <Link to='/history' className="dashboard-card">
          <div className="card-gradient">
            <img className="card-image" alt="View Past Reports" src={Rectangle1224} />
            <div className="card-title">View Past Reports</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
