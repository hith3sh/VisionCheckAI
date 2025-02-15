import React from 'react'
import Icons from '../components/dashboard/Icons'
import './History.css';



export const History = () => {
  return (

    <div >
        <Icons/>
      
        
        <div className="hframe">
        <table class="htable">
  <thead class="thead-dark">
    <tr>
      <th scope="col">Scan No</th>
      <th scope="col">Date</th>
      
      <th scope="col">Report</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>2/9/2023</td>
    
      <td><a href=''>Download Report</a></td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>3/9/2023</td>
    
      <td><a href=''>Download Report</a></td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>5/9/2023</td>
      
      <td><a href=''>Download Report</a></td>
    </tr>
  </tbody>
</table>


        </div>
        <div className="upload-history">Upload&nbsp;&nbsp;History</div>
        
        
      
      
    </div>
  );
};
export default History;