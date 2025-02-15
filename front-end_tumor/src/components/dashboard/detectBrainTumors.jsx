import React from 'react'
import './detectBrainTumors.css';
import {Rectangle1215} from '../../assets/dashboard';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

export const DetectBrainTumors = () =>  {
  return (
    <div className="overlap-3">
          <div className="rectangle-4" />
          <Link to="/aboutus" className="text-wrapper-7">Detect Brain Tumors</Link>
          <img className="rectangle-5" alt="Rectangle" src={ Rectangle1215 } />
        </div>
  )
};
export default DetectBrainTumors;

