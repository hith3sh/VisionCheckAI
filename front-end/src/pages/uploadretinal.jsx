import React, { useState } from 'react'
import './uploadretinal.css'
import { TumorsImage } from '../../public/assets/index';
import DropFileInput from '../components/drop-file-input/DropFileInput';
import { Button } from '@mui/base/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { GridLoader } from 'react-spinners';
import { getAuth } from 'firebase/auth';

export const UploadRetinal = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_JAVA_BACKEND_URL;
    const [formData, setFormData] = useState({
        // Common data
        gender: '',
        age: '',
        // Left eye data
        leftDioptre1: '',
        leftDioptre2: '',
        leftAstigmatism: '',
        leftLens: 'no',
        leftPneumatic: '',
        leftPachymetry: '',
        leftAxialLength: '',
        // Right eye data
        rightDioptre1: '',
        rightDioptre2: '',
        rightAstigmatism: '',
        rightLens: 'no',
        rightPneumatic: '',
        rightPachymetry: '',
        rightAxialLength: '',
    });

    const [leftEyeImage, setLeftEyeImage] = useState(null);
    const [rightEyeImage, setRightEyeImage] = useState(null);
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const fieldRanges = {
        leftDioptre1: { min: -3, max: 5 },
        leftDioptre2: { min: -2, max: 2 },
        leftAstigmatism: { min: 75, max: 115 },
        leftPneumatic: { min: 10, max: 23 },
        leftPachymetry: { min: 450, max: 650 },
        leftAxialLength: { min: 22, max: 25 },
    
        rightDioptre1: { min: -3, max: 5 },
        rightDioptre2: { min: -2, max: 2 },
        rightAstigmatism: { min: -75, max: 115 },
        rightPneumatic: { min: 10, max: 23 },
        rightPachymetry: { min: 450, max: 650 },
        rightAxialLength: { min: 22, max: 25 },
    };
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const onLeftEyeChange = (file) => {
        console.log('Left eye file:', file);
        setLeftEyeImage(file);
    }

    const onRightEyeChange = (file) => {
        console.log('Right eye file:', file);
        setRightEyeImage(file);
    }

    const handleSubmit = async () => {
        // Validation checks
        if (!formData.age) {
            toast.error('Please enter your age');
            return;
        }
        if (!formData.gender) {
            toast.error('Please select your gender');
            return;
        }
        if (!leftEyeImage || !rightEyeImage) {
            toast.error('Please upload both eye images');
            return;
        }

        // Left eye validations
        if (!formData.leftDioptre1) {
            toast.error('Please enter Left Eye Dioptre 1');
            return;
        }
        if (!formData.leftDioptre2) {
            toast.error('Please enter Left Eye Dioptre 2');
            return;
        }
        if (!formData.leftAstigmatism) {
            toast.error('Please enter Left Eye Astigmatism');
            return;
        }
        if (!formData.leftPneumatic) {
            toast.error('Please enter Left Eye Pneumatic IOP');
            return;
        }
        if (!formData.leftPachymetry) {
            toast.error('Please enter Left Eye Pachymetry');
            return;
        }
        if (!formData.leftAxialLength) {
            toast.error('Please enter Left Eye Axial Length');
            return;
        }


        // Right eye validations
        if (!formData.rightDioptre1) {
            toast.error('Please enter Right Eye Dioptre 1');
            return;
        }
        if (!formData.rightDioptre2) {
            toast.error('Please enter Right Eye Dioptre 2');
            return;
        }
        if (!formData.rightAstigmatism) {
            toast.error('Please enter Right Eye Astigmatism');
            return;
        }
        if (!formData.rightPneumatic) {
            toast.error('Please enter Right Eye Pneumatic IOP');
            return;
        }
        if (!formData.rightPachymetry) {
            toast.error('Please enter Right Eye Pachymetry');
            return;
        }
        if (!formData.rightAxialLength) {
            toast.error('Please enter Right Eye Axial Length');
            return;
        }
        for (const [field, range] of Object.entries(fieldRanges)) {
            const value = parseFloat(formData[field]);
            if (isNaN(value) || value < range.min || value > range.max) {
                toast.error(`Invalid ${field}: Please enter a value between ${range.min} and ${range.max}`);
                return;
            }
        }

        // Check authentication first
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            toast.error('Please log in to continue', {
                onClose: () => {
                    // Navigate after toast is closed
                    setTimeout(() => {
                        navigate('/login');
                    }, 1000);
                }
            });
            return;
        }

        try {
            setIsLoading(true);
            const token = await user.getIdToken();

            const submitData = new FormData();
            submitData.append('leftImage', leftEyeImage);
            submitData.append('rightImage', rightEyeImage);
            submitData.append('data', JSON.stringify(formData));

            const response = await fetch(`${backendUrl}/api/v1/submit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: submitData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            navigate('/results', { 
                state: { 
                    results: result,
                    leftImage: leftEyeImage,
                    rightImage: rightEyeImage,
                    formData: formData
                } 
            });
        } catch (error) {
            toast.error('An error occurred during analysis');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
            />
            <div className="glaucoma-form-container">
                <h1 className="form-title">Glaucoma Detection</h1>
                
                {isLoading ? (
                    <div className="spinner-container">
                        <GridLoader 
                            color="#3A8EF6"
                            loading={isLoading}
                            size={15}
                        />
                        <p className="loading-text">Analyzing images...</p>
                    </div>
                ) : (
                    <>
                        <div className="patient-info">
                            <h2>Patient Information</h2>
                            <div className="common-inputs">
                                <select name="gender" value={formData.gender} onChange={handleInputChange}>
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                <input
                                    type="number"
                                    name="age"
                                    placeholder="Age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="eyes-container">
                            <div className="eye-column">
                                <h2>Left Eye</h2>
                                <DropFileInput onFileChange={onLeftEyeChange} />
                                <div className="eye-inputs">
                                    <input
                                        type="number"
                                        name="leftDioptre1"
                                        placeholder="Dioptre 1"
                                        value={formData.leftDioptre1}
                                        onChange={handleInputChange}
                                        min={fieldRanges.leftDioptre1.min}
                                        max={fieldRanges.leftDioptre1.max}
                                    />
                                    <input
                                        type="number"
                                        name="leftDioptre2"
                                        placeholder="Dioptre 2"
                                        value={formData.leftDioptre2}
                                        onChange={handleInputChange}
                                        min={fieldRanges.leftDioptre2.min}
                                        max={fieldRanges.leftDioptre2.max}
                                    />
                                    <input
                                        type="number"
                                        name="leftAstigmatism"
                                        placeholder="Astigmatism"
                                        value={formData.leftAstigmatism}
                                        onChange={handleInputChange}
                                        min={fieldRanges.leftAstigmatism.min}
                                        max={fieldRanges.leftAstigmatism.max}
                                    />
                                    <select name="leftLens" value={formData.leftLens} onChange={handleInputChange}>
                                        <option value="no">No Lens</option>
                                        <option value="yes">Has Lens</option>
                                    </select>
                                    <input
                                        type="number"
                                        name="leftPneumatic"
                                        placeholder="Pneumatic IOP"
                                        value={formData.leftPneumatic}
                                        onChange={handleInputChange}
                                        min={fieldRanges.leftPneumatic.min}
                                        max={fieldRanges.leftPneumatic.max}
                                    />
                                    <input
                                        type="number"
                                        name="leftPachymetry"
                                        placeholder="Pachymetry"
                                        value={formData.leftPachymetry}
                                        onChange={handleInputChange}
                                        min={fieldRanges.leftPachymetry.min}
                                        max={fieldRanges.leftPachymetry.max}
                                    />
                                    <input
                                        type="number"
                                        name="leftAxialLength"
                                        placeholder="Axial Length"
                                        value={formData.leftAxialLength}
                                        onChange={handleInputChange}
                                        min={fieldRanges.leftAxialLength.min}
                                        max={fieldRanges.leftAxialLength.max}
                                    />
                                </div>
                            </div>

                            <div className="eye-column">
                                <h2>Right Eye</h2>
                                <DropFileInput onFileChange={onRightEyeChange} />
                                <div className="eye-inputs">
                                    <input
                                        type="number"
                                        name="rightDioptre1"
                                        placeholder="Dioptre 1"
                                        value={formData.rightDioptre1}
                                        onChange={handleInputChange}
                                        min={fieldRanges.rightDioptre1.min}
                                        max={fieldRanges.rightDioptre1.max}
                                    />
                                    <input
                                        type="number"
                                        name="rightDioptre2"
                                        placeholder="Dioptre 2"
                                        value={formData.rightDioptre2}
                                        onChange={handleInputChange}
                                        min={fieldRanges.rightDioptre2.min}
                                        max={fieldRanges.rightDioptre2.max}
                                    />
                                    <input
                                        type="number"
                                        name="rightAstigmatism"
                                        placeholder="Astigmatism"
                                        value={formData.rightAstigmatism}
                                        onChange={handleInputChange}
                                        min={fieldRanges.rightAstigmatism.min}
                                        max={fieldRanges.rightAstigmatism.max}
                                    />
                                    <select name="rightLens" value={formData.rightLens} onChange={handleInputChange}>
                                        <option value="no">No Lens</option>
                                        <option value="yes">Has Lens</option>
                                    </select>
                                    <input
                                        type="number"
                                        name="rightPneumatic"
                                        placeholder="Pneumatic IOP"
                                        value={formData.rightPneumatic}
                                        onChange={handleInputChange}
                                        min={fieldRanges.rightPneumatic.min}
                                        max={fieldRanges.rightPneumatic.max}
                                    />
                                    <input
                                        type="number"
                                        name="rightPachymetry"
                                        placeholder="Pachymetry"
                                        value={formData.rightPachymetry}
                                        onChange={handleInputChange}
                                        min={fieldRanges.rightPachymetry.min}
                                        max={fieldRanges.rightPachymetry.max}
                                    />
                                    <input
                                        type="number"
                                        name="rightAxialLength"
                                        placeholder="Axial Length"
                                        value={formData.rightAxialLength}
                                        onChange={handleInputChange}
                                        min={fieldRanges.rightAxialLength.min}
                                        max={fieldRanges.rightAxialLength.max}
                                    />
                                </div>
                            </div>
                        </div>
                        <button className="bck-btn" onClick={() => navigate('/dashboard')}>
                            Back
                        </button>
                        <Button 
                            className="analyze-button"
                            onClick={handleSubmit}
                            disabled={!leftEyeImage || !rightEyeImage}
                        >
                            Analyze Images
                        </Button>
                    </>
                )}
            </div>
        </>
    );
}

