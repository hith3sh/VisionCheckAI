import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from "@mui/material/Typography";
import './results.css';
import { styled } from '@mui/material/styles';
import LoadingSpinner from '../components/LoadingSpinner';

// Add these styled components
const StyledAccordion = styled(Accordion)(({ theme }) => ({
    backgroundColor: 'white',
    borderRadius: '10px',
    '&:before': {
        display: 'none',
    },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
    '& .MuiAccordionSummary-content': {
        fontFamily: 'Montserrat',
    },
}));

function Results() {
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { results, leftImage, rightImage } = location.state || {};

    useEffect(() => {
        if (results) {
            setIsLoading(false);
        }
    }, [results]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const getValuesBasedOnGlaucomaState = (glaucomaState) => {
        let riskScore, explanation, recommendation;
        console.log('glaucomastate:', glaucomaState);
        
        switch (glaucomaState) {
            case 'advanced glaucoma':
                riskScore = 'High(61-100%)';
                explanation = 'The model detected significant optic nerve damage, with a severely increased cup-to-disc ratio and substantial visual field loss. Patients may experience noticeable vision impairment, including blind spots or tunnel vision. Intraocular pressure is often elevated';
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

    if (!results) {
        return (
            <div className="no-results">
                <h2>No results available</h2>
                <button onClick={() => navigate('/upload')} className="new-scan-button">
                    Go to Upload Page
                </button>
            </div>
        );
    }

    const leftEyeValues = getValuesBasedOnGlaucomaState(results.glaucoma_state_left_eye);
    const rightEyeValues = getValuesBasedOnGlaucomaState(results.glaucoma_state_right_eye);

    return (
        <div className="results-page">
            <h1>Glaucoma Detection Results</h1>
            
            <div className="results-container">
                <div className="result-box">
                    <h3>Left Eye Results</h3>
                    {leftImage && <img src={URL.createObjectURL(leftImage)} alt="Left Eye" className="result-image" />}
                    <div className="diagnosis">
                        <h4>State:</h4>
                        <p className={`diagnosis-text ${results.glaucoma_state_left_eye.toLowerCase().replace(' ', '-')}`}>
                            {results.glaucoma_state_left_eye}
                        </p>
                        <h4>Risk Score:</h4>
                        <p>{leftEyeValues.riskScore}</p>
                        <h4>Explanation:</h4>
                        <p>{leftEyeValues.explanation}</p>
                        <h4>Recommendation:</h4>
                        <p>{leftEyeValues.recommendation}</p>
                    </div>
                </div>

                <div className="result-box">
                    <h3>Right Eye Results</h3>
                    {rightImage && <img src={URL.createObjectURL(rightImage)} alt="Right Eye" className="result-image" />}
                    <div className="diagnosis">
                        <h4>State:</h4>
                        <p className={`diagnosis-text ${results.glaucoma_state_right_eye.toLowerCase().replace(' ', '-')}`}>
                            {results.glaucoma_state_right_eye}
                        </p>
                        <h4>Risk Score:</h4>
                        <p>{rightEyeValues.riskScore}</p>
                        <h4>Explanation:</h4>
                        <p>{rightEyeValues.explanation}</p>
                        <h4>Recommendation:</h4>
                        <p>{rightEyeValues.recommendation}</p>
                    </div>
                </div>
            </div>

            <div className="output-container">
                <StyledAccordion>
                    <StyledAccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>Show Explainable AI Results</Typography>
                    </StyledAccordionSummary>
                    <AccordionDetails>
                        <div className="explainable-container">
                            {/* Left Eye Container */}
                            <div className="eye-xai-box">
                                <h3>Left Eye Analysis</h3>
                                <div className="xai-content">
                                    <div className="xai-section">
                                        <h4>GradCAM Visualization</h4>
                                        {results.left_gradcam_path && (
                                            <img 
                                                src={results.left_gradcam_path} 
                                                alt="Left Eye GradCAM" 
                                                className="xai-image"
                                            />
                                        )}
                                    </div>
                                    <div className="xai-section">
                                        <h4>SHAP Analysis</h4>
                                        {results.left_shap_path && (
                                            <img 
                                                src={results.left_shap_path} 
                                                alt="Left Eye SHAP" 
                                                className="xai-image"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Eye Container */}
                            <div className="eye-xai-box">
                                <h3>Right Eye Analysis</h3>
                                <div className="xai-content">
                                    <div className="xai-section">
                                        <h4>GradCAM Visualization</h4>
                                        {results.right_gradcam_path && (
                                            <img 
                                                src={results.right_gradcam_path} 
                                                alt="Right Eye GradCAM" 
                                                className="xai-image"
                                            />
                                        )}
                                    </div>
                                    <div className="xai-section">
                                        <h4>SHAP Analysis</h4>
                                        {results.right_shap_path && (
                                            <img 
                                                src={results.right_shap_path} 
                                                alt="Right Eye SHAP" 
                                                className="xai-image"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AccordionDetails>
                </StyledAccordion>
            </div>

            <div className="actions">
                <button onClick={() => navigate('/upload')} className="new-scan-button">
                    New Scan
                </button>
                <button onClick={() => window.print()} className="print-button">
                    Print Results
                </button>
            </div>
        </div>
    );
}

export default Results;