import React from "react";
import "./aboutus.css";
import rectangle1195 from '../assets/Rectangle 1195.png';
import img5 from '../assets/img 5.png';

export const  Aboutus = () =>  {
  return (
    <div className="about-us">
      <div className="div">
        
        <div className="overlap-group">
          <div className="text-wrapper-2">Our Goal</div>
          <p className="empowering-medical">
            Empowering Medical Professionals <br />
            Advancing Medical Research <br />
            Promoting Transparency and Explainability <br />
            Data Privacy <br />
            Enhancing Patient Care
          </p>
          <div className="element">
           
              <img className="vector" alt="Vector" src={img5} />
           
          </div>
          <div className="overlap-wrapper">
            
              <img className="vector" alt="Vector" src={img5}  />
            
          </div>
          <div className="overlap-group-wrapper">
            
              <img className="vector" alt="Vector" src={img5}  />
            
          </div>
          <div className="element-2">
            
              <img className="vector" alt="Vector" src={img5}  />
          
          </div>
          <div className="element-3">
            
              <img className="vector" alt="Vector" src={img5}  />
           
          </div>
          <img className="rectangle" alt="Rectangle" src={rectangle1195}/>
        </div>
      </div>
    </div>
  );
};