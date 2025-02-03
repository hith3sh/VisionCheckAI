import React, {useEffect, useState, useRef} from 'react';
import { Link , useLocation} from 'react-router-dom';

function Results ({
  leftImage,
  rightImage,
}) {
  const location = useLocation();
  const {result} = location.state || {};
  const [leftImageUrl, setLeftImageUrl] = useState(null);
  const [rightImageUrl, setRightImageUrl] = useState(null);
  const prevLeftImageUrl = useRef(null);
  const prevRightImageUrl = useRef(null);

  useEffect(() => {
    if (leftImage) {
      const newLeftImageUrl = URL.createObjectURL(leftImage);
      setLeftImageUrl(newLeftImageUrl);
      if (prevLeftImageUrl.current) {
        URL.revokeObjectURL(prevLeftImageUrl.current);
      }
      prevLeftImageUrl.current = newLeftImageUrl;
    }
    if (rightImage) {
      const newRightImageUrl = URL.createObjectURL(rightImage);
      setRightImageUrl(newRightImageUrl);
      if (prevRightImageUrl.current) {
        URL.revokeObjectURL(prevRightImageUrl.current);
      }
      prevRightImageUrl.current = newRightImageUrl;
    }

    // Cleanup function to revoke the object URLs when the component unmounts
    return () => {
      if (prevLeftImageUrl.current) {
        URL.revokeObjectURL(prevLeftImageUrl.current);
      }
      if (prevRightImageUrl.current) {
        URL.revokeObjectURL(prevRightImageUrl.current);
      }
    };
  }, [leftImage, rightImage]);

  const getValuesBasedOnGlaucomaState = (glaucomaState) => {
    let riskScore, explanation, recommendation;
    console.log('glaucoastate:',glaucomaState)
    switch (glaucomaState) {
      case 'advanced glaucoma':
        riskScore = 'High(61-100%)';
        explanation = ' The model detected significant optic nerve damage, with a severely increased cup-to-disc ratio and substantial visual field loss. Patients may experience noticeable vision impairment, including blind spots or tunnel vision. Intraocular pressure is often elevated';
        recommendation = 'Immediate consultation with an ophthalmologist is crucial. Treatment options such as prescription eye drops, laser therapy (trabeculoplasty), or surgical intervention (trabeculectomy, shunt placement) should be considered. Frequent monitoring (every 1-3 months) is essential to prevent further progression.';
        break;
      case 'early glaucoma':
        riskScore = 'Moderate(21-60%)';
        explanation = 'The model identified an elevated cup-to-disc ratio, suggesting early signs of optic nerve damage. Mild visual field defects may be present, though symptoms are often not noticeable at this stage. Intraocular pressure may be slightly elevated or within the normal range (normal-tension glaucoma).';
        recommendation = 'It is recommended to monitor intraocular pressure regularly and schedule a follow-up in 6 months. Lifestyle modifications, such as maintaining a healthy diet, avoiding excessive caffeine, and staying hydrated, can be beneficial.';
        break;
      case 'normal control':
        riskScore = 'Low(0-20%)';
        explanation = 'No significant abnormalities detected. The cup-to-disc ratio is within a normal range, and there is no apparent optic nerve damage. Intraocular pressure (IOP) is within a healthy range.';
        recommendation = 'Maintain regular eye check-ups every 1-2 years, especially if there is a family history of glaucoma or other risk factors such as diabetes or high blood pressure.';
        break;
      default:
        riskScore = 'Unknown';
        explanation = 'The glaucoma state is unknown.';
        recommendation = 'Consult an ophthalmologist for further evaluation.';
        break;
    }

    return { riskScore, explanation, recommendation };
  };
  const leftEyeValues = result ? getValuesBasedOnGlaucomaState(result["glaucoma_state_left_eye"]) : {};
  const rightEyeValues = result ? getValuesBasedOnGlaucomaState(result["glaucoma_state_right_eye"]) : {};

  return (
    <div className="overlay">
      <h2 className="title">Glaucoma Prediction Results</h2>
      <div className="columns">
        <div className="column">
          <h3>Left Eye</h3>
          {leftImageUrl && <img src={leftImageUrl} alt="Left Eye Fundus Preview" className="result-image" />}
          <div className="highlight">
              <h4>State:</h4>
              <p>{result["glaucoma_state_left_eye"]}</p>
              <h4>Risk Score</h4> 
              <p>{leftEyeValues.riskScore}</p>
              <h4>Explanation:</h4>
              <p>{leftEyeValues.explanation}</p>
              <h4>Recommendation:</h4> 
              <p>{leftEyeValues.recommendation}</p>
            </div>
        </div>
        <div className="column">
          <h3>Right Eye</h3>
          {rightImageUrl && <img src={rightImageUrl} alt="Right Eye Fundus Preview" className="result-image" />}
          <div className="highlight">
              <h4>State:</h4>
              <p>{result["glaucoma_state_right_eye"]}</p>
              <h4>Risk Score</h4> 
              <p>{rightEyeValues.riskScore}</p>
              <h4>Explanation:</h4>
              <p>{leftEyeValues.explanation}</p>
              <h4>Recommendation:</h4> 
              <p>{rightEyeValues.recommendation}</p>
            </div>
        </div>
      </div>
      <div className="output-container">

      </div>
      <button className="back-button">
        <Link to="/" className="link">Back to Home</Link>
      </button>
    </div>
  );
};

export default Results;
