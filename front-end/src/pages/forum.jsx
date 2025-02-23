import React from 'react';
import "./forum.css";
import {Navy} from '../assets/dashboard';
import { image18, image6, image3, image19 } from "../assets/dashboard";
import ThreadDisplay from '../components/forum/ThreadDisplay';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Forum() {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div className="forum">
      <div className="rectangle" />
      {/* Convert text wrapper to clickable div */}
      <div className="text-wrapper" onClick={handleLogout} style={{ cursor: 'pointer' }}>Log out</div>
      <div className="text-wrapper-2">Profile</div>
      <div className="text-wrapper-3">Dashboard</div>
      <div className="text-wrapper-4">Home</div>
      
      <div className="group">
        <div className="overlap-group">
          <p className="tumor-ai">
            <span className="span">Tumor</span>
            <span className="text-wrapper-5">.ai</span>
          </p>
          <img className="navy-modern-AI" alt="Navy modern AI" src={Navy} />
        </div>
      </div>
      <img className="image" alt="" src={image18} />
      <img className="img" alt="" src={image3} />
      <img className="image-2" alt="" src={image6} />
      <img className="image-3" alt="" src={image19} />
      <div className="rectangle-2">
        <div id="forum-content-placeholder">
          <ThreadDisplay/>
        </div>
      </div>
      <div className="text-wrapper-8">Forum</div>
    </div>
  );
}

export default Forum;