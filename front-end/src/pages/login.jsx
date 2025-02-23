import React, { useState } from 'react';
import './login.css';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {firebaseApp} from '../firebase';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

// Use Firebase Auth

function Login() {
  //======================handle data==========================================================================
  
  const navigate = useNavigate();
  
  
  // Initialize Firebase
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const auth = getAuth();

  const handleEmailFocus = () => {
    setIsEmailFocused(true);
    setEmailError('');
  };

  const handleEmailBlur = () => {
    setIsEmailFocused(email !== '');
    if (!isValidEmail(email)) {
        setEmailError('*Invalid email format');
      } else {
        setEmailError('');
      }
  };
  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(password !== '');
  };

  const [emailError, setEmailError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User logged in:', user);

      //get the JWT token
      const token = await user.getIdToken();
      console.log('JWT token:', token);
      
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Login error:', error.message);
      alert('invalid credentials');
    }
    
  };

  //===============================================================================================================
  return (
    <div className="login-1">
      <div className="img">
       {/*<img className='backimage'src="/back2.jpg" />*/}
      </div>
      <div className="login-content ">
        <form onSubmit={handleLogin}  >
          <h2 className="title">Welcome</h2>
          <h4 className='sub'>Your Gateway to Glaucoma Analysis</h4>
          <div className={`input-overlap one ${isEmailFocused ? 'focus' : ''}`}>
            <div className="i">
              <i className="fas fa-user"></i>
            </div>
            <div className="overlap">
              <h5>Username</h5>
              <input
                    type="text"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={handleEmailFocus}
                    onBlur={handleEmailBlur}
                  />
                  {emailError && <p className="error-message">{emailError}</p>}
            </div>
          </div>
          <div className={`input-overlap pass ${isPasswordFocused ? 'focus' : ''}`}>
            <div className="i">
              <i className="fas fa-lock"></i>
            </div>
            <div className="overlap">  
            <h5>Password</h5>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
            />
              
          </div>
          
          </div>
          <a href="#">Forgot Password?</a>
          <input onClick={handleLogin} type="submit" className="btn" value="Login" />
         
        </form>
      </div>
      
    </div>
    );
}

export default Login;