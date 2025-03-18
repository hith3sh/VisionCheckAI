import React,{ useState } from 'react';
import "./profile.css";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import path as needed

function Profile() {
  const [imageUrl, setImageUrl] = useState('src/assets/avatar.jpg');

  // Function to handle image changes
  const handleImageChange = (newImageUrl) => {
    setImageUrl(newImageUrl);
  };
  // Function to reset the image to the initial state
  const resetImage = () => {
    setImageUrl(null);
  }

  const [formData, setFormData] = useState({
    email: '',contactno:'',countrycode:'',experience:'',specialization:'',
    firstname:'',lastname:'',pnoneno:'',DoB:'',medical:'',hospital:'',title:'',confirm:'',country:'',address1:'',address2:''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add authentication logic 
    console.log('Submitted data:', formData);
  };
  //=============================================================================================================================
  return (
    <div className="profile">
      <div onSubmit={handleSubmit} className="form" >
      <div className="div">
        <div className="text-wrapper">My Profile</div>
        <div className="overlap-group">
          <div className="text-wrapper-3">Last Name</div>
          <div className="text-wrapper-4">Contact Number</div>
          <div className="overlap">
            <div className="text-wrapper-5">First Name</div>
          </div>
          <div className="text-wrapper-6">Title</div>
          <div className="text-wrapper-7">Phone number</div>
          <div className="text-wrapper-8">Address Line</div>
          <div className="text-wrapper-9">Email Address</div>
          <div className="text-wrapper-10">Personal Information</div>
          <input className="input-1" type="text" name="title" value={formData.title} onChange={handleChange}required  />
          <input className="input-2" type="text" name="phone number" value={formData.countrycode} onChange={handleChange} required  />
          <input className="input-4" type="text" name="Address1" value={formData.address1} onChange={handleChange}required  />
          <input className="input-5" type="text" name="firstname" value={formData.firstname} onChange={handleChange} required  />
          <input className="input-6" type="tel" name="contactNo" pattern="[0-9]{10}" value={formData.contactno} onChange={handleChange} required  />
          <input className="input-7" type="text" name="Lastname"value={formData.lastname} onChange={handleChange}required/>
          <input className="input-8" type="email" name="email" value={formData.email} onChange={handleChange}required/>
        </div>
        <div className="overlap-2">
          <div className="text-wrapper-13">Sally B. Alcott</div>          
          <div>
          {imageUrl ? (
          <div>
            <img src={imageUrl} alt="Avatar" className="avatar-image" />
            <button onClick={resetImage} className="remove-button" style={{ display: 'block', marginTop: '286px',marginLeft:'110px' }}>Change Image</button>
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
                  handleImageChange(imageUrl);
                }
              }}
            />
        </div>
      )}
          </div>
          <div className="physiatrist">
            <br />
            physiatrist
          </div>
        </div>
          <div className="overlap-4">
            <input className='submit-button' type="submit" value="Save changes" />
          </div>
      </div>
    </div>
    </div>
  );
};
export default Profile;