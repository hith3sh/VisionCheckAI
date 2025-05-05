import React, { useState, useEffect } from 'react';
import "./profile.css";
import { doc, getDoc, updateDoc } from 'firebase/firestore'; 
import { getAuth } from "firebase/auth";
import { db } from '../firebase';
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [imageUrl, setImageUrl] = useState('/assets/avatar.jpg');
  const [formData, setFormData] = useState({
    email: '',
    contactno: '',
    firstname: '',
    lastname: '',
    title: '',
    confirm: '',
    country: '',
    address: ''
  });
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try{
        const token = sessionStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.user_id;
          const userDoc = doc(db, 'users', userId);
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists()) {
            setFormData(prevState => ({
              ...prevState, // Keep existing defaults
              ...userSnapshot.data() // Overwrite only existing fields
          }));
          } else {
            console.log('No such document!');
          }
        } else {
          console.log('No token found in session storage.');
        }
      }catch(error){
        console.error("Error fetching user data:", error);
      }
      
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // User data updating
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitted data:', formData);
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.user_id;
      const userDoc = doc(db, 'users', userId);

      try {
        await updateDoc(userDoc, formData);
        console.log('User data updated successfully');
        toast.success('User data updated successfully');
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    } else {
      console.log('No token found in session storage.');
    }
  };

  return (
    <div className="profile">
      <form onSubmit={handleSubmit} className="form">
        <div className="whole-form">
          <div className="text-wrapper">My Profile</div>
          <div className="overlap-group">
            <div className="text-wrapper-3">Last Name</div>
            <div className="text-wrapper-4">Contact Number</div>
            <div className="overlap">
              <div className="text-wrapper-5">First Name</div>
            </div>
            <div className="text-wrapper-6">Title</div>
            <div className="text-wrapper-8">Address Line</div>
            <div className="text-wrapper-9">Email Address</div>
            <div className="text-wrapper-10">Personal Information</div>
            <input className="input-1" type="text" name="title" value={formData.title} onChange={handleChange} required />
            <input className="input-4" type="text" name="address" value={formData.address} onChange={handleChange} required />
            <input className="input-5" type="text" name="firstname" value={formData.firstname} onChange={handleChange} required />
            <input className="input-6" type="tel" name="contactno" pattern="[0-9]{10}" value={formData.contactno} onChange={handleChange} required />
            <input className="input-7" type="text" name="lastname" value={formData.lastname} onChange={handleChange} required />
            <input className="input-8" type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="overlap-2">
            <div className="text-wrapper-13">
              <h3>{formData.firstname} {formData.lastname}</h3>
            </div>
            <div>
              {imageUrl ? (
                <div>
                  <img src={imageUrl} alt="Avatar" className="avatar-image" />
                  {/* <button onClick={resetImage} className="remove-button" style={{ display: 'block', marginTop: '286px',marginLeft:'110px' }}>Change Image</button> */}
                </div>
              ) : (
                // Display the file input when no image is selected
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const imageUrl = URL.createObjectURL(file);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="overlap-4">
            <input className='submit-button' type="submit" value="Save changes" />
          </div>
          <div className="overlap-5">
            <button className='back-btn' onClick={() => navigate('/dashboard')}>
              Back
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Profile;