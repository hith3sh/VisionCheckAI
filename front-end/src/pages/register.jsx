import React from 'react'
import './register.css';
import { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {firebaseApp} from '../firebase';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, push } from 'firebase/database';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import ErrorPopup from './errorPopup';
/*import { IconArrowDown } from "./IconArrowDown";
import { IconArrowDownWrapper } from "./IconArrowDownWrapper";*/

function Register() {
  //========================handle data======================================================================
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    contactno: '',
    medicals: '',
    title: '',
    confirm: ''
  });
  
  const [currentError, setCurrentError] = useState('');
  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

  const validateContact = () => {
    // Define your contact number validation logic here (e.g., using regular expressions)
    const regex = /^\d{10}$/; // Assumes a 10-digit number

    if (!regex.test(formData.contactno)) {
      setCurrentError('contact no');
    } else if (currentError === 'contactno') {
      setCurrentError(''); // Clear the error message when the input is valid
    }
  };

  const validateEmail = () => {
    // Regular expression to match a valid email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailRegex.test(formData.email)) {
      setCurrentError('email');
      // Email is in correct format
      // No alert here as requested
    } else if (currentError === 'email') {
      // Email is not in correct format, show the error popup
      setCurrentError('');
    }
  };
  const validatePasswordMatch = () => {
    if (formData.password !== formData.confirm) {
      setCurrentError('password');
    } else if (currentError === 'password') {
      setCurrentError('');
    }
  }
   //==========================================hande firebase=================================================================

   // Initialize Firebase
  
   const auth = getAuth(firebaseApp);
 
 
   const db = getDatabase(firebaseApp);
   const fire_db = getFirestore(firebaseApp);
   const dataRef = ref(db, 'users');
 
   const handleRegister = async (e) => {
     e.preventDefault();
     // Check contact number validity before proceeding
     validateContact();
     validateEmail();
     validatePasswordMatch();
     
     if (currentError) {
      setShowError(true);
      return;
    }
    
       try {
         const newData = {
           key1: formData.email,
           key2: formData.password,
           key3: formData.firstname,
           key4 : formData.lastname,
           key5: formData.contactno,
           key6 : formData.medicals,
           key7 : formData.title,
           key8: formData.confirm
           
         };
       const FiredataRef = collection(fire_db,'users')
       try {
         const docRef = await addDoc(FiredataRef, newData);
         console.log('Document written with ID: ', docRef.id);
         
       } catch (e) {
         console.error('Error adding document: ', e);
       }
       const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
       const user = userCredential.user;
       console.log('User logged in:', user);
       navigate('/dashboard', { replace: true });
       
 
     } catch (error) {
       console.error('Register:', error.message);
       setShowError(true);  // Display the error popup
       //alert('registeration successful');
     }
   };
 
  //==========================================================================================================================
  
  return (
    <div className="registeration">
      
      <div onSubmit={handleRegister} className="form" >
      <div className="rectangle"/>
        <div className="overlap-group">
          <div className="rectangle-1" /*white rectangle*//>
          <select className="input-11" type="text" name="title" placeholder="Title"  value={formData.title} onChange={handleChange}>
              <option value="" disabled selected>Title</option>
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Miss">Miss.</option>
              <option value="Miss">Not willing to say</option>
            </select> 
          <input className="input-1" type="text" name="firstname" placeholder="First Name" 
          value={formData.firstname} onChange={handleChange} required  />
          <input className="input-2" type="text" name="lastname" placeholder="Last Name" 
          value={formData.lastname} onChange={handleChange} required  />
          <select className="input-7" type="text" name="medicals" placeholder="Medical specializations" 
            value={formData.medicals} onChange={handleChange} >
              <option value="" disabled selected>Medical specializations</option>
              <option value="Pathologist">Pathologist</option>
              <option value="Radiologist">Radiologist</option>
              <option value="Medical Oncologist">Medical Oncologist</option>
              <option value="Surgical Oncologist">Surgical Oncologist</option>
              <option value="Hematologist">Hematologist</option>
              <option value="Clinical Research Coordinator">Clinical Research Coordinator</option>
              <option value="Laboratory Technician">Laboratory Technician</option>
          </select>

          <input className="input-6" type="text" name="contactno" placeholder="Contact Number" 
          value={formData.contactno} onChange={handleChange} onBlur={validateContact} required  />
          {/*showError && (
              <ErrorPopup
                message={
                  currentError=='contact no'
                    ? 'Please correct the contact number.'
                    : 'An error occurred during registration.'
                }
                onClose={() => setShowError(false)} // Close the popup when the "Close" button is clicked
              />
              )*/}
          <input className="input-4" type="text" name="email" placeholder="Email" value={formData.email || ''} 
          onChange={handleChange} onBlur={validateEmail}required  />
            {/*showError && (
              <ErrorPopup
                message={currentError=='email'
                ? 'Please correct the email address'
                : 'An error occurred during registration.'}
                onClose={() => setShowError(false)}
              />
            )*/}
          <input className={`input-9 ${currentError === 'password' ? 'error' : ''}`} 
            type="password" name="pass" placeholder="Password" value={formData.password} 
            onChange={(e) =>  setFormData({ ...formData, password: e.target.value })}required  />

          <input className={`input-10 ${currentError === 'password' ? 'error' : ''}`}
            type="password" name="confirm" placeholder="Confirm Password" 
            value={formData.confirm} onChange={handleChange} onBlur={validatePasswordMatch} required  />
            {/*showError && (
              <ErrorPopup
                message={currentError=='password'
                ? 'password confirmation does not match'
                : 'An error occurred during registration.'}
                onClose={() => setShowError(false)}
              />
            )*/}
            <input onClick={handleRegister} type="submit" className="btn-Reg" value="Register" />
 
        </div>
      </div> 
      {showError && (
          <ErrorPopup
            message={
              currentError === 'email'
                ? 'Please Enter a valied email address'
                : currentError === 'contact no'
                ? 'Please Enter a valied contact number'
                : currentError === 'password'
                ? 'Password confirmation does not match'
                : 'An error occurred during registration.'
            }
            onClose={() => setShowError(false)}
          />
        )} 
    </div>
  );
}

export default Register;
































