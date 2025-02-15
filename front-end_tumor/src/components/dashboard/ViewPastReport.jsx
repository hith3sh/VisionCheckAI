import React from 'react'
import './ViewPastReport.css';
import{Rectangle1216} from '../../assets/dashboard';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

export const ViewPastReport = () =>  {
  return (
    <div className="overlap-2">
          
          <div className="rectangle-2" />
          <img className="rectangle-3" alt="Rectangle" src={ Rectangle1216 } />
          <Link to="/aboutus" className="text-wrapper-6">View Past Reports</Link>
        </div>
  )
};
export default ViewPastReport;