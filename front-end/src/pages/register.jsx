import React, { useState } from 'react';
import './register.css';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { firebaseApp } from '../firebase';
import ErrorPopup from './errorPopup';


function Register() {
  const navigate = useNavigate();
  const auth = getAuth(firebaseApp);
  const fire_db = getFirestore(firebaseApp);

  // Form state management
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    contactno: '',
    medicals: '',
    title: '',
    confirm: '',
    termsAccepted: false // Add state for terms acceptance
  });

  // Error handling state
  const [currentError, setCurrentError] = useState('');
  const [showError, setShowError] = useState(false);

  // Form validation functions
  const validateContact = () => {
    const regex = /^\d{10}$/;
    if (!regex.test(formData.contactno)) {
      setCurrentError('contact no');
      return false;
    }
    return true;
  };

  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(formData.email)) {
      setCurrentError('email');
      return false;
    }
    return true;
  };

  const validatePasswordMatch = () => {
    if (formData.password !== formData.confirm) {
      setCurrentError('password');
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (formData.password.length < 6) {
      setCurrentError('password-length');
      return false;
    }
    return true;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate all fields
    const isValid = 
      validateContact() && 
      validateEmail() && 
      validatePasswordMatch() && 
      validatePassword() &&
      formData.termsAccepted; // Ensure terms are accepted

    if (!isValid) {
      setShowError(true);
      return;
    }

    try {
      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      // Prepare user data for Firestore
      const userData = {
        email: formData.email,
        firstname: formData.firstname,
        lastname: formData.lastname,
        contactno: formData.contactno,
        medicals: formData.medicals,
        // country:, 
        // AddressLine1:
        // AddressLine2:
        title: formData.title,
        createdAt: new Date(),
        userId: userCredential.user.uid
      };

      // Save user data to Firestore database
      try {
        const userRef = collection(fire_db, 'users');
        await setDoc(doc(fire_db, 'users', userCredential.user.uid), userData);
        // await addDoc(userRef, userData);
        navigate('/login', { replace: true });
      } catch (firestoreError) {
        console.error('Firestore Error:', firestoreError);
        await userCredential.user.delete();
        setCurrentError('firestore');
        setShowError(true);
      }
    } catch (error) {
      console.error('Registration Error:', error);
      setCurrentError('auth');
      setShowError(true);
    }
  };

  return (
    <div className="registeration">
      <div className="form">
        
        <div className="overlap-group">
          <div className="rectangle-1" />
          
          <div className='register-txt'><h1>REGISTRATION</h1></div>
          
          {/* Title Selection */}
          <select 
            className="input-11" 
            name="title" 
            value={formData.title} 
            onChange={handleChange}
          >
            <option value="" disabled>Title</option>
            <option value="Mr.">Mr.</option>
            <option value="Mrs.">Mrs.</option>
            <option value="Miss">Miss.</option>
            <option value="Other">Not willing to say</option>
          </select>

          {/* Personal Information */}
          <input
            className="input-1"
            type="text"
            name="firstname"
            placeholder="First Name"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
          <input
            className="input-2"
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname}
            onChange={handleChange}
            required
          />

          {/* Professional Information */}
          <select
            className="input-7"
            name="medicals"
            value={formData.medicals}
            onChange={handleChange}
          >
            <option value="" disabled>Medical specializations</option>
            <option value="Pathologist">Pathologist</option>
            <option value="Radiologist">Radiologist</option>
            <option value="Medical Oncologist">Medical Oncologist</option>
            <option value="Surgical Oncologist">Surgical Oncologist</option>
            <option value="Hematologist">Hematologist</option>
            <option value="Clinical Research Coordinator">Clinical Research Coordinator</option>
            <option value="Laboratory Technician">Laboratory Technician</option>
          </select>

          {/* Contact Information */}
          <input
            className="input-6"
            type="text"
            name="contactno"
            placeholder="Contact Number"
            value={formData.contactno}
            onChange={handleChange}
            onBlur={validateContact}
            required
          />

          {/* Authentication Information */}
          <input
            className="input-4"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            onBlur={validateEmail}
            required
          />
          <input
            className={`input-9 ${currentError === 'password' ? 'error' : ''}`}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <input
            className={`input-10 ${currentError === 'password' ? 'error' : ''}`}
            type="password"
            name="confirm"
            placeholder="Confirm Password"
            value={formData.confirm}
            onChange={handleChange}
            onBlur={validatePasswordMatch}
            required
          />

          {/* Terms of User Agreement */}
          <div className="terms-container">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              required
            />
            <label htmlFor="termsAccepted" className='terms-label'>
              I agree to the terms of user agreement
            </label>
          </div>
          {/* Submit Button */}
          <input
            type="submit"
            className="btn-Reg"
            value="Submit"
            onClick={handleRegister}
          />
        </div>
      </div>

      {/* Error Popup */}
      {showError && (
        <ErrorPopup
          message={
            currentError === 'email' ? 'Please Enter a valid email address' :
            currentError === 'contact no' ? 'Please Enter a valid contact number' :
            currentError === 'password' ? 'Password confirmation does not match' :
            currentError === 'password-length' ? 'Password must be at least 6 characters long' :
            currentError === 'firestore' ? 'Failed to save user data. Please try again.' :
            currentError === 'auth' ? 'Registration failed. This email might already be in use.' :
            !formData.termsAccepted ? 'You must agree to the terms of user agreement' :
            'An error occurred during registration.'
          }
          onClose={() => setShowError(false)}
        />
      )}
    </div>
  );
}

export default Register;