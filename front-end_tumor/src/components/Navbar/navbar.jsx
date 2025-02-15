import React from 'react'
import { useState } from 'react'
import {Link} from 'react-router-dom'
import { Logo, TumorAI ,Newlogo} from '../../assets/index'
import './navbar.css'
import  CustButton  from '../custbutton/custbutton'
import { Button } from '@mui/base/Button';


export const Navbar = () => {
    const [activeItem, setActiveItem] = useState("home");
  
    const handleItemClick = (itemName) => {
      setActiveItem(itemName);
    };
  return (
    <>
    <div className='navbar'>
    <img src={Newlogo} alt='logo' className='logo' />
      <div className='links'>
        <ul>
          <li className={activeItem === "home" ? "home active" : "home"}  onClick={() => handleItemClick("home")}><Link  to='/'>Home</Link></li>
          <li className={activeItem === "aboutus" ? "aboutus active" : "aboutus"}onClick={() => handleItemClick("aboutus")}><Link  to='/aboutus'>About Us</Link></li>
          <li className={activeItem === "contactus" ? "contactus active" : "contactus"}onClick={() => handleItemClick("contactus")}><Link  to='/contactus'>Contact Us</Link></li>
            
        </ul>
      </div>
      <Link  to='/login' >
    <Button className='login'>Login</Button>
  </Link>
      <Link  to='/register'><Button className='register'>Register</Button></Link>
     </div>
    </>
  )
}