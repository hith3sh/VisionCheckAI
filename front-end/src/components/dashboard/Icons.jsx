import React from 'react';
import './icons.css';
import { Navy, image19, image6, image3, image18 } from '../../assets/dashboard';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

export const Icons = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem("token");
      console.log("User logged out, token removed.");
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="drectangle">
      <Link to="/" className="dtext-wrapper" onClick={handleLogout}>Log out</Link>
      <Link to="/profile" className="dtext-wrapper-2">Profile</Link>
      <Link to="/dashboard" className="dtext-wrapper-3">Dashboard</Link>
      <Link to="/" className="dtext-wrapper-4">Home</Link>
      <div className="dgroup">
        <div className="doverlap-group">
          <p className="dtumor-ai">
            <span className="dspan">VisionCheck.ai</span>
          </p>
        </div>
      </div>
      <img className="dimage" alt="Image" src={image18} />
      <img className="dimg" alt="Image" src={image3} />
      <img className="dimage-2" alt="Image" src={image6} />
      <img className="dimage-3" alt="Image" src={image19} />
    </div>
  );
};

export default Icons;