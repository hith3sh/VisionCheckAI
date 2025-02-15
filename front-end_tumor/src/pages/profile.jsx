import React,{ useState } from 'react';
import "./profile.css";

function Profile() {
  //===================change image or remove image=========================================================
  const [imageUrl, setImageUrl] = useState('/avatar.jpeg'); // Initial image URL

  // Function to handle image changes
  const handleImageChange = (newImageUrl) => {
    setImageUrl(newImageUrl);
  };
  // Function to reset the image to the initial state
  const resetImage = () => {
    setImageUrl(null);
  }
  //====================================================enter multiple rows for quallifications upto 3 qualifications=========
  const [qualificationList, setQualificationList] = useState(['']);

  const addQualificationField = () => {
    if (qualificationList.length < 3) {
      setQualificationList([...qualificationList, '']);
    }
  };

  const handleInputChange = (index, event) => {
    const updatedList = [...qualificationList];
    updatedList[index] = event.target.value;
    setQualificationList(updatedList);
  };
  //====================handle data in the form==============================================================================
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
          <div className="text-wrapper-2">Country</div>
          <div className="text-wrapper-3">Last Name</div>
          <div className="text-wrapper-4">Contact Number</div>
          <div className="overlap">
            <div className="text-wrapper-5">First Name</div>
          </div>
          <div className="text-wrapper-6">Title</div>
          <div className="text-wrapper-7">Country Code</div>
          <div className="text-wrapper-8">Address Line 1</div>
          <div className="text-wrapper-9">Email Address</div>
          <div className="text-wrapper-10">Personal Information</div>
          <input className="input-1" type="text" name="title" placeholder="Medical Officer / Doctor/..." value={formData.title} onChange={handleChange}required  />
          <input className="input-2" type="text" name="country code" placeholder="+94" value={formData.countrycode} onChange={handleChange} required  />
          <input className="input-3" type="text" name="country" placeholder="Sri Lanka" value={formData.country} onChange={handleChange} required  />
          <input className="input-4" type="text" name="Address1" placeholder="primary location information: street address" value={formData.address1} onChange={handleChange}required  />
          <div className="text-wrapper-11">Address Line 2</div>
          <input className="input-5" type="text" name="firstname" placeholder="Sally B." value={formData.firstname} onChange={handleChange} required  />
          <input className="input-6" type="tel" name="contactNo" placeholder="+94789243743" pattern="[0-9]{10}" value={formData.contactno} onChange={handleChange} required  />
          <input className="input-7" type="text" name="Lastname" placeholder="Alcott" value={formData.lastname} onChange={handleChange}required/>
          <input className="input-8" type="email" name="email" placeholder="sallyAlcott9@gmail.com" value={formData.email} onChange={handleChange}required/>
          <input className="input-9" type="text" name="address2" placeholder="Additional Address Information" value={formData.address2} onChange={handleChange}required/>
        </div>
        <div className="overlap-2">
          <div className="text-wrapper-13">Sally B. Alcott</div>
          <img className="avatar-image" src="/avatar.jpeg" alt="Avatar" />
          
          <div>
          {imageUrl ? (
          // Display the selected image
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
        <div className="overlap-3">
          <div className="text-wrapper-14">Experiences</div>
          <div className="text-wrapper-15">Specialization</div>
          <div className="text-wrapper-16">Qualifications</div>
          <div className="text-wrapper-17">Hospital or Clinic Affiliation</div>
          <div className="text-wrapper-18">Working Experience</div>
          <input className="input-10" type="text" name="hospital" placeholder="Current Hospital/Clinic"  value={formData.hospital} onChange={handleChange} />
          <input className="input-11" type="text" name="exper." placeholder="Experiences" value={formData.experience} onChange={handleChange}required/>
          
          <input className="input-12" type="text" name="speci" placeholder="Neurology/ Psychiatry/ Radiology"  value={formData.specialization} onChange={handleChange} />
          {/*qualifications feild=============================================================================*/}
          <div className="center-container" style={{ margin: '160px 0 0 36px' }}>
            {qualificationList.map((qualification, index) => (
            <div key={index} className="qualification-row" style={{height:'300px'}}>
              <input
                className="input-field"
                type="text"
                name="certificate"
                value={qualification.institution}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="certificate/ award/license"
                style={{ display: 'block', marginTop: '5px',borderRadius:'5px'  }}
              />
            </div>
            ))}
            <button type="button" onClick={addQualificationField}>Add Qualifications</button>
          </div>
          </div>
         {/*=============================================================================================*/}
          <div className="overlap-4">
          <input type="submit" value="Save changes" />
          </div>
          
        
        
      </div>
    </div>
    </div>
  );
};
export default Profile;