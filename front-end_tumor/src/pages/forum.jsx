import React,{Component} from 'react';
import "./forum.css";
import {Navy} from '../assets/dashboard';
import { image18 } from "../assets/dashboard";
import { image6 } from "../assets/dashboard";
import { image3 } from "../assets/dashboard";
import { image19 } from "../assets/dashboard";
import ThreadDisplay from '../components/forum/ThreadDisplay';

function Forum () {
  return (
    
        <div className="forum">
              <div className="rectangle" />
              {/*these text wrappers should make as links; as they make errors i keep them as text*/}
              <div className="text-wrapper">Log out</div>
              <div className="text-wrapper-2">Profile</div>
              <div className="text-wrapper-3">Dashboard</div>
              <div className="text-wrapper-4">Home</div>
              {/*==============================================================*/}
              <div className="group">
                <div className="overlap-group">
                  <p className="tumor-ai">
                    <span className="span">Tumor</span>
                    <span className="text-wrapper-5">.ai</span>
                  </p>
                  <img className="navy-modern-AI" alt="Navy modern AI" src={Navy} />
                </div>
              </div>
              <img className="image" alt="" src={ image18 } />
              <img className="img" alt="" src={ image3 } />
              <img className="image-2" alt="" src={ image6 } />
              <img className="image-3" alt="" src={ image19 } />
              <div className="rectangle-2">
                <div id="forum-content-placeholder">
                  <ThreadDisplay/>
                </div>
              </div>
            <div className="text-wrapper-8">Forum</div>
            
        </div>
      );
  
};
export default Forum;