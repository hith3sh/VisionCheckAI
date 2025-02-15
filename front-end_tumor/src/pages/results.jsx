import React from 'react'
import axios from 'axios';
import { useState } from 'react';

function Results() {

    // Define a function to fetch data from the Flask backend
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageLoc, setImageLoc] = useState('');

    

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
        var reader = new FileReader();
      reader.onloadend = function (e) {
          console.log(e.target.result, e.target.error);
      };   
      reader.readAsDataURL(event.target.files[0]);
      };

    const uploadFileToBackend = async () => {
        try {
          const formData = new FormData();
          formData.append('file', selectedFile);
    
          // Send a POST request to the Flask backend with the file data
          const response = await axios.post('http://localhost:5000/api/data', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },{withCredentials: false});
          const data = response.data;
          setImageLoc(data.image_loc);
          console.log('File upload response:', response.data);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };


    const fetchDataFromBackend = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data'); // Replace with your API endpoint
      const data = response.data;
      console.log('Data from Flask backend:', data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  return (
    <>
    <div>Results</div>
    <button onClick={fetchDataFromBackend}>Fetch Data</button>
    <input type="file" onChange={handleFileSelect}  name="image"/>

      {/* Button to upload the selected file */}
      <button style={{
    position: 'absolute',
    left: '10px',
    top: '100px',
    width: '100px',
    height: '100px'
  }} type='submit' onClick={uploadFileToBackend}>Upload File</button>

<div>
{imageLoc && (
        <img
          src={`static/${imageLoc}`}
          className="img"
          alt=""
          height="256"
        />
      )}
</div>

    </>
  )
}

export default Results