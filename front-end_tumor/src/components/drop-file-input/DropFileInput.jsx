import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'; 
import './drop-file-input.css';

import { ImageConfig } from '../../assets/index'; 
import uploadImg from '../../assets/cloud-upload-regular-240.png';

const DropFileInput = props => {

    const wrapperRef = useRef(null);

    const [fileList, setFileList] = useState([]);
    const [uploadedImage, setUploadedImage] = useState(null);
    const onDragEnter = () => wrapperRef.current.classList.add('dragover');

    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        if (newFile) {
            const updatedList = [...fileList, newFile];
            setFileList(updatedList);
            props.onFileChange(updatedList);
            sendFileToBackend(newFile);
        }
        
    }

    const sendFileToBackend = (file) => {
        const formData = new FormData();
        formData.append('file', file);

        // Replace 'YOUR_BACKEND_API_URL' with the actual URL of your Flask backend
        axios.post('http://127.0.0.1:12000/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then((response) => {
            // Handle the response from the backend (e.g., display a success message)
            console.log('File uploaded successfully', response.data);
            const segmentedImagePath = response.data['segmented_image_path'];
            console.log('Segmented image path:', segmentedImagePath);
            setUploadedImage(segmentedImagePath);
            props.onFileChange(segmentedImagePath);
        })
        .catch((error) => {
            // Handle any errors that occurred during the upload
            console.error('Error uploading file', error);
        });
    }

    // const fileRemove = (file) => {
    //     const updatedList = [...fileList];
    //     updatedList.splice(fileList.indexOf(file), 1);
    //     setFileList(updatedList);
    //     props.onFileChange(updatedList);
    // }

    return (
        <>
            <div
                ref={wrapperRef}
                className="drop-file-input"
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="drop-file-input__label">
                    <img src={uploadImg} alt="" />
                    <p>Drag & Drop your files here</p>
                </div>
                <input type="file" value="" onChange={onFileDrop}/>
            </div>
        </>
    );
}

DropFileInput.propTypes = {
    onFileChange: PropTypes.func
}

export default DropFileInput;