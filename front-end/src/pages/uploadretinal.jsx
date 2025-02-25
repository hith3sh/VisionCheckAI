import React, { useState } from 'react'
import './uploadretinal.css'
import { TumorsImage } from '../assets/index';
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
        leftVFMD: '',
        // Right eye data
        rightDioptre1: '',
        rightDioptre2: '',
        rightAstigmatism: '',
        rightLens: 'no',
        rightPneumatic: '',
        rightPachymetry: '',
        rightAxialLength: '',
        rightVFMD: '',
    });

    const [leftEyeImage, setLeftEyeImage] = useState(null);
    const [rightEyeImage, setRightEyeImage] = useState(null);
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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

            const response = await fetch('http://localhost:8080/api/v1/submit', {
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
                    rightImage: rightEyeImage
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
                                    />
                                    <input
                                        type="number"
                                        name="leftDioptre2"
                                        placeholder="Dioptre 2"
                                        value={formData.leftDioptre2}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="leftAstigmatism"
                                        placeholder="Astigmatism"
                                        value={formData.leftAstigmatism}
                                        onChange={handleInputChange}
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
                                    />
                                    <input
                                        type="number"
                                        name="leftPachymetry"
                                        placeholder="Pachymetry"
                                        value={formData.leftPachymetry}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="leftAxialLength"
                                        placeholder="Axial Length"
                                        value={formData.leftAxialLength}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="leftVFMD"
                                        placeholder="VF MD"
                                        value={formData.leftVFMD}
                                        onChange={handleInputChange}
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
                                    />
                                    <input
                                        type="number"
                                        name="rightDioptre2"
                                        placeholder="Dioptre 2"
                                        value={formData.rightDioptre2}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="rightAstigmatism"
                                        placeholder="Astigmatism"
                                        value={formData.rightAstigmatism}
                                        onChange={handleInputChange}
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
                                    />
                                    <input
                                        type="number"
                                        name="rightPachymetry"
                                        placeholder="Pachymetry"
                                        value={formData.rightPachymetry}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="rightAxialLength"
                                        placeholder="Axial Length"
                                        value={formData.rightAxialLength}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="rightVFMD"
                                        placeholder="VF MD"
                                        value={formData.rightVFMD}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

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

