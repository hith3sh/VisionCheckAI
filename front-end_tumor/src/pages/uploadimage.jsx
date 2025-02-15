import './uploadimage.css'
import { btcancer} from '../assets/index';
import DropFileInput from '../components/drop-file-input/DropFileInput';
import { Button } from '@mui/base/Button';
import Container from '@mui/material/Container';
import { useState } from 'react';
import InputFileUpload from '../components/mrisection/fileupload'




export const BreastCancer = () => {
    const [selectedFile, setSelectedFile] = useState('');
    const onFileChange = (files) => {
      setSelectedFile(files);
    }
  return (
    <>
     <p id='uploadmri-1'>Breast Cancer Detection</p>
    <div className='white-box-1'>
    <div className='fileup-1'><InputFileUpload /></div>
    <DropFileInput onFileChange={(files) => onFileChange(files)} />
    </div>
    <Button className='submit-1'>Submit</Button>
    <p className='top-txt-1'>Upload  Image</p>
    <p className='subline-2'>Step into the future of breast cancer detection  with our revolutionary technology. By simply uploading a .jpeg image and clicking 'Scan,' our advanced U-Net model swiftly identifies cancer locations, offering healthcare professionals a streamlined and efficient tool for breast cancer detection.</p>
    <Container><img src={btcancer} alt='logo' className='tumor-image-2'  /><p className='top-txt-2'>Malignant</p></Container>
    
    <Button className='download-1'>Download</Button>
    </>
  )
}