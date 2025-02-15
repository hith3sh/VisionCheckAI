import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DropFileInput from '../components/drop-file-input/DropFileInput';
import { Button } from '@mui/base/Button';
import InputFileUpload from '../components/mrisection/fileupload';
import React, { useState } from 'react';
import axios from 'axios';
import ResultModal from '../components/mrisection/resultModal';
function Braintumor() {
  const containerStyle = {
    position: 'absolute',
    left: '5vw',
    top: '1vh', // 10% of the viewport width
    backgroundColor: '#FFFFFF',
    width: '90vw', // 80% width of the viewport
    height: '99vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowX: 'auto',
    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.05)', // Add a drop shadow
  };
  
  const colStyle1 = {
    fontFamily: 'Montserrat',
    fontSize: '46px',
    fontStyle: 'normal',
    fontWeight: '800',
    lineHeight: 'normal',
    zIndex: '2000',
    background: 'linear-gradient(96deg, #3A8EF6 -10.84%, #6F3AFA 196.74%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'white',
    padding: '15px',
    borderRadius: '5px',
    display : 'flex',
    alignItems : 'center',
    justifyContent : 'center'
  };
  const colStyle2 = {
    width: '80vw',
    fontFamily: 'Montserrat',
    fontSize: '26px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 'normal',
    padding: '15px',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  };
  
  const divstyle1 = {
    marginTop : '50px',
    width: '400px',
    height: '350px',
    alignself : 'center',
    justifyContent: 'center',
    justifySelf: 'center',
    display: 'flex',
    borderRadius : '10px',
    flexDirection: 'column',
    gap: '5px',
  };
  const buttonstyle1 = {
    alignSelf: 'center',
    borderRadius: '25px',
    color: 'white',
    fontSize: '16px',
    fontStyle: 'normal',
    width: '400px',
    height : '40px',
    fontWeight: '500',
    lineHeight: 'normal',
    position: 'static',
    background: 'linear-gradient(96deg, #3A8EF6 -10.84%, #6F3AFA 196.74%)',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };
  
  
  const onFileChange = (files) => {
    // Handle file changes here if needed
  };
    const [uploadedImage, setUploadedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
  
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setSelectedFile(file);
    };
  
    const handleUploadedImage = (imagePath) => {
      setUploadedImage(imagePath)
      console.log('Received image path in parent component:', imagePath);
      // You can set the image path in the parent component's state or perform any other necessary actions.
    };



    const handleUpload = () => {
      if (selectedFile) {
        // Create a FormData object to send the file to the backend
        const formData = new FormData();
        formData.append('file', selectedFile);
  
        // Make a POST request to the backend with the file data
        axios.post('http://127.0.0.1:12000/api/upload', formData)
          .then((response) => {
            // Handle success
            console.log('File uploaded successfully:', response.data);
            const segmentedImagePath = response.data['segmented_image_path'];
            console.log('Segmented image path:', segmentedImagePath);
            setUploadedImage(segmentedImagePath);
          })
          .catch((error) => {
            // Handle error
            console.error('Error uploading file:', error);
          });
      } else {
        // Handle case where no file is selected
        console.error('No file selected.');
      }
    };

  
  return (
    <>
    <Container style={containerStyle}>
    <Container>
      <Row>
        <Col sm={12} md={6} style={colStyle1}>
          Brain Tumor Segmentation
        </Col>
        <Col sm={12} md={6} style={colStyle2}>
          Step into the future of brain tumor segmentation with our revolutionary technology. By simply uploading a .jpeg image and clicking 'Scan,' our advanced U-Net model swiftly identifies cancer locations, offering healthcare professionals a streamlined and efficient tool for brain tumor detection.
        </Col>
      </Row>
    </Container>
     <Container style = {{display : 'flex', flexDirection : 'row', justifyItems: 'center', alignContent: 'center', justifyContent: 'center'}}>
      <div style={divstyle1}>
      <DropFileInput onFileChange={handleUploadedImage}/>
      <div style={{display : 'flex', justifyContent: 'center', alignContent : 'center',alignItems: 'center', justifyItems: 'center',}}>
          {/* <InputFileUpload /> */}
          <input
  type="file"
  accept=".jpg, .jpeg, .png , .tif, .tiff"
  onChange={handleFileChange}
  style={{
    fontFamily: 'Montserrat', // Use Montserrat font
    display: 'block', // Display as a block element
    margin: '0 auto', // Center horizontally
    textAlign: 'center',
    justifyContent: 'center',
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyItems: 'center',
    width: '185px' // Center text horizontally
  }}
/>

            </div>
          <Button   onClick={handleUpload} style={buttonstyle1}>Submit</Button>
      </div>
     
     </Container>
     <ResultModal open={uploadedImage !== null} onClose={() => setUploadedImage(null)} imageSrc={`http://localhost:12000/${uploadedImage}`} />

     {/* {uploadedImage && (
        <div style={{ textAlign: 'center' }}>
          <img
            src={`http://localhost:12000/${uploadedImage}`} // Update the URL
            alt="Uploaded"
            style={{ maxWidth: '100%', maxHeight: '400px' }}
          />
        </div>
      )} */}
    </Container>
    </>
  );
}

export default Braintumor;
