import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './landingpage.css'; 
import  CustButton  from '../components/custbutton/custbutton';
import {Oursolutions} from '../components/landingpage/oursolutions';
import { Backhead, Gradient, Bottompath } from '../assets/index';
import { Button } from '@mui/base/Button';
import  {CustFooter}  from '../components/landingpage/footer';
import {UploadRetinal} from './uploadretinal'
import { Outlet, Link } from "react-router-dom";
import { Element } from 'react-scroll';

export const  Landingpage = () => {
  return (
    <>
    <img src={Gradient} alt='logo' className='gradient' />
    <img src={Backhead} alt='logo' className='logo2' />
    <p className='headingtxt'>
      Welcome to VisionCheck<span className='aitext'>.ai</span>
      <span className='subtext' style={{ display: 'block' }}>
      Empowering Glaucoma Detection With AI
      </span>
    </p>
    <p className='subline'>
      Using your Retinal Images we predict whether your patient has Glaucoma or not faster with the help of latest AI Technologies.
    </p>
    <Link to='/login'><Button className='scannow'>Scan Now</Button></Link>
    <Element name="whoWeServe">
    <section id='whoWeServe'>
    <p className='whoweserve'>
      WHO WE SERVE
    </p>
    <div className='whoweservebox'>
    <div className='whoweservebox-1'>
      <p className='mprof'>MEDICAL PROFESSIONALS</p>
      <p className='mprof-cnt'>Our advanced Glaucoma identification system is tailored to support medical professionals across various disciplines. Utilize our Artificial intelligence models to accurately identify Glaucoma conditions and aid in treatment planning.</p>
    </div>
    <div className='whoweservebox-2'>
    <p className='glohealth'>GLOBAL HEALTH</p>
    <p className='mprof-cnt'>we're dedicated to advancing global health by making advanced Glaucoma detection accessible worldwide. We believe that everyone, regardless of location or resources, should have the opportunity to benefit from cutting-edge medical technology</p>
    </div>
    <div className='whoweservebox-3'>
    <p className='glohealth'>IMPROVED QUALITY OF LIFE</p>
    <p className='mprof-cnt'>With early detection and personalized care, our aim is to enhance the quality of life for individuals affected by Glaucoma.</p>
    </div>
    </div>
    </section>
    </Element>  
   <Element name='ourSolutions'>
   <section id='ourSolutions'>
    
    <p className='oursolution'>OUR SOLUTIONS</p>
    <Oursolutions/>
    <div className='line'></div>
    </section>
   </Element>
    
    <section id='howToUse'>
       <p className='howtouse'>How To Use The System</p>

    <img src={Bottompath} alt='logo' className='btm-path' />
    </section>
    <CustFooter/>
    <Outlet />
    </>
  );
};
