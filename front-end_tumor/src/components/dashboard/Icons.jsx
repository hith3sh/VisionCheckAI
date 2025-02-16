import React from 'react'
import './icons.css';
import {Navy,image19,image6,image3,image18} from '../../assets/dashboard';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';


export const Icons=() => {
  return (
     <div className="drectangle" >
          <Link to="/" className="dtext-wrapper">Log out</Link>
          <Link to ="/profile" className="dtext-wrapper-2">Profile</Link>
          <Link to="/dashboard" className="dtext-wrapper-3">Dashboard</Link>
          <Link to="/" className="dtext-wrapper-4">Home</Link>
          <div className="dgroup">
            <div className="doverlap-group">
              <p className="dtumor-ai">
                <span className="dspan">Tumor</span>
                <span className="dtext-wrapper-5">.ai</span>
              </p>
              <img className="dnavy-modern-AI" alt="Navy modern AI" src={Navy} />
            </div>
          </div>
          <img className="dimage" alt="Image" src={ image18 } />
          <img className="dimg" alt="Image" src={ image3 } />
          <img className="dimage-2" alt="Image" src={ image6 } />
          <img className="dimage-3" alt="Image" src={ image19 } />
          </div>
  )
};
export default Icons;