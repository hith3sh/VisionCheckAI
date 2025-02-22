import React from 'react';
import './custbutton.css'
//import { useHistory } from 'react-router-dom';

function CustButton() {
  return (
      <button className='cust-button-1' onClick={console.log('hello')}>Login</button>
  );
}

export default CustButton;
