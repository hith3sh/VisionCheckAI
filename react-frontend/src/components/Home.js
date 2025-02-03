import React from 'react';
import EyeForm from './EyeForm';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; // Import the CSS file for styling

function Home({
  setLeftImage, setRightImage, setAge, setGender,
  setLeftDioptre1, setRightDioptre1, setLeftDioptre2, setRightDioptre2, setLeftAstigmatism,
  setRightAstigmatism, setLeftPhakicPseudophakic, setRightPhakicPseudophakic, setLeftPneumatic,
  setRightPneumatic, setLeftPachymetry, setRightPachymetry, setLeftAxialLength, setRightAxialLength,
  setLeftVFMD, setRightVFMD, leftImage, rightImage, age, gender, 
  leftDioptre1, rightDioptre1, leftDioptre2, rightDioptre2, leftAstigmatism,
  rightAstigmatism, leftPhakicPseudophakic, rightPhakicPseudophakic, leftPneumatic, rightPneumatic,
  leftPachymetry, rightPachymetry, leftAxialLength, rightAxialLength, leftVFMD, rightVFMD
}) {
  const navigate = useNavigate();

  const handleAnalyzeAndNavigate = async () => {
    // Ensure age and gender are not empty
    if (!age || !gender) {
      alert("Please fill in both age and gender fields.");
      return;
    }
    // Gather data
    const data = {
      age,
      gender,
      leftDioptre1,
      rightDioptre1,
      leftDioptre2,
      rightDioptre2,
      leftAstigmatism,
      rightAstigmatism,
      leftPhakicPseudophakic,
      rightPhakicPseudophakic,
      leftPneumatic,
      rightPneumatic,
      leftPachymetry,
      rightPachymetry,
      leftAxialLength,
      rightAxialLength,
      leftVFMD,
      rightVFMD,
    };
    // Create FormData to handle file uploads (image files)
    const formData = new FormData();
    formData.append("leftImage", leftImage); // Assuming leftImage is a file object
    formData.append("rightImage", rightImage);
    formData.append("data", JSON.stringify(data)); // Add the rest of the data as JSON
    
    console.log("FormData content:");
    for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
            console.log(pair[0], pair[1].name, pair[1].type, pair[1].size);
        } else {
            console.log(pair[0], pair[1]);
        }
    }
    
    try {
      // Send data to backend
      const response = await axios.post('http://localhost:8080/api/v1/submit', formData, {headers:{"Content-Type":"multipart/form-data"}});
      console.log('response from java backend', response.data);
      navigate('/results', { state: { result: response.data }}); // passing response as a state
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }

    
  };

  return (
    <div className="overlay">
      <h1 className="title">VisionCheck AI</h1>
      <div className="input-container">
        <label>Age:</label>
        <input type="number" id="age" onChange={(e) => setAge(e.target.value)} />
        <label>Gender:</label>
        <select onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div className="columns">
        <EyeForm
          eyeSide="Left"
          setImage={setLeftImage}
          imageFile={leftImage}
          setDioptre1={setLeftDioptre1}
          setDioptre2={setLeftDioptre2}
          setAstigmatism={setLeftAstigmatism}
          setPhakicPseudophakic={setLeftPhakicPseudophakic}
          setPneumatic={setLeftPneumatic}
          setPachymetry={setLeftPachymetry}
          setAxialLength={setLeftAxialLength}
          setVFMD={setLeftVFMD}
        />
        <EyeForm
          eyeSide="Right"
          setImage={setRightImage}
          imageFile={rightImage}
          setDioptre1={setRightDioptre1}
          setDioptre2={setRightDioptre2}
          setAstigmatism={setRightAstigmatism}
          setPhakicPseudophakic={setRightPhakicPseudophakic}
          setPneumatic={setRightPneumatic}
          setPachymetry={setRightPachymetry}
          setAxialLength={setRightAxialLength}
          setVFMD={setRightVFMD}
        />
      </div>
      <button className="analyze-button" onClick={handleAnalyzeAndNavigate}>
        Analyze
      </button>
    </div>
  );
}

export default Home;