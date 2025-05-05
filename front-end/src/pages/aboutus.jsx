import React from "react";
import "./aboutus.css";
import rectangle1195 from '../../public/assets/Rectangle 1195.png';
import img5 from '../../public/assets/img 5.png';

export const Aboutus = () => {
  return (
    <div className="about-us">
      <div className="div">
        <div className="overlap-group">
          <div className="text-wrapper-2">Our Goal</div>
          <div className="goals-list">
            <div className="goal-row">
              <div className="element">
                <img className="vector" alt="Vector" src={img5} />
              </div>
              <span className="goal-text">Empowering Medical Professionals</span>
            </div>
            
            <div className="goal-row">
              <div className="element">
                <img className="vector" alt="Vector" src={img5} />
              </div>
              <span className="goal-text">Advancing Medical Research</span>
            </div>
            
            <div className="goal-row">
              <div className="element">
                <img className="vector" alt="Vector" src={img5} />
              </div>
              <span className="goal-text">Promoting Transparency and Explainability</span>
            </div>
            
            <div className="goal-row">
              <div className="element">
                <img className="vector" alt="Vector" src={img5} />
              </div>
              <span className="goal-text">Data Privacy</span>
            </div>
            
            <div className="goal-row">
              <div className="element">
                <img className="vector" alt="Vector" src={img5} />
              </div>
              <span className="goal-text">Enhancing Patient Care</span>
            </div>
          </div>
          <img className="rectangle" alt="Rectangle" src={rectangle1195}/>
        </div>
      </div>
    </div>
  );
};