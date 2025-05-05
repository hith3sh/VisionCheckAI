import React from 'react'
import './QAForum.css';
import {Rectangle1224 }from '../../../assets/dashboard';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

export const QAForum =() => {
  return (
    <div className="overlap-4">
          <div className="rectangle-6" />
          <img className="rectangle-7" alt="Rectangle" src={ Rectangle1224 } />
          <Link to='/aboutus' className="q-a-forum">Q &amp; A Forum</Link>
        </div>
  )
};

export default QAForum;