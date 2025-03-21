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
import { FaStethoscope, FaGlobe, FaHeart } from "react-icons/fa";

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


    <div className="scannow-container">
      <Link to="/login">
        <button className="scannow">Scan Now</button>
      </Link>
    </div>


    <Element name="whoWeServe"> <section id='whoWeServe'> <p className='whoweserve'></p>
    <div className='whoweservebox'>
      <div className='whoweservebox-1'>
      <div className='glohealth'>
          <FaStethoscope size={40} className="icon" />
          <h3>MEDICAL PROFESSIONALS</h3>
      </div>
        <p className='mprof-cnt1'>Our advanced Glaucoma identification system is tailored 
          to support medical professionals across various disciplines. 
          Utilize our Artificial intelligence models to accurately identify 
          Glaucoma conditions and aid in treatment planning.</p>
      </div>

    <div className='whoweservebox-2'>
      <div className='glohealth'>
          <FaGlobe size={40} className="icon" />
          <h3>GLOBAL HEALTH</h3>
      </div>
      <p className='mprof-cnt2'>we're dedicated to advancing global health by making 
        advanced Glaucoma detection accessible worldwide. We believe that everyone, 
        regardless of location or resources, should have the opportunity to benefit 
        from cutting-edge medical technology</p>
    </div>

    <div className='whoweservebox-3'>
      <div className='glohealth'>
          <FaGlobe size={40} className="icon" />
          <h3>IMPROVED QUALITY OF LIFE</h3>
      </div>
      <p className='mprof-cnt3'>
      With a strong focus on early detection and tailored, personalized care, our goal is 
      to significantly enhance the overall quality of life for individuals affected by Glaucoma, 
      empowering them with better management strategies and improved long-term outcomes.</p>
    </div>
    </div>
    </section>
    </Element>  
   <Element name='ourSolutions'>
    <section id='ourSolutions'>
        {/* <p className='oursolution'>OUR SOLUTIONS</p> */}
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
