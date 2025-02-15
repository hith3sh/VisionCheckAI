import React from 'react'
import InputFileUpload from '../components/mrisection/fileupload'
import './uploadmri.css'
import { TumorsImage} from '../assets/index';
import DropFileInput from '../components/drop-file-input/DropFileInput';
import { Button } from '@mui/base/Button';





export const Uploadmri = () => {
    const onFileChange = (files) => {
        console.log(files);
    }
  return (
    <>
     <p id='uploadmri-1'>Brain Tumor Segmentation</p>
    <div className='white-box-1'>
    <div className='fileup-1'><InputFileUpload /></div>
    <DropFileInput onFileChange={(files) => onFileChange(files)} />
    </div>
    <Button className='submit-1'>Submit</Button>
    <p className='top-txt-1'>Upload MRI Image</p>
    <p className='subline-2'>Step into the future of brain tumor detection with our revolutionary technology. By simply uploading a .tiff image and clicking 'Scan,' our advanced U-Net model swiftly identifies tumor locations, offering healthcare professionals a streamlined and efficient tool for brain tumor segmentation and diagnosis.</p>
    <img src={TumorsImage} alt='logo' className='tumor-image-1' />
    <Button className='download-1'>Download</Button>
    </>
  )
}

