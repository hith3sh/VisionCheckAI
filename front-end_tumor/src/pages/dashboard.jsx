import React from "react";
import "./dashboard.css";
import {Link} from 'react-router-dom'
import Navy from '../assets/Navy.png';
import {Rectangle1217}  from "../assets/dashboard";
import { Rectangle1215 } from "../assets/dashboard";
import { Rectangle1224 } from "../assets/dashboard";
import { Rectangle1216 } from "../assets/dashboard";

import Icons from "../components/dashboard/Icons";

export const Dashboard = () => {
 return(
 
<div className="dashboard">
        <Icons/>
          <div className="text-wrapperdash">Dashboard</div> 
          <div className="rectangle1" />
          <Link to='/uploadmri'>
          <img className="rectangle1217" alt="Rectangle" src={Rectangle1217}/>
          </Link>
          <div className="text-wrapper1217">Glaucoma Detection</div>
          <div className="rectangle3" />
          <Link to='/history'>
          <img className="rectangle1224" alt="Rectangle" src={Rectangle1216}/>
          </Link>
          <div className="text-wrapper1224">View Past Reports</div>
</div>
  );
};

export default Dashboard;
