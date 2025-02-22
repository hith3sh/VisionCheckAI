import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './drop-file-input.css';
import uploadImg from '../../assets/cloud-upload-regular-240.png';

const DropFileInput = props => {
    const wrapperRef = useRef(null);
    const [file, setFile] = useState(null);

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');
    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');
    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        if (newFile) {
            setFile(newFile);
            props.onFileChange(newFile); // Just pass the file to parent without sending to backend
        }
    }

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
                    {file ? (
                        <p className="file-name">{file.name}</p>
                    ) : (
                        <p>Drag & Drop your files here</p>
                    )}
                </div>
                <input type="file" value="" onChange={onFileDrop} accept="image/*"/>
            </div>
        </>
    );
}

DropFileInput.propTypes = {
    onFileChange: PropTypes.func
}

export default DropFileInput;