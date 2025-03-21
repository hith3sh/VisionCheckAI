import React, { useEffect, useState } from 'react';
import './App.css';
import { Landingpage } from './pages/landingpage';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Navbar} from './components/Navbar/navbar';
import { Aboutus } from './pages/aboutus';
import  ContactUs  from './pages/contactus';
import  NoPage  from './pages/nopage';
import Login from './pages/login';
import { UploadRetinal } from './pages/uploadretinal';
import Register from './pages/register';
import {Dashboard} from './pages/dashboard';
import Results from './pages/results';
import History from './pages/history';
import Profile from './pages/profile';

function App() {

  const LayoutWithNavbar = () => (
    <>
      <Navbar />
      <Outlet />
    </>
  );

  const [data, setData] = useState([]);



  
  return (
    <>
    <BrowserRouter>
    <Routes>
      {/* Routes with Navbar */}
      <Route
        element={<LayoutWithNavbar />}
      >
        <Route index element={<Landingpage />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/contactus" element={<ContactUs />} />
        
      </Route>

      {/* Routes without Navbar */}
      <Route path="/uploadretinal" element={<UploadRetinal />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/*" element={<NoPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/results" element={<Results />} />
      <Route path="/history" element={<History />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
    </BrowserRouter>


    </>

  );
}

export default App;
