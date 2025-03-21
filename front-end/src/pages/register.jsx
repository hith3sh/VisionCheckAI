import React, { useState } from 'react';
import './register.css';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection } from 'firebase/firestore';
import { db, firebaseApp } from '../firebase'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const navigate = useNavigate();
  const auth = getAuth(firebaseApp);
  const fire_db = db;
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    contactno: '',
    medicals: '',
    title: '',
    confirm: '',
    termsAccepted: false 
  });

  // Form validation functions
  const validateContact = () => {
    const regex = /^\d{10}$/;
    if (!regex.test(formData.contactno)) {
      toast.error('Please enter a valid contact number');
      return false;
    }
    return true;
  };

  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validatePasswordMatch = () => {
    if (formData.password !== formData.confirm) {
      toast.error('Password confirmation does not match');
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (formData.password.length < 6) {
        ('Password must be at least 6 characters long');
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

    const isValid = 
      validateContact() && 
      validateEmail() && 
      validatePasswordMatch() && 
      validatePassword()

    if (!isValid) {
      // The individual validation functions already show error toasts.
      return;
    }
    if (!formData.termsAccepted) {
      toast.error('Please accept the terms of user agreement');
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
        title: formData.title,
        createdAt: new Date(),
        userId: userCredential.user.uid
      };

      // Save user data to Firestore
      try {
        await setDoc(doc(fire_db, 'users', userCredential.user.uid), userData);
        toast.success('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      } catch (firestoreError) {
        console.error('Firestore Error:', firestoreError);
        // Clean up the authentication user if Firestore fails
        await userCredential.user.delete();
        toast.error('Failed to save user data. Please try again.');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      toast.error('Registration failed. This email might already be in use.');
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
            <option value="Ophthalmologist">Ophthalmologist</option>
            <option value="Optometrist">Optometrist</option>
            <option value="Ocular Surgeon">Ocular Surgeon</option>
            <option value="Vision Scientist">Vision Scientist</option>
            <option value="Orthoptist">Orthoptist</option>
            <option value="Low Vision Therapist">Low Vision Therapist</option>
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
            className="input-9"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <input
            className="input-10"
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
      <ToastContainer />
    </div>
  );
}

export default Register;
