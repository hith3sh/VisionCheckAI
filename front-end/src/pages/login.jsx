import React, { useState } from 'react';
import './login.css';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/get';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      // Verify the token with the backend
      const response = await apiCall('verify-token', {
        method: 'POST',
        body: JSON.stringify({ token })
      });
      localStorage.setItem('token', token);
      console.log('token saved on local storage');
      navigate('/dashboard', { replace: true });

    } catch (error) {
      console.error('Login error:', error.message);
      if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email.');
      }else if (error.code === 'auth/invalid-email'){
        toast.error(' Invalid email. Please try again.');
      }else if (error.code === 'auth/invalid-login-credentials'){
          toast.error('Invalid login credentials. Please try again.');
      } else {
        toast.error('Login failed due to a server error. Please try again later.');
      }
    }
  };

  //===============================================================================================================
  return (
    <div className="login-1">
      <div className="img">
       {/* <img className='backimage'src="/back2.jpg" /> */}
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
          <Link to="/reset-password">Forgot Password?</Link>
          <input onClick={handleLogin} type="submit" className="btn" value="Login" />
         
        </form>
      </div>
      <ToastContainer />
    </div>
    );
}

export default Login;