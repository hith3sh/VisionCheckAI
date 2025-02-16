import React from 'react'
import './footer.css'
import { Backhead, Gradient, Bottompath, WhiteLogo,Newlogo } from '../../assets/index';
import { Link, animateScroll as scroll } from 'react-scroll';

export const CustFooter = () => {

  const scrollToSection = (sectionId) => {
    console.log(sectionId);
    scroll.scrollTo(sectionId, {
      smooth: true,
      duration: 500, 
    });
  };
  

  return (
    <div className='footer'>
        <img src={WhiteLogo} alt='logo' className='white-logo' />


<div className='footer-links'>
    <ul>
        <li className='wws'><Link to="whoWeServe" smooth={true} duration={500}  onClick={() => scrollToSection('whoWeServe')}>WHO WE SERVE</Link>
</li>
        <li className='osns'><Link to="ourSolutions" smooth={true} duration={500}  onClick={() => scrollToSection('ourSolutions')}>OUR SOLUTIONS</Link></li>
        <li className='hwtwouse'><Link to="howToUse" smooth={true} duration={500}>OUR SOLUTIONS</Link></li>
    </ul>
</div>

        <div className='footer-links-2'>
            <ul>
                <li className='home-1'><a href='/'>HOME</a></li>
                <li className='aboutus-1'><a href='/aboutus'>ABOUT US</a></li>
                <li className='contactus-1'><a href='/contactus'>CONTACT US</a></li>
            </ul>
        </div>
        <p className='gtp'>Go to Page</p>
        <p className='ngt'>Navigate to</p>
        <p className='getintouch'>Get In Touch</p>
        <p className='no-1'>+94 78 947 5314</p>
    </div>

  );
}